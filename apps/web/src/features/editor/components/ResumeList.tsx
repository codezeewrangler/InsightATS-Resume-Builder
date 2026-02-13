import { ResumeSummary } from '@/lib/resumeApi';
import { Plus } from 'lucide-react';

interface ResumeListProps {
  resumes: ResumeSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  darkMode?: boolean;
  disableCreate?: boolean;
  createDisabledReason?: string;
}

export function ResumeList({
  resumes,
  activeId,
  onSelect,
  onCreate,
  darkMode,
  disableCreate = false,
  createDisabledReason,
}: ResumeListProps) {
  return (
    <aside
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? 'border-slate-700 bg-slate-900 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Resumes
        </h3>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white ${
            disableCreate ? 'cursor-not-allowed bg-slate-500' : 'bg-indigo-600'
          }`}
          onClick={onCreate}
          disabled={disableCreate}
          title={createDisabledReason}
        >
          <Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      {disableCreate && createDisabledReason && (
        <p className="mb-3 text-xs text-amber-600">{createDisabledReason}</p>
      )}

      <div className="space-y-2">
        {resumes.length === 0 ? (
          <p className="text-sm text-slate-500">No resumes yet.</p>
        ) : (
          resumes.map((resume) => (
            <button
              key={resume.id}
              type="button"
              onClick={() => onSelect(resume.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                resume.id === activeId
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <p className="font-medium">{resume.title}</p>
              <p className="text-xs opacity-70">
                {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
