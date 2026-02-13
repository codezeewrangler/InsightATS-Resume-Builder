import { motion } from 'motion/react';
import { ProgressRing } from './ProgressRing';
import { Target, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function CircularProgress({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const progressData = [
    {
      id: 1,
      label: 'ATS Score',
      progress: resumeData?.atsScore ?? 0,
      color: '#10b981',
      icon: Target,
    },
    {
      id: 2,
      label: 'Keywords',
      progress: resumeData?.keywordMatchScore ?? 0,
      color: '#3b82f6',
      icon: Zap,
    },
    {
      id: 3,
      label: 'Format',
      progress: resumeData?.formatQualityScore ?? 0,
      color: '#8b5cf6',
      icon: CheckCircle,
    },
    {
      id: 4,
      label: 'Impact',
      progress: resumeData?.impactScore ?? 0,
      color: '#f59e0b',
      icon: TrendingUp,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className={`rounded-2xl p-4 md:p-6 shadow-lg border transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <div className="mb-4 md:mb-6">
        <h3 className={`font-bold text-lg md:text-xl mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Score Breakdown</h3>
        <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Circular progress visualization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {progressData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <ProgressRing
                  progress={item.progress}
                  size={100}
                  strokeWidth={8}
                  color={item.color}
                  showValue={true}
                />

                {/* Icon overlay */}
                <motion.div
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: item.color }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
              </div>

              <div className="mt-3 md:mt-4 text-center">
                <div className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{item.label}</div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.progress >= 90 ? 'Excellent' : item.progress >= 75 ? 'Good' : item.progress >= 50 ? 'Fair' : 'Needs Work'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}