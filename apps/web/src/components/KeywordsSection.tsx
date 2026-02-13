import { Hash, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function KeywordsSection({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const foundKeywords = resumeData?.foundKeywords || [];
  const missingKeywords = resumeData?.missingKeywords || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`rounded-2xl p-4 md:p-6 shadow-lg border transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className={`font-bold text-lg md:text-xl ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Keywords Density</h3>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Optimized for ATS scanning</p>
        </div>
        <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
      </div>

      {foundKeywords.length === 0 && missingKeywords.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="text-sm">No keyword data available. Upload a resume to see keyword analysis.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {foundKeywords.map((keyword, index) => (
              <motion.div
                key={keyword.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${keyword.relevance === 'high'
                    ? darkMode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
                    : keyword.relevance === 'medium'
                      ? darkMode
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                      : darkMode
                        ? 'bg-slate-700 text-slate-300 border border-slate-600'
                        : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300'
                  }`}
              >
                <Hash className="w-3 h-3" />
                {keyword.word}
                <span className="text-xs opacity-75">×{keyword.count}</span>
              </motion.div>
            ))}
          </div>

          {missingKeywords.length > 0 && (
            <div className={`border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Missing Important Keywords</h4>
              <div className="space-y-2">
                {missingKeywords.map((keyword, index) => (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${darkMode
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-amber-50 border-amber-200'
                      }`}
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className={`text-sm ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>{keyword}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {missingKeywords.length > 0 && (
        <div className={`mt-6 p-4 rounded-xl border ${darkMode
            ? 'bg-purple-500/10 border-purple-500/20'
            : 'bg-purple-50 border-purple-100'
          }`}>
          <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
            <strong>Suggestion:</strong> Include the missing keywords naturally in your experience section.
          </p>
        </div>
      )}
    </motion.div>
  );
}