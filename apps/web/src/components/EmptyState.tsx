import { Upload, FileText, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { JobDescriptionCard } from './JobDescriptionCard';

interface EmptyStateProps {
  onFileUpload: (file: File) => void;
  onJobDescriptionChange?: (description: string) => void;
  jobDescription?: string;
  darkMode?: boolean;
  aiAnalysisDisabled?: boolean;
  aiDisabledReason?: string;
}

export function EmptyState({
  onFileUpload,
  onJobDescriptionChange,
  jobDescription = '',
  darkMode = false,
  aiAnalysisDisabled = false,
  aiDisabledReason,
}: EmptyStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
      const hasValidType = validTypes.includes(file.type);
      const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (!hasValidType && !hasValidExt) {
        alert('Please upload a valid resume file (PDF, DOC, DOCX, or TXT)');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      onFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    if (aiAnalysisDisabled) {
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 py-12">
      {/* Main Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className={`backdrop-blur-sm rounded-3xl shadow-xl border p-8 md:p-12 text-center transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50'
          : 'bg-white/80 border-slate-200'
          }`}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl mb-6 shadow-lg ${darkMode
              ? 'bg-gradient-to-br from-indigo-600 to-purple-700'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}
          >
            <Upload className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </motion.div>

          {/* Heading */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>
            Upload Your Resume
          </h1>
          <p className={`text-base md:text-lg mb-8 max-w-md mx-auto ${darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
            Get instant ATS compatibility analysis and optimization suggestions to make your resume stand out
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileChange}
            className="hidden"
            disabled={aiAnalysisDisabled}
          />

          {/* Upload Button */}
          <motion.button
            onClick={handleButtonClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              aiAnalysisDisabled
                ? 'cursor-not-allowed bg-slate-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl'
            }`}
            disabled={aiAnalysisDisabled}
          >
            <FileText className="w-5 h-5" />
            {aiAnalysisDisabled ? 'AI Quota Reached' : 'Choose Resume File'}
          </motion.button>

          <p className="text-sm text-slate-500 mt-4">
            {aiDisabledReason ?? 'Supports PDF, DOC, DOCX, TXT • Max size 10MB'}
          </p>
        </div>
      </motion.div>

      {/* Job Description Card */}
      <div className="mt-8">
        {onJobDescriptionChange && (
          <JobDescriptionCard
            initialValue={jobDescription}
            onJobDescriptionChange={onJobDescriptionChange}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 w-full max-w-4xl"
      >
        {/* Feature 1 */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 ${darkMode
            ? 'bg-slate-800/40 border-slate-700/50'
            : 'bg-white/60 border-slate-200'
            }`}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
            <Zap className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Instant Analysis
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Get your ATS compatibility score in seconds with detailed breakdown
          </p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 ${darkMode
            ? 'bg-slate-800/40 border-slate-700/50'
            : 'bg-white/60 border-slate-200'
            }`}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${darkMode ? 'bg-green-500/20' : 'bg-green-100'
            }`}>
            <CheckCircle className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Smart Suggestions
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Receive actionable recommendations to improve your resume
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`backdrop-blur-sm rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 ${darkMode
            ? 'bg-slate-800/40 border-slate-700/50'
            : 'bg-white/60 border-slate-200'
            }`}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
            <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Track Progress
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Monitor improvements and optimize for better job matches
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
