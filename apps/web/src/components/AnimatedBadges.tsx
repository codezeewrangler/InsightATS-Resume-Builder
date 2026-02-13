import { motion } from 'motion/react';
import { Award, Shield, Star, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

const badges = [
  {
    id: 1,
    icon: Award,
    label: 'Top Performer',
    color: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  {
    id: 2,
    icon: Shield,
    label: 'ATS Verified',
    color: 'from-emerald-400 to-teal-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 3,
    icon: Star,
    label: 'Quality Checked',
    color: 'from-purple-400 to-pink-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    icon: Zap,
    label: 'Quick Pass',
    color: 'from-blue-400 to-indigo-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 5,
    icon: TrendingUp,
    label: 'High Impact',
    color: 'from-rose-400 to-red-500',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
  },
  {
    id: 6,
    icon: CheckCircle2,
    label: 'Format Perfect',
    color: 'from-cyan-400 to-blue-500',
    textColor: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
  },
];

export function AnimatedBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-lg shadow-slate-200/50 border border-slate-100"
    >
      <div className="mb-4 md:mb-6">
        <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2">Achievements Unlocked</h3>
        <p className="text-xs md:text-sm text-slate-500">Badges earned from your resume analysis</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.8 + index * 0.1,
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
              className={`${badge.bgColor} rounded-xl p-3 md:p-4 cursor-pointer relative overflow-hidden group`}
            >
              {/* Shimmer effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-20`}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mb-2 md:mb-3 mx-auto`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <p className={`text-xs font-semibold text-center ${badge.textColor}`}>
                  {badge.label}
                </p>
              </div>

              {/* Pulse ring on hover */}
              <motion.div
                className={`absolute inset-0 rounded-xl border-2 border-current opacity-0 group-hover:opacity-50`}
                style={{ borderColor: badge.textColor }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
