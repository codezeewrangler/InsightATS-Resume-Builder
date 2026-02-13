import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import DOMPurify from 'dompurify';
import html2pdf from 'html2pdf.js';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Eye, History, Users } from 'lucide-react';

import { env } from '@/lib/env';
import { debounce } from '@/lib/debounce';
import { ApiError } from '@/lib/apiClient';
import { FreeTierStatusCard } from '@/components/FreeTierStatusCard';
import { resumeApi, ResumeVersion, Collaborator } from '@/lib/resumeApi';
import { useAuthStore } from '@/store/authStore';
import { useEditorStore } from '@/store/editorStore';
import { useFreeTierStore } from '@/store/freeTierStore';
import { EditorToolbar } from './components/EditorToolbar';
import { EditorPreview } from './components/EditorPreview';
import { VersionHistoryPanel } from './components/VersionHistoryPanel';
import { ResumeList } from './components/ResumeList';
import { CollaboratorPanel } from './components/CollaboratorPanel';

interface ResumeEditorPageProps {
  darkMode?: boolean;
  onRequireAuth: () => void;
}

const defaultTemplate = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Your Name' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Role | email@example.com | +1 555 123 4567' }],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Summary' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Impact-focused summary of your experience.' }],
    },
  ],
};

const markdownParser = new MarkdownIt({ breaks: true, linkify: true });
const turndownService = new TurndownService();

const decodeJwtExpiryMs = (token: string) => {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return null;
    }
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = JSON.parse(window.atob(padded)) as { exp?: number };
    if (typeof decoded.exp !== 'number') {
      return null;
    }
    return decoded.exp * 1000;
  } catch {
    return null;
  }
};

const isAccessTokenExpiringSoon = (token: string, thresholdMs = 45_000) => {
  const expiryMs = decodeJwtExpiryMs(token);
  if (!expiryMs) {
    return false;
  }
  return Date.now() >= expiryMs - thresholdMs;
};

