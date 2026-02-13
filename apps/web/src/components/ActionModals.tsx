import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Download, Share2, Lock, Trash2, AlertTriangle, Check, Copy, Mail, MessageSquare, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

// Upload Modal
export function UploadModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      console.log('File uploaded:', files[0].name);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Upload New Resume
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? darkMode
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : darkMode
                      ? 'border-slate-700 bg-slate-700/30'
                      : 'border-slate-300 bg-slate-50'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-400'
                }`} />
                <p className={`text-lg font-medium mb-2 ${
                  darkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>
                  Drop your resume here
                </p>
                <p className={`text-sm mb-4 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      console.log('File selected:', e.target.files[0].name);
                      onClose();
                    }
                  }}
                />
                <label htmlFor="file-upload">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg cursor-pointer"
                  >
                    Select File
                  </motion.div>
                </label>
                <p className={`text-xs mt-4 ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export Modal
export function ExportModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Export Analysis Report
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Format Selection */}
              <div className="space-y-3 mb-6">
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Select Format:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(['pdf', 'json', 'csv'] as const).map((format) => (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExportFormat(format)}
                      className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        exportFormat === format
                          ? darkMode
                            ? 'bg-emerald-600 text-white border-2 border-emerald-500'
                            : 'bg-emerald-500 text-white border-2 border-emerald-600'
                          : darkMode
                            ? 'bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {format.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Export Details */}
              <div className={`rounded-lg p-4 mb-6 ${
                darkMode ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Export Includes:
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    ATS Score & Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Skills Assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Keyword Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Recommendations
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={isExporting || exported}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {exported ? (
                    <>
                      <Check className="w-5 h-5" />
                      Exported!
                    </>
                  ) : isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Export
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Share Modal
export function ShareModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://insightats.app/report/abc123xyz";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { icon: Mail, label: 'Email', color: 'from-blue-500 to-blue-600' },
    { icon: MessageSquare, label: 'Message', color: 'from-green-500 to-green-600' },
    { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-600 to-blue-700' },
    { icon: Twitter, label: 'Twitter', color: 'from-sky-500 to-sky-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Share Analysis
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Copy Link */}
              <div className="mb-6">
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Share Link:
                </p>
                <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                  darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className={`flex-1 bg-transparent border-none outline-none text-sm ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : darkMode
                          ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Share Options */}
              <div>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Share via:
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {shareOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Reanalyze Modal
export function ReanalyzeModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={isAnalyzing ? { rotate: 360 } : {}}
                      transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
                    >
                      <Download className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Re-analyze Resume
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  disabled={isAnalyzing}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {!isAnalyzing ? (
                <>
                  <p className={`mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    This will re-run the ATS analysis with our latest algorithms and provide updated insights, recommendations, and scoring.
                  </p>

                  <div className={`rounded-lg p-4 mb-6 ${
                    darkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'
                  }`}>
                    <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                      <strong>Note:</strong> This may take a few moments to complete.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReanalyze}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Re-analyze Now
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full" />
                  </motion.div>
                  <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Analyzing Resume...
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Running advanced ATS algorithms
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Change Password Modal
export function ChangePasswordModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Simulate password change
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Change Password
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Current Password
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    New Password
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Confirm New Password
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-passwords"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show-passwords" className={`text-sm ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Show passwords
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-emerald-500">Password changed successfully!</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={success}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {success ? 'Success!' : 'Change Password'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Delete Account Modal
export function DeleteAccountModal({ isOpen, onClose, darkMode }: ModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirmText === 'DELETE') {
      setIsDeleting(true);
      setTimeout(() => {
        setIsDeleting(false);
        onClose();
        setConfirmText('');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Delete Account
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning */}
              <div className="mb-6">
                <div className={`rounded-lg p-4 mb-4 ${
                  darkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                    <strong>Warning:</strong> This action cannot be undone!
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                    Deleting your account will permanently remove:
                  </p>
                </div>

                <ul className={`space-y-2 mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li className="flex items-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    All your resumes and analyses
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    Your account settings and preferences
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    All saved reports and exports
                  </li>
                </ul>
              </div>

              {/* Confirmation Input */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    darkMode
                      ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-red-500 placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:ring-red-500 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: confirmText === 'DELETE' ? 1.02 : 1 }}
                  whileTap={{ scale: confirmText === 'DELETE' ? 0.98 : 1 }}
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Account
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
