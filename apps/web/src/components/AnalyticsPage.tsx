import { motion } from 'motion/react';
import { TrendingUp, FileText, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ResumeData } from '../utils/resumeAnalyzer';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface AnalyticsPageProps {
  hasData?: boolean;
  darkMode?: boolean;
  resumeData?: ResumeData | null;
}

export function AnalyticsPage({ hasData = false, darkMode = false, resumeData }: AnalyticsPageProps) {
  // Show empty state if no analysis has been done
  if (!hasData || !resumeData) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Analytics</h2>
          <p className={`text-sm md:text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Track your resume performance over time
          </p>
        </div>

        <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-100 to-indigo-100'
              }`}>
              <BarChart3 className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>No Analytics Yet</h3>
            <p className={`max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Upload and analyze your first resume to see detailed analytics here
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Derive all analytics from the real resumeData
  const categoryScores = [
    { name: 'ATS Score', value: resumeData.atsScore },
    { name: 'Keywords', value: resumeData.keywordMatchScore },
    { name: 'Format Quality', value: resumeData.formatQualityScore },
    { name: 'Impact', value: resumeData.impactScore },
    ...(resumeData.jobMatchScore ? [{ name: 'Job Match', value: resumeData.jobMatchScore }] : []),
  ];

  // Build score distribution from the scores
  const allScores = [resumeData.atsScore, resumeData.keywordMatchScore, resumeData.formatQualityScore, resumeData.impactScore];
  if (resumeData.jobMatchScore) allScores.push(resumeData.jobMatchScore);

  const scoreDistribution = [
    { range: '90-100', count: allScores.filter(s => s >= 90).length },
    { range: '80-89', count: allScores.filter(s => s >= 80 && s < 90).length },
    { range: '70-79', count: allScores.filter(s => s >= 70 && s < 80).length },
    { range: '60-69', count: allScores.filter(s => s >= 60 && s < 70).length },
    { range: '<60', count: allScores.filter(s => s < 60).length },
  ];

  const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  const topScore = Math.max(...allScores);

  // Find best and weakest categories
  const sortedCategories = [...categoryScores].sort((a, b) => b.value - a.value);
  const bestCategory = sortedCategories[0];
  const weakestCategory = sortedCategories[sortedCategories.length - 1];

  // Structure checklist
  const structureItems = [
    { label: 'Professional Summary', present: resumeData.hasSummary },
    { label: 'Work Experience', present: resumeData.hasExperience },
    { label: 'Education', present: resumeData.hasEducation },
    { label: 'Skills Section', present: resumeData.hasSkillsSection },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Analytics
        </h2>
        <p className={`text-sm md:text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Analysis results for <span className="font-medium">{resumeData.fileName}</span>
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Word Count</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{resumeData.wordCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Average Score</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{avgScore}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Top Score</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{topScore}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Skills Found</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{resumeData.detectedSkills.length}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="range" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                  border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: darkMode ? '#e2e8f0' : '#1e293b',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Category Breakdown</h3>
          <div className="space-y-4">
            {categoryScores.map((category, index) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{category.name}</span>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{category.value}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.value}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}dd)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Structure & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Resume Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Resume Structure</h3>
          <div className="space-y-3">
            {structureItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${item.present
                    ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                    : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                  }`}>
                  {item.present ? '✓ Found' : '✗ Missing'}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Bullet Points</span>
              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{resumeData.bulletPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Estimated Pages</span>
              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{resumeData.pageCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Detected Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Detected Skills ({resumeData.detectedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {resumeData.detectedSkills.slice(0, 15).map((skill) => (
              <span
                key={skill}
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  }`}
              >
                {skill}
              </span>
            ))}
            {resumeData.detectedSkills.length > 15 && (
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                +{resumeData.detectedSkills.length - 15} more
              </span>
            )}
          </div>
          {resumeData.missingSkills.length > 0 && (
            <>
              <h4 className={`font-medium text-sm mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Missing Skills ({resumeData.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.missingSkills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <h3 className="font-semibold text-lg mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">Best Category</p>
            <p className="text-xl font-bold">{bestCategory.name} {bestCategory.value}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">Needs Improvement</p>
            <p className="text-xl font-bold">{weakestCategory.name} {weakestCategory.value}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-indigo-100 mb-1">ATS Issues</p>
            <p className="text-xl font-bold">{resumeData.atsIssues.length} found</p>
          </div>
        </div>
      </motion.div>

      {/* ATS Issues Detail */}
      {resumeData.atsIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'
            }`}
        >
          <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>ATS Issues</h3>
          <div className="space-y-3">
            {resumeData.atsIssues.map((issue, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                }`}>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${issue.severity === 'high'
                    ? (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                    : issue.severity === 'medium'
                      ? (darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700')
                      : (darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                  }`}>
                  {issue.severity}
                </span>
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{issue.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
