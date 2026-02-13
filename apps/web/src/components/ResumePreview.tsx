import { FileText, Download, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Tooltip } from './Tooltip';
import { ResumeData } from '../utils/resumeAnalyzer';

interface ResumePreviewProps {
  darkMode?: boolean;
  resumeData?: ResumeData | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getTimeSinceUpload(): string {
  return 'Just now';
}

export function ResumePreview({ darkMode = false, resumeData }: ResumePreviewProps) {
  const fileName = resumeData?.fileName || 'No file uploaded';
  const fileSize = resumeData ? formatFileSize(resumeData.fileSize) : '—';
  const pages = resumeData?.pageCount || 0;
  const wordCount = resumeData?.wordCount || 0;

  // Count detected sections
  const sectionCount = resumeData
    ? [
      resumeData.hasSummary,
      resumeData.hasExperience,
      resumeData.hasEducation,
      resumeData.hasSkillsSection,
    ].filter(Boolean).length + (resumeData.bulletPoints > 0 ? 1 : 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`backdrop-blur-xl rounded-2xl p-6 shadow-lg border h-full relative overflow-hidden group transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/30'
          : 'bg-white/60 border-white/20 shadow-slate-200/50'
        }`}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Resume File</h3>

        <motion.div
          className={`rounded-xl p-6 mb-4 border relative overflow-hidden ${darkMode
              ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20'
              : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
            }`}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className={`w-16 h-16 rounded-lg flex items-center justify-center shadow-sm ${darkMode ? 'bg-slate-700' : 'bg-white'
                  }`}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <FileText className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </motion.div>
              <div className="flex-1">
                <h4 className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {fileName}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {fileSize} • {getTimeSinceUpload()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Tooltip content="Preview resume in viewer">
                <motion.button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${darkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View</span>
                </motion.button>
              </Tooltip>

              <Tooltip content="Download resume file">
                <motion.button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors border ${darkMode
                      ? 'bg-slate-700 text-indigo-400 border-indigo-500/30 hover:bg-slate-600'
                      : 'bg-white text-indigo-600 border-indigo-200 hover:bg-slate-50'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download</span>
                </motion.button>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          <Tooltip content="Total number of pages">
            <motion.div
              className={`flex items-center justify-between p-3 backdrop-blur-sm rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              whileHover={{ x: 4, scale: 1.02 }}
            >
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pages</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{pages}</span>
            </motion.div>
          </Tooltip>

          <Tooltip content="Total words in resume">
            <motion.div
              className={`flex items-center justify-between p-3 backdrop-blur-sm rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              whileHover={{ x: 4, scale: 1.02 }}
            >
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Word Count</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{wordCount}</span>
            </motion.div>
          </Tooltip>

          <Tooltip content="Number of resume sections">
            <motion.div
              className={`flex items-center justify-between p-3 backdrop-blur-sm rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              whileHover={{ x: 4, scale: 1.02 }}
            >
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Sections</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{sectionCount}</span>
            </motion.div>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}