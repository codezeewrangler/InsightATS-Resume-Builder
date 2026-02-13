import { motion } from 'motion/react';
import { FolderOpen, Upload, Clock, Shield, Zap } from 'lucide-react';

interface SavedResumesEmptyProps {
  onUploadClick: () => void;
  darkMode?: boolean;
}

export function SavedResumesEmpty({ onUploadClick }: SavedResumesEmptyProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Saved Resumes</h2>
          <p className="text-sm md:text-base text-slate-600">
            Manage and review your uploaded resumes
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="min-h-[calc(100vh-300px)] flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
            >
              <FolderOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>

            {/* Heading */}
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              No Saved Resumes Yet
            </h3>
            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Start uploading resumes to build your collection and track your ATS scores over time
            </p>

            {/* Upload Button */}
            <motion.button
              onClick={onUploadClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Resume
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Version History</h4>
            <p className="text-sm text-slate-600">
              Keep track of all your resume versions and improvements
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Secure Storage</h4>
            <p className="text-sm text-slate-600">
              Your resumes are safely stored and accessible anytime
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Quick Access</h4>
            <p className="text-sm text-slate-600">
              Download or share your resumes with one click
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
