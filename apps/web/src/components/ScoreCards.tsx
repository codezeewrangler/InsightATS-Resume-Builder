import { TrendingUp, Target, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function ScoreCards({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const hasJobDescription = typeof resumeData?.jobMatchScore === 'number';

  const scores = [
    {
      id: 1,
      label: 'ATS Score',
      value: resumeData?.atsScore ?? 0,
      max: 100,
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      bgColorDark: 'bg-emerald-500/20',
      textColor: 'text-emerald-600',
      textColorDark: 'text-emerald-400',
      hoverColor: 'hover:shadow-emerald-500/30',
    },
    {
      id: 2,
      label: hasJobDescription ? 'Job Match' : 'Keyword Match',
      value: hasJobDescription ? (resumeData?.jobMatchScore ?? 0) : (resumeData?.keywordMatchScore ?? 0),
      max: 100,
      icon: Zap,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      bgColorDark: 'bg-blue-500/20',
      textColor: 'text-blue-600',
      textColorDark: 'text-blue-400',
      hoverColor: 'hover:shadow-blue-500/30',
    },
    {
      id: 3,
      label: 'Format Quality',
      value: resumeData?.formatQualityScore ?? 0,
      max: 100,
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      bgColorDark: 'bg-purple-500/20',
      textColor: 'text-purple-600',
      textColorDark: 'text-purple-400',
      hoverColor: 'hover:shadow-purple-500/30',
    },
    {
      id: 4,
      label: hasJobDescription ? 'Skills Match' : 'Impact Score',
      value: resumeData?.impactScore ?? 0,
      max: 100,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      bgColorDark: 'bg-orange-500/20',
      textColor: 'text-orange-600',
      textColorDark: 'text-orange-400',
      hoverColor: 'hover:shadow-orange-500/30',
    },
  ];

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {scores.map((score, index) => {
        const Icon = score.icon;
        const percentage = (score.value / score.max) * 100;
        const isHovered = hoveredCard === score.id;

        return (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredCard(score.id)}
            onHoverEnd={() => setHoveredCard(null)}
            className={`backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl ${score.hoverColor} transition-all border cursor-pointer relative overflow-hidden group ${darkMode
                ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-slate-200/50'
              }`}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${score.color} opacity-0 group-hover:opacity-${darkMode ? '10' : '5'} transition-opacity duration-300`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <motion.div
                  className={`${darkMode ? score.bgColorDark : score.bgColor} p-2 md:p-3 rounded-xl`}
                  animate={isHovered ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? score.textColorDark : score.textColor}`} />
                </motion.div>
                <div className="text-right">
                  <motion.div
                    className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                    animate={isHovered ? { x: [-2, 2, -2, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {score.label}
                  </motion.div>
                  <div className={`text-xl md:text-2xl font-bold ${darkMode ? score.textColorDark : score.textColor}`}>
                    <motion.span
                      key={isHovered ? 'hovered' : 'normal'}
                      initial={{ scale: 1 }}
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {score.value}
                    </motion.span>
                    <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>/{score.max}</span>
                  </div>
                </div>
              </div>

              <div className={`relative h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${score.color} rounded-full`}>
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30"
                    animate={isHovered ? {
                      x: ['-100%', '100%']
                    } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Good' : percentage >= 60 ? 'Fair' : 'Needs Work'}
                </span>
                <motion.span
                  className="text-xs font-semibold text-slate-400 opacity-0 group-hover:opacity-100"
                  initial={{ x: -10 }}
                  animate={isHovered ? { x: 0 } : { x: -10 }}
                >
                  View Details →
                </motion.span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
