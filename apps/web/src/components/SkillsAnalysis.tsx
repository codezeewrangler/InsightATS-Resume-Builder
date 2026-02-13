import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function SkillsAnalysis({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const detectedSkills = resumeData?.detectedSkills || [];
  const missingSkills = resumeData?.missingSkills || [];
  const totalSkills = detectedSkills.length + missingSkills.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className={`font-bold text-lg md:text-xl ${darkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>Skills Analysis</h3>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Detected skills from your resume</p>
        </div>
        <div className="text-right">
          <div className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}>{detectedSkills.length}/{totalSkills || detectedSkills.length}</div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Skills Found</div>
        </div>
      </div>

      {detectedSkills.length === 0 && missingSkills.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="text-sm">No skills data available. Upload a resume to see skills analysis.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {detectedSkills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'
                  }`} />
                <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>{skill}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-24 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                <span className={`text-sm font-semibold w-12 text-right ${darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                  Found
                </span>
              </div>
            </motion.div>
          ))}

          {missingSkills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (detectedSkills.length + index) * 0.05, duration: 0.3 }}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <XCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'
                  }`} />
                <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>{skill}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-24 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '0%' }}
                    transition={{ delay: 0.5 + (detectedSkills.length + index) * 0.05, duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                  />
                </div>
                <span className={`text-sm font-semibold w-12 text-right ${darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                  Missing
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl border ${darkMode
            ? 'bg-indigo-500/10 border-indigo-500/20'
            : 'bg-indigo-50 border-indigo-100'
          }`}>
          <p className={`text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-900'
            }`}>
            <strong>Tip:</strong> Add missing skills like {missingSkills.slice(0, 2).join(' and ')} to improve your match rate.
          </p>
        </div>
      )}
    </motion.div>
  );
}