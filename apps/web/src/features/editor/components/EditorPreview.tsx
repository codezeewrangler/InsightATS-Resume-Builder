interface EditorPreviewProps {
  html: string;
  darkMode?: boolean;
}

export function EditorPreview({ html, darkMode }: EditorPreviewProps) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? 'border-slate-700 bg-slate-900 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Live Preview
      </h3>
      <div className="space-y-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
