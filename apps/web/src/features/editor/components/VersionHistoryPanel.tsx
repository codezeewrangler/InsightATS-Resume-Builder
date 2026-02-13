import { ResumeVersion } from '@/lib/resumeApi';
import { RefreshCcw } from 'lucide-react';

interface VersionHistoryPanelProps {
  versions: ResumeVersion[];
  onRestore: (versionId: string) => void;
  onRefresh: () => void;
  darkMode?: boolean;
}

export function VersionHistoryPanel({
  versions,
  onRestore,
  onRefresh,
  darkMode,
}: VersionHistoryPanelProps) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? 'border-slate-700 bg-slate-900 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Version History
        </h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600"
          onClick={onRefresh}
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {versions.length === 0 ? (
        <p className="text-sm text-slate-500">No versions yet. Save one to see it here.</p>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}
            >
              <div>
                <p className="text-sm font-medium">Version {version.versionNumber}</p>
                <p className="text-xs text-slate-500">
                  {new Date(version.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-indigo-600 hover:underline"
                onClick={() => onRestore(version.id)}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
