import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Undo2,
  Redo2,
  FileDown,
  History,
  FileText,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onExportPdf: () => void;
  onSaveVersion: () => void;
  onToggleMarkdown: () => void;
  showMarkdown: boolean;
  readOnly?: boolean;
  disableSaveVersion?: boolean;
  saveVersionDisabledReason?: string;
}

const buttonClass =
  'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors';

export function EditorToolbar({
  editor,
  onExportPdf,
  onSaveVersion,
  onToggleMarkdown,
  showMarkdown,
  readOnly = false,
  disableSaveVersion = false,
  saveVersionDisabledReason,
}: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('bold') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={readOnly}
        >
          <Bold className="h-4 w-4" /> Bold
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('italic') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={readOnly}
        >
          <Italic className="h-4 w-4" /> Italic
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('underline') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={readOnly}
        >
          <Underline className="h-4 w-4" /> Underline
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={readOnly}
        >
          <Heading1 className="h-4 w-4" /> H1
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={readOnly}
        >
          <Heading2 className="h-4 w-4" /> H2
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('bulletList') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={readOnly}
        >
          <List className="h-4 w-4" /> Bullets
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('orderedList') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={readOnly}
        >
          <ListOrdered className="h-4 w-4" /> Numbered
        </button>
        <button
          type="button"
          className={`${buttonClass} ${editor.isActive('link') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (!url) {
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
          disabled={readOnly}
        >
          <Link className="h-4 w-4" /> Link
        </button>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`${buttonClass} bg-slate-100 text-slate-700`}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="h-4 w-4" /> Undo
        </button>
        <button
          type="button"
          className={`${buttonClass} bg-slate-100 text-slate-700`}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="h-4 w-4" /> Redo
        </button>
        <button
          type="button"
          className={`${buttonClass} ${showMarkdown ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={onToggleMarkdown}
        >
          <FileText className="h-4 w-4" /> Markdown
        </button>
        <button
          type="button"
          className={`${buttonClass} bg-slate-900 text-white`}
          onClick={onSaveVersion}
          disabled={readOnly || disableSaveVersion}
          title={saveVersionDisabledReason}
        >
          <History className="h-4 w-4" /> Save Version
        </button>
        <button
          type="button"
          className={`${buttonClass} bg-indigo-600 text-white`}
          onClick={onExportPdf}
        >
          <FileDown className="h-4 w-4" /> Export PDF
        </button>
      </div>
    </div>
  );
}
