import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Tooltip as CustomTooltip } from './Tooltip';
import { ResumeData } from '../utils/resumeAnalyzer';

export function MetricsChart({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  // Derive bar chart data from real resume data
  const barData = [
    { category: 'ATS Score', score: resumeData?.atsScore ?? 0 },
    { category: 'Keywords', score: resumeData?.keywordMatchScore ?? 0 },
    { category: 'Format', score: resumeData?.formatQualityScore ?? 0 },
    { category: 'Impact', score: resumeData?.impactScore ?? 0 },
    ...(resumeData?.jobMatchScore ? [{ category: 'Job Match', score: resumeData.jobMatchScore }] : []),
  ];

  // Derive radar data from real resume data
  const radarData = [
    { subject: 'ATS', score: resumeData?.atsScore ?? 0, fullMark: 100 },
    { subject: 'Keywords', score: resumeData?.keywordMatchScore ?? 0, fullMark: 100 },
    { subject: 'Format', score: resumeData?.formatQualityScore ?? 0, fullMark: 100 },
    { subject: 'Impact', score: resumeData?.impactScore ?? 0, fullMark: 100 },
    ...(resumeData?.jobMatchScore ? [{ subject: 'Job Match', score: resumeData.jobMatchScore, fullMark: 100 }] : []),
  ];

  const textColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-2xl p-6 shadow-lg border relative overflow-hidden group transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      {/* Animated background on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-bold text-xl ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Category Breakdown</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Score breakdown by analysis category</p>
          </div>
          <div className={`flex gap-2 p-1 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
            <CustomTooltip content="View as bar chart">
              <motion.button
                onClick={() => setChartType('bar')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${chartType === 'bar'
                    ? darkMode
                      ? 'bg-slate-600 text-indigo-400 shadow-sm'
                      : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Bar Chart
              </motion.button>
            </CustomTooltip>
            <CustomTooltip content="View as radar chart">
              <motion.button
                onClick={() => setChartType('radar')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${chartType === 'radar'
                    ? darkMode
                      ? 'bg-slate-600 text-indigo-400 shadow-sm'
                      : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Radar Chart
              </motion.button>
            </CustomTooltip>
          </div>
        </div>

        <motion.div
          className="h-80"
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ minHeight: '320px', height: '320px', width: '100%' }}
        >
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height={320} minHeight={320}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="category" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#fff',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#e2e8f0' : '#1e293b',
                  }}
                />
                <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={320} minHeight={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: textColor, fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#fff',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    color: darkMode ? '#e2e8f0' : '#1e293b',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}