export function ResumeEditorPage({ darkMode, onRequireAuth }: ResumeEditorPageProps) {
  const { accessToken, user } = useAuthStore();
  const { resumes, activeResumeId, setResumes, setActiveResumeId } = useEditorStore();
  const { data: freeTierUsage, refresh: refreshFreeTierUsage } = useFreeTierStore();

  const [role, setRole] = useState<'owner' | 'editor' | 'viewer'>('owner');
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [markdownValue, setMarkdownValue] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'preview' | 'versions' | 'collaborators'>(
    'preview',
  );
  const wsRefreshInFlightRef = useRef<Promise<boolean> | null>(null);

  const resumeLimitReached = Boolean(
    freeTierUsage &&
      freeTierUsage.usage.resumesUsed >= freeTierUsage.limits.resumesPerUser,
  );
  const versionLimitReached = Boolean(
    freeTierUsage &&
      typeof freeTierUsage.usage.versionsUsedForActiveResume === 'number' &&
      freeTierUsage.usage.versionsUsedForActiveResume >= freeTierUsage.limits.versionsPerResume,
  );
  const collaboratorLimitReached = Boolean(
    freeTierUsage &&
      typeof freeTierUsage.usage.collaboratorsUsedForActiveResume === 'number' &&
      freeTierUsage.usage.collaboratorsUsedForActiveResume >=
        freeTierUsage.limits.collaboratorsPerResume,
  );

  const ydoc = useMemo(() => new Y.Doc(), [activeResumeId]);
  const provider = useMemo(() => {
    if (!activeResumeId || !accessToken) {
      return null;
    }
    return new WebsocketProvider(env.VITE_WS_URL, activeResumeId, ydoc, {
      connect: false,
      maxBackoffTime: 4000,
      params: { token: accessToken },
    });
  }, [activeResumeId, accessToken, ydoc]);

  useEffect(() => {
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    let disposed = false;

    const refreshSessionForWs = async () => {
      if (wsRefreshInFlightRef.current) {
        return wsRefreshInFlightRef.current;
      }

      provider.disconnect();

      const refreshPromise = useAuthStore
        .getState()
        .refresh()
        .then((ok) => {
          if (!ok && !disposed) {
            setActionError('Session expired. Please sign in again to continue live collaboration.');
            onRequireAuth();
          }
          if (ok && !disposed) {
            setActionError((current) =>
              current?.includes('Session expired') ? null : current,
            );
          }
          return ok;
        })
        .finally(() => {
          wsRefreshInFlightRef.current = null;
        });

      wsRefreshInFlightRef.current = refreshPromise;
      return refreshPromise;
    };

    const handleConnectionClose = (event: { code?: number; reason?: string }) => {
      const reason = `${event.reason ?? ''}`.toLowerCase();
      const isAuthFailure =
        event.code === 1008 ||
        event.code === 1006 ||
        event.code === 4001 ||
        event.code === 4003 ||
        event.code === 4401 ||
        event.code === 4403 ||
        reason.includes('unauthorized') ||
        reason.includes('token') ||
        reason.includes('forbidden');

      if (!isAuthFailure) {
        return;
      }

      void refreshSessionForWs();
    };

    const handleConnectionError = () => {
      if (!provider.wsconnected && !provider.wsconnecting) {
        void refreshSessionForWs();
      }
    };

    provider.on('connection-close', handleConnectionClose);
    provider.on('connection-error', handleConnectionError);
    provider.connect();

    return () => {
      disposed = true;
      provider.off('connection-close', handleConnectionClose);
      provider.off('connection-error', handleConnectionError);
      provider.disconnect();
    };
  }, [provider, onRequireAuth]);

  useEffect(() => {
    if (!accessToken || !isAccessTokenExpiringSoon(accessToken)) {
      return;
    }

    let cancelled = false;
    const refreshSession = async () => {
      const refreshed = await useAuthStore.getState().refresh();
      if (!refreshed && !cancelled) {
        setActionError('Session expired. Please sign in again.');
        onRequireAuth();
      }
    };

    void refreshSession();

    return () => {
      cancelled = true;
    };
  }, [accessToken, onRequireAuth]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: 'Start writing your resume…' }),
        Highlight,
        TextStyle,
        Color,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Collaboration.configure({ document: ydoc }),
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: {
                  name: user?.email ?? 'Anonymous',
                  color: '#6366f1',
                },
              }),
            ]
          : []),
      ],
    },
    [activeResumeId, accessToken],
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    resumeApi
      .list(accessToken)
      .then((data) => {
        setResumes(data.resumes);
        if (!activeResumeId && data.resumes[0]) {
          setActiveResumeId(data.resumes[0].id);
        }
      })
      .catch(() => {
        setResumes([]);
      });
  }, [accessToken, activeResumeId, setActiveResumeId, setResumes]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    refreshFreeTierUsage(accessToken, activeResumeId ?? undefined).catch(() => undefined);
  }, [accessToken, activeResumeId, refreshFreeTierUsage]);

  const createResume = async () => {
    if (!accessToken) {
      onRequireAuth();
      return;
    }
    if (resumeLimitReached) {
      setActionError('Free-tier resume limit reached (3/3).');
      return;
    }

    try {
      const data = await resumeApi.create(accessToken, { title: 'New Resume', content: defaultTemplate });
      setResumes([data.resume, ...resumes]);
      setActiveResumeId(data.resume.id);
      setActionError(null);
      await refreshFreeTierUsage(accessToken, data.resume.id);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Failed to create resume.');
    }
  };

  useEffect(() => {
    if (!accessToken || !activeResumeId || !editor) {
      return;
    }

    const loadResume = async () => {
      const { resume, role } = await resumeApi.get(accessToken, activeResumeId);
      setRole(role);
      if (resume.content) {
        editor.commands.setContent(resume.content, false);
      } else {
        editor.commands.setContent(defaultTemplate, false);
      }
    };

    loadResume().catch(() => undefined);
  }, [accessToken, activeResumeId, editor]);

  useEffect(() => {
    if (!accessToken || !activeResumeId) {
      return;
    }

    resumeApi
      .listVersions(accessToken, activeResumeId)
      .then((data) => setVersions(data.versions))
      .catch(() => setVersions([]));
  }, [accessToken, activeResumeId]);

  useEffect(() => {
    if (!accessToken || !activeResumeId) {
      setCollaborators([]);
      return;
    }

    resumeApi
      .listCollaborators(accessToken, activeResumeId)
      .then((data) => setCollaborators(data.collaborators))
      .catch(() => setCollaborators([]));
  }, [accessToken, activeResumeId]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updatePreview = debounce(() => {
      if (activeSidePanel !== 'preview') {
        return;
      }
      const html = DOMPurify.sanitize(editor.getHTML());
      setPreviewHtml(html);
    }, 280);

    if (activeSidePanel === 'preview') {
      updatePreview();
    }

    editor.on('update', updatePreview);
    return () => {
      editor.off('update', updatePreview);
    };
  }, [editor, activeSidePanel]);

  useEffect(() => {
    if (!editor || !accessToken || !activeResumeId || role === 'viewer') {
      return;
    }

    let disposed = false;

    const save = debounce(async () => {
      try {
        setIsSaving(true);
        const content = editor.getJSON();
        let tokenForSave = accessToken;
        try {
          await resumeApi.update(tokenForSave, activeResumeId, { content });
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401) {
            throw error;
          }

          const refreshed = await useAuthStore.getState().refresh();
          if (!refreshed) {
            throw new ApiError('Session expired. Please sign in again.', 401);
          }

          tokenForSave = useAuthStore.getState().accessToken;
          if (!tokenForSave) {
            throw new ApiError('Session expired. Please sign in again.', 401);
          }

          await resumeApi.update(tokenForSave, activeResumeId, { content });
        }

        if (!disposed) {
          setLastSavedAt(new Date().toLocaleTimeString());
          setActionError((current) => (current?.includes('Autosave failed') ? null : current));
        }
      } catch (error) {
        if (!disposed) {
          const message =
            error instanceof ApiError ? error.message : 'Network issue while saving your resume.';
          setActionError(`Autosave failed: ${message}`);
          if (error instanceof ApiError && error.status === 401) {
            onRequireAuth();
          }
        }
      } finally {
        if (!disposed) {
          setIsSaving(false);
        }
      }
    }, 1800);

    const handleUpdate = () => {
      save();
    };

    editor.on('update', handleUpdate);

    return () => {
      disposed = true;
      editor.off('update', handleUpdate);
    };
  }, [editor, accessToken, activeResumeId, role, onRequireAuth]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.setEditable(role !== 'viewer');
  }, [editor, role]);

  const handleSaveVersion = async () => {
    if (!accessToken || !activeResumeId || !editor) {
      return;
    }
    if (versionLimitReached) {
      setActionError('Free-tier version limit reached (20/20).');
      return;
    }

    try {
      const snapshot = editor.getJSON();
      await resumeApi.createVersion(accessToken, activeResumeId, snapshot);
      const updated = await resumeApi.listVersions(accessToken, activeResumeId);
      setVersions(updated.versions);
      await refreshFreeTierUsage(accessToken, activeResumeId);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Failed to save version.');
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!accessToken || !activeResumeId || !editor) {
      return;
    }
    if (versionLimitReached) {
      setActionError('Cannot restore version: free-tier version limit reached (20/20).');
      return;
    }
    try {
      const result = await resumeApi.restoreVersion(accessToken, activeResumeId, versionId);
      if (result.resume.content) {
        editor.commands.setContent(result.resume.content, false);
      }
      const updated = await resumeApi.listVersions(accessToken, activeResumeId);
      setVersions(updated.versions);
      await refreshFreeTierUsage(accessToken, activeResumeId);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Failed to restore version.');
    }
  };

  const handleAddCollaborator = async (email: string, collaboratorRole: 'editor' | 'viewer') => {
    if (!accessToken || !activeResumeId) {
      return;
    }
    if (collaboratorLimitReached) {
      setActionError('Free-tier collaborator limit reached (2/2).');
      return;
    }

    try {
      await resumeApi.addCollaborator(accessToken, activeResumeId, {
        email,
        role: collaboratorRole,
      });
      const updatedCollaborators = await resumeApi.listCollaborators(accessToken, activeResumeId);
      setCollaborators(updatedCollaborators.collaborators);
      await refreshFreeTierUsage(accessToken, activeResumeId);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Failed to add collaborator.');
    }
  };

  const handleExportPdf = async () => {
    if (!editor) {
      return;
    }
    const html = DOMPurify.sanitize(editor.getHTML());
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-10000px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '794px';
    exportContainer.style.background = '#ffffff';
    exportContainer.style.color = '#0f172a';
    exportContainer.style.padding = '40px 44px';
    exportContainer.style.boxSizing = 'border-box';
    exportContainer.style.fontFamily =
      '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    exportContainer.innerHTML = `
      <style>
        .resume-export-root h1 { font-size: 28px; margin: 0 0 8px; font-weight: 700; }
        .resume-export-root h2 { font-size: 20px; margin: 22px 0 8px; font-weight: 650; }
        .resume-export-root h3 { font-size: 16px; margin: 18px 0 6px; font-weight: 600; }
        .resume-export-root p { margin: 0 0 10px; line-height: 1.5; }
        .resume-export-root ul, .resume-export-root ol { margin: 0 0 12px 20px; line-height: 1.5; }
        .resume-export-root li { margin-bottom: 6px; }
        .resume-export-root a { color: #4338ca; text-decoration: underline; }
      </style>
      <div class="resume-export-root">${html}</div>
    `;

    document.body.appendChild(exportContainer);

    const activeResume = resumes.find((resume) => resume.id === activeResumeId);
    const fileName = `${(activeResume?.title || 'resume')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}.pdf`;

    try {
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(exportContainer)
        .save();
      setActionError(null);
    } catch (error) {
      setActionError('PDF export failed. Please try again after a few edits.');
      console.error('Export PDF failed', error);
    } finally {
      document.body.removeChild(exportContainer);
    }
  };

  const handleToggleMarkdown = () => {
    if (!editor) {
      return;
    }

    if (!showMarkdown) {
      const markdown = turndownService.turndown(editor.getHTML());
      setMarkdownValue(markdown);
      setShowMarkdown(true);
    } else {
      const html = markdownParser.render(markdownValue);
      editor.commands.setContent(html, false);
      setShowMarkdown(false);
    }
  };

  if (!accessToken) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Sign in to use the Resume Editor</h2>
        <p className="mt-2 text-sm text-slate-600">
          Real-time collaboration, version history, and auto-save require authentication.
        </p>
        <button
          type="button"
          onClick={onRequireAuth}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FreeTierStatusCard data={freeTierUsage} darkMode={darkMode} />
      {actionError && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            darkMode
              ? 'border-red-500/40 bg-red-500/10 text-red-200'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {actionError}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Real-time Resume Editor</h2>
          <p className="text-sm text-slate-600">
            {role === 'viewer' ? 'Viewer mode' : 'Autosave enabled'}
            {isSaving ? ' · Saving...' : ''}
            {!isSaving && lastSavedAt ? ` · Last saved at ${lastSavedAt}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">{role.toUpperCase()}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">Live sync</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-4 self-start xl:sticky xl:top-24">
          <ResumeList
            resumes={resumes}
            activeId={activeResumeId}
            onSelect={setActiveResumeId}
            onCreate={createResume}
            darkMode={darkMode}
            disableCreate={resumeLimitReached}
            createDisabledReason="Free-tier resume limit reached (3/3)."
          />
        </div>

        <div className="space-y-4">
          <EditorToolbar
            editor={editor}
            onExportPdf={handleExportPdf}
            onSaveVersion={handleSaveVersion}
            onToggleMarkdown={handleToggleMarkdown}
            showMarkdown={showMarkdown}
            readOnly={role === 'viewer'}
            disableSaveVersion={versionLimitReached}
            saveVersionDisabledReason="Free-tier version limit reached (20/20)."
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
              {showMarkdown ? (
                <textarea
                  value={markdownValue}
                  onChange={(event) => setMarkdownValue(event.target.value)}
                  rows={24}
                  className="h-full min-h-[640px] w-full resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900"
                />
              ) : (
                <EditorContent editor={editor} className="min-h-[640px]" />
              )}
            </div>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border p-2 shadow-sm ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900 text-slate-100'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveSidePanel('preview')}
                    className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                      activeSidePanel === 'preview'
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidePanel('versions')}
                    className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                      activeSidePanel === 'versions'
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <History className="h-3.5 w-3.5" />
                    Versions
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSidePanel('collaborators')}
                    className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                      activeSidePanel === 'collaborators'
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    Team
                  </button>
                </div>
              </div>

              {activeSidePanel === 'preview' && (
                <EditorPreview html={previewHtml} darkMode={darkMode} />
              )}

              {activeSidePanel === 'versions' && (
                <VersionHistoryPanel
                  versions={versions}
                  onRestore={handleRestore}
                  onRefresh={async () => {
                    if (!accessToken || !activeResumeId) {
                      return;
                    }
                    const data = await resumeApi.listVersions(accessToken, activeResumeId);
                    setVersions(data.versions);
                  }}
                  darkMode={darkMode}
                />
              )}

              {activeSidePanel === 'collaborators' && (
                <CollaboratorPanel
                  collaborators={collaborators}
                  onAdd={handleAddCollaborator}
                  darkMode={darkMode}
                  readOnly={role !== 'owner'}
                  disableAdd={collaboratorLimitReached}
                  addDisabledReason={
                    role !== 'owner'
                      ? 'Only owners can add collaborators.'
                      : 'Free-tier collaborator limit reached (2/2).'
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
