import { useState } from 'react';
import { Collaborator } from '@/lib/resumeApi';

interface CollaboratorPanelProps {
  collaborators: Collaborator[];
  onAdd: (email: string, role: 'editor' | 'viewer') => Promise<void>;
  darkMode?: boolean;
  readOnly?: boolean;
  disableAdd?: boolean;
  addDisabledReason?: string;
}

export function CollaboratorPanel({
  collaborators,
  onAdd,
  darkMode,
  readOnly,
  disableAdd,
  addDisabledReason,
}: CollaboratorPanelProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || readOnly || disableAdd || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(email.trim(), role);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? 'border-slate-700 bg-slate-900 text-slate-100'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collaborators</h3>
      <div className="mt-3 space-y-2">
        {collaborators.length === 0 ? (
          <p className="text-sm text-slate-500">No collaborators yet.</p>
        ) : (
          collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className={`rounded-lg border px-3 py-2 text-sm ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}
            >
              <p className="font-medium">{collaborator.user.fullName ?? collaborator.user.email}</p>
              <p className="text-xs text-slate-500">{collaborator.role.toUpperCase()}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="mt-4 space-y-2">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="collaborator@email.com"
          type="email"
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            darkMode
              ? 'border-slate-700 bg-slate-800 text-slate-100'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
          disabled={Boolean(readOnly || disableAdd || isSubmitting)}
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as 'editor' | 'viewer')}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
            darkMode
              ? 'border-slate-700 bg-slate-800 text-slate-100'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
          disabled={Boolean(readOnly || disableAdd || isSubmitting)}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button
          type="submit"
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold text-white ${
            readOnly || disableAdd || isSubmitting ? 'cursor-not-allowed bg-slate-500' : 'bg-indigo-600'
          }`}
          disabled={Boolean(readOnly || disableAdd || isSubmitting)}
          title={addDisabledReason}
        >
          {isSubmitting ? 'Adding...' : 'Add Collaborator'}
        </button>
        {addDisabledReason && (readOnly || disableAdd) && (
          <p className="text-xs text-amber-600">{addDisabledReason}</p>
        )}
      </form>
    </div>
  );
}
