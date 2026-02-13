import { motion } from 'motion/react';
import { FileText, Download, Eye, Trash2, Calendar, Star, TrendingUp, FolderOpen, Upload } from 'lucide-react';
import { ResumeData } from '../utils/resumeAnalyzer';

interface SavedResumesProps {
  fileName?: string;
  onNewUpload: () => void;
  darkMode?: boolean;
  resumeData?: ResumeData | null;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'from-green-500 to-emerald-500';
  if (score >= 80) return 'from-blue-500 to-indigo-500';
  if (score >= 70) return 'from-cyan-500 to-blue-500';
  if (score >= 60) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SavedResumes({ fileName, onNewUpload, darkMode = false, resumeData }: SavedResumesProps) {
  const hasResume = !!(fileName && resumeData);

  // Build resume list from real data
  const resumes = hasResume
    ? [
      {
        id: 1,
        name: fileName!,
        uploadDate: new Date().toISOString().split('T')[0],
        score: resumeData!.atsScore,
        statusColor: getScoreColor(resumeData!.atsScore),
        size: formatFileSize(resumeData!.fileSize),
        starred: resumeData!.atsScore >= 85,
      },
    ]
    : [];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Saved Resumes</h2>
          <p className={`text-sm md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage and review your uploaded resumes
          </p>
        </div>
        <motion.button
          onClick={onNewUpload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Upload New Resume
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Resumes</p>
            <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{resumes.length}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {resumes.length > 0 ? 'Analyzed' : 'No resumes yet'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>ATS Score</p>
            <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {resumeData ? resumeData.atsScore : '—'}
          </p>
          <p className={`text-xs mt-1 ${resumeData && resumeData.atsScore >= 80 ? 'text-green-500' : darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {resumeData ? (resumeData.atsScore >= 80 ? 'Good score' : 'Needs improvement') : 'Upload to see score'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Keywords Match</p>
            <Star className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {resumeData ? `${resumeData.keywordMatchScore}%` : '—'}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {resumeData ? `${resumeData.detectedSkills.length} skills found` : 'No data'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Last Upload</p>
            <Calendar className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {hasResume ? 'Now' : '—'}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {hasResume ? 'Just analyzed' : 'No uploads'}
          </p>
        </motion.div>
      </div>

      {/* Resumes List or Empty State */}
      {resumes.length > 0 ? (
        <div className={`backdrop-blur-sm rounded-2xl border shadow-lg overflow-hidden ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50/80 border-slate-200'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Resume Name
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Upload Date
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    ATS Score
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Size
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {resumes.map((resume, index) => (
                  <motion.tr
                    key={resume.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`transition-colors ${darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {resume.starred && (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        )}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-br from-blue-100 to-indigo-100'}`}>
                            <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                              {resume.name}
                            </p>
                            <p className={`text-xs md:hidden ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {resume.uploadDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm hidden md:table-cell ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(resume.uploadDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px]">
                          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${resume.score}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                              className={`h-full bg-gradient-to-r ${resume.statusColor}`}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-semibold min-w-[3ch] ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {resume.score}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm hidden lg:table-cell ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {resume.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-lg transition-colors group ${darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'}`}
                          title="View Resume"
                        >
                          <Eye className={`w-4 h-4 ${darkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-lg transition-colors group ${darkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-100'}`}
                          title="Download"
                        >
                          <Download className={`w-4 h-4 ${darkMode ? 'text-slate-400 group-hover:text-green-400' : 'text-slate-600 group-hover:text-green-600'}`} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-lg transition-colors group ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`}
                          title="Delete"
                        >
                          <Trash2 className={`w-4 h-4 ${darkMode ? 'text-slate-400 group-hover:text-red-400' : 'text-slate-600 group-hover:text-red-600'}`} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty state when no resumes */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-sm rounded-2xl border shadow-lg p-12 text-center ${darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
            <FolderOpen className={`w-8 h-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            No Resumes Yet
          </h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Upload your first resume to get an ATS compatibility analysis and start tracking your improvements.
          </p>
          <motion.button
            onClick={onNewUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Upload className="w-5 h-5" />
            Upload Resume
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}