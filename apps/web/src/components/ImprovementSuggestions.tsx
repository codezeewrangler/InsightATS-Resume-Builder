import { Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../utils/resumeAnalyzer';
import {
  buildImprovementSuggestions,
  ImprovementSuggestionItem,
} from '../utils/improvementSuggestions';

interface ImprovementSuggestionsProps {
  darkMode?: boolean;
  resumeData?: ResumeData | null;
  onApplyInEditor?: (suggestions: ImprovementSuggestionItem[]) => void;
}

export function ImprovementSuggestions({
  darkMode = false,
  resumeData,
  onApplyInEditor,
}: ImprovementSuggestionsProps) {
  const suggestions = resumeData ? buildImprovementSuggestions(resumeData) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={`rounded-2xl p-4 md:p-6 shadow-lg border transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h3 className={`font-bold text-lg md:text-xl ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Improvement Suggestions</h3>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Actionable recommendations to boost your score</p>
        </div>
        {suggestions.length > 0 && onApplyInEditor && (
          <button
            type="button"
            onClick={() => onApplyInEditor(suggestions)}
            className={`ml-auto rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              darkMode
                ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Apply all in editor
          </button>
        )}
      </div>

      {suggestions.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="text-sm">Upload a resume to get personalized improvement suggestions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`group p-4 rounded-xl border-2 transition-all ${darkMode
                  ? 'border-slate-700 hover:border-indigo-500/30 hover:bg-indigo-500/10'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${suggestion.priority === 'high'
                          ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                          : suggestion.priority === 'medium'
                            ? darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                            : darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {suggestion.priority.toUpperCase()}
                    </span>
                    <h4 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{suggestion.title}</h4>
                  </div>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{suggestion.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                      {suggestion.impact}
                    </span>
                  </div>
                </div>
                {onApplyInEditor && (
                  <button
                    type="button"
                    onClick={() => onApplyInEditor([suggestion])}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                      darkMode
                        ? 'bg-slate-700/80 text-indigo-300 hover:bg-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    Apply
                    <ArrowRight className={`w-4 h-4 transition-all ${darkMode
                      ? 'text-indigo-300 group-hover:translate-x-1'
                      : 'text-indigo-600 group-hover:translate-x-1'
                      }`} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
