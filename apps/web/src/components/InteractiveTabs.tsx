import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, BarChart3, AlertCircle, Sparkles } from 'lucide-react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function InteractiveTabs({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Build Overview content from real data
  const overviewItems = resumeData ? [
    { label: 'ATS Score', value: `${resumeData.atsScore}%`, color: darkMode ? 'text-indigo-400' : 'text-indigo-600' },
    { label: 'Keyword Match', value: `${resumeData.keywordMatchScore}%`, color: darkMode ? 'text-emerald-400' : 'text-emerald-600' },
    { label: 'Word Count', value: `${resumeData.wordCount}`, color: darkMode ? 'text-purple-400' : 'text-purple-600' },
  ] : [];

  // Build Metrics content from real data
  const metricsItems = resumeData ? [
    { label: 'Format Quality', value: `${resumeData.formatQualityScore}%`, bgColor: darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200', textColor: darkMode ? 'text-blue-400' : 'text-blue-600', labelColor: darkMode ? 'text-blue-300' : 'text-blue-900' },
    { label: 'Impact Score', value: `${resumeData.impactScore}%`, bgColor: darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200', textColor: darkMode ? 'text-emerald-400' : 'text-emerald-600', labelColor: darkMode ? 'text-emerald-300' : 'text-emerald-900' },
    ...(resumeData.jobMatchScore ? [{ label: 'Job Match', value: `${resumeData.jobMatchScore}%`, bgColor: darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200', textColor: darkMode ? 'text-purple-400' : 'text-purple-600', labelColor: darkMode ? 'text-purple-300' : 'text-purple-900' }] : []),
  ] : [];

  // Build Issues content from real ATS issues
  const issueItems = resumeData?.atsIssues || [];

  // Build Tips from real data
  const tipItems: Array<{ title: string; description: string }> = [];
  if (resumeData) {
    if (resumeData.impactScore < 80) tipItems.push({ title: 'Use Action Verbs', description: 'Start bullet points with strong verbs like Led, Developed, Increased' });
    if (resumeData.impactScore < 70) tipItems.push({ title: 'Quantify Achievements', description: 'Add numbers and percentages to demonstrate impact' });
    if (!resumeData.hasSummary) tipItems.push({ title: 'Add Summary', description: 'Include a professional summary at the top of your resume' });
    if (resumeData.bulletPoints < 10) tipItems.push({ title: 'More Bullet Points', description: 'Use bullet points to clearly list your achievements' });
    if (resumeData.missingSkills.length > 0) tipItems.push({ title: 'Add Missing Skills', description: `Consider adding: ${resumeData.missingSkills.slice(0, 3).join(', ')}` });
    if (tipItems.length === 0) tipItems.push({ title: 'Well Optimized', description: 'Your resume is scoring well. Keep it updated with new achievements!' });
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'issues', label: 'Issues', icon: AlertCircle },
    { id: 'recommendations', label: 'Tips', icon: Sparkles },
  ];

  const renderContent = () => {
    if (!resumeData) {
      return (
        <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="text-sm">Upload a resume to see detailed insights.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-3">
            {overviewItems.map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        );
      case 'metrics':
        return (
          <div className="space-y-3">
            {metricsItems.map((item) => (
              <div key={item.label} className={`p-4 rounded-lg border ${item.bgColor}`}>
                <div className={`text-sm mb-2 ${item.labelColor}`}>{item.label}</div>
                <div className={`text-2xl font-bold ${item.textColor}`}>{item.value}</div>
              </div>
            ))}
          </div>
        );
      case 'issues':
        return (
          <div className="space-y-3">
            {issueItems.length === 0 ? (
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-start gap-2">
                  <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <div>
                    <div className={`font-semibold text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>No Issues Found</div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Your resume is ATS compatible</div>
                  </div>
                </div>
              </div>
            ) : (
              issueItems.map((issue, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${issue.severity === 'high'
                    ? darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                    : issue.severity === 'medium'
                      ? darkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                      : darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                  }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${issue.severity === 'high'
                        ? darkMode ? 'text-red-400' : 'text-red-600'
                        : issue.severity === 'medium'
                          ? darkMode ? 'text-amber-400' : 'text-amber-600'
                          : darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    <div>
                      <div className={`font-semibold text-sm ${issue.severity === 'high'
                          ? darkMode ? 'text-red-300' : 'text-red-900'
                          : issue.severity === 'medium'
                            ? darkMode ? 'text-amber-300' : 'text-amber-900'
                            : darkMode ? 'text-blue-300' : 'text-blue-900'
                        }`}>{issue.severity.toUpperCase()}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{issue.message}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'recommendations':
        return (
          <div className="space-y-3">
            {tipItems.map((tip, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${idx % 2 === 0
                  ? darkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                  : darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
                }`}>
                <div className="flex items-start gap-2">
                  <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 ${idx % 2 === 0
                      ? darkMode ? 'text-indigo-400' : 'text-indigo-600'
                      : darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  <div>
                    <div className={`font-semibold text-sm ${idx % 2 === 0
                        ? darkMode ? 'text-indigo-300' : 'text-indigo-900'
                        : darkMode ? 'text-purple-300' : 'text-purple-900'
                      }`}>{tip.title}</div>
                    <div className={`text-xs mt-1 ${idx % 2 === 0
                        ? darkMode ? 'text-indigo-400' : 'text-indigo-700'
                        : darkMode ? 'text-purple-400' : 'text-purple-700'
                      }`}>{tip.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={`rounded-2xl p-4 md:p-6 shadow-lg border transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <h3 className={`font-bold text-lg md:text-xl mb-4 md:mb-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Detailed Insights</h3>

      {/* Tab Headers */}
      <div className={`flex gap-1 md:gap-2 mb-4 md:mb-6 p-1 rounded-xl overflow-x-auto ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-all relative whitespace-nowrap ${isActive
                  ? darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className={`absolute inset-0 rounded-lg shadow-md ${darkMode ? 'bg-slate-600' : 'bg-white'}`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}