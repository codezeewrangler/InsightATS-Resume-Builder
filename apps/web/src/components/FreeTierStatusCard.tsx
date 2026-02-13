import { FreeTierUsageResponse } from '@/lib/usageApi';

interface FreeTierStatusCardProps {
  data: FreeTierUsageResponse | null;
  darkMode?: boolean;
  compact?: boolean;
}

const metricClass = 'flex items-center justify-between rounded-lg border px-3 py-2 text-sm';

export function FreeTierStatusCard({ data, darkMode = false, compact = false }: FreeTierStatusCardProps) {
  if (!data) {
    return (
      <div
        className={`rounded-2xl border p-4 text-sm ${
          darkMode
            ? 'border-slate-700 bg-slate-900/80 text-slate-300'
            : 'border-slate-200 bg-white/80 text-slate-600'
        }`}
      >
        Sign in to view free-tier usage.
      </div>
    );
  }

  const resetTime = new Date(data.resetAtUtc).toLocaleString();
  const aiRemaining = Math.max(data.limits.aiPerDay - data.usage.aiUsedToday, 0);

  return (
    <section
      className={`rounded-2xl border p-4 shadow-sm ${
        darkMode
          ? 'border-slate-700 bg-slate-900/80 text-slate-100'
          : 'border-slate-200 bg-white/90 text-slate-900'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Free Tier</h3>
          <p className="text-xs text-slate-500">Resets daily at UTC midnight</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
          {aiRemaining} AI left
        </span>
      </div>

      <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div className={`${metricClass} ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <span>AI today</span>
          <span className="font-semibold">{data.usage.aiUsedToday}/{data.limits.aiPerDay}</span>
        </div>
        <div className={`${metricClass} ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <span>Resumes</span>
          <span className="font-semibold">{data.usage.resumesUsed}/{data.limits.resumesPerUser}</span>
        </div>
        {typeof data.usage.versionsUsedForActiveResume === 'number' && (
          <div className={`${metricClass} ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <span>Versions</span>
            <span className="font-semibold">
              {data.usage.versionsUsedForActiveResume}/{data.limits.versionsPerResume}
            </span>
          </div>
        )}
        {typeof data.usage.collaboratorsUsedForActiveResume === 'number' && (
          <div className={`${metricClass} ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <span>Collaborators</span>
            <span className="font-semibold">
              {data.usage.collaboratorsUsedForActiveResume}/{data.limits.collaboratorsPerResume}
            </span>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">AI quota reset: {resetTime}</p>
    </section>
  );
}
