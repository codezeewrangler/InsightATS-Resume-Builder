import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import { Users, FileCheck, Hash, LayoutList } from 'lucide-react';

import { ResumeData } from '../utils/resumeAnalyzer';

interface StatProps {
  value: number;
  label: string;
  icon: typeof Users;
  suffix?: string;
  color: string;
}

function AnimatedStat({ value, label, icon: Icon, suffix = '', color }: StatProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    return controls.stop;
  }, [count, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-lg transition-all hover:shadow-xl md:p-6"
    >
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)` }}
      />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <motion.div
            className="rounded-xl p-2 md:p-3"
            style={{ backgroundColor: `${color}15` }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color }} />
          </motion.div>

          <motion.div
            className="rounded-full px-2 py-1 text-xs font-semibold md:px-3"
            style={{ backgroundColor: `${color}15`, color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Live
          </motion.div>
        </div>

        <div className="flex items-baseline gap-1">
          <motion.div className="text-2xl font-bold text-slate-900 md:text-3xl">{rounded}</motion.div>
          {suffix && <span className="text-base text-slate-600 md:text-lg">{suffix}</span>}
        </div>

        <div className="mt-2 text-sm text-slate-500">{label}</div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function AnimatedStats({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const sectionCoverage = resumeData
    ? Math.round(
        ([resumeData.hasSummary, resumeData.hasExperience, resumeData.hasEducation, resumeData.hasSkillsSection]
          .filter(Boolean).length /
          4) *
          100,
      )
    : 0;

  const keywordHits = resumeData
    ? resumeData.foundKeywords.reduce((total, keyword) => total + keyword.count, 0)
    : 0;

  const skillsCoverage = resumeData
    ? Math.round(
        (resumeData.detectedSkills.length /
          Math.max(1, resumeData.detectedSkills.length + resumeData.missingSkills.length)) *
          100,
      )
    : 0;

  const stats = [
    {
      value: resumeData?.wordCount || 0,
      label: 'Word Count',
      icon: FileCheck,
      color: '#6366f1',
    },
    {
      value: sectionCoverage,
      label: 'Section Coverage',
      icon: LayoutList,
      suffix: '%',
      color: '#10b981',
    },
    {
      value: keywordHits,
      label: 'Keyword Hits',
      icon: Hash,
      color: '#f59e0b',
    },
    {
      value: skillsCoverage,
      label: 'Skills Coverage',
      suffix: '%',
      icon: Users,
      color: '#8b5cf6',
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition-colors duration-300 ${
        darkMode ? 'border-slate-700/50 bg-slate-800/60' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-bold md:text-xl ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Platform Statistics
          </h3>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time resume analysis
          </p>
        </div>
        <motion.div
          className="h-2 w-2 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + index * 0.1 }}
          >
            <AnimatedStat {...stat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
