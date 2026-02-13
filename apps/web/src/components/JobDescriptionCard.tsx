import { motion } from 'motion/react';
import { Briefcase, Sparkles, Save, X } from 'lucide-react';
import { useState } from 'react';

interface JobDescriptionCardProps {
  onJobDescriptionChange: (description: string) => void;
  initialValue?: string;
  darkMode?: boolean;
}

export function JobDescriptionCard({ 
  onJobDescriptionChange, 
  initialValue = '',
  darkMode = false 
}: JobDescriptionCardProps) {
  const [jobDescription, setJobDescription] = useState(initialValue);
  const [isSaved, setIsSaved] = useState(!!initialValue);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    if (jobDescription.trim()) {
      onJobDescriptionChange(jobDescription);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    onJobDescriptionChange('');
  };

  const exampleJD = `Senior Software Engineer

We are seeking an experienced Senior Software Engineer to join our dynamic team. The ideal candidate will have 5+ years of experience in full-stack development.

Key Responsibilities:
• Design and develop scalable web applications
• Lead technical discussions and code reviews
• Mentor junior developers
• Collaborate with cross-functional teams

Required Skills:
• React, Node.js, TypeScript
• AWS or Azure cloud platforms
• RESTful API design
• Agile methodologies
• Strong problem-solving skills

Qualifications:
• Bachelor's degree in Computer Science or related field
• 5+ years of professional software development experience
• Excellent communication and teamwork skills`;

  const handleUseExample = () => {
    setJobDescription(exampleJD);
    onJobDescriptionChange(exampleJD);
    setIsExpanded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl"
    >
      <div className={`backdrop-blur-sm rounded-3xl shadow-xl border p-6 md:p-8 transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-800/60 border-slate-700/50' 
          : 'bg-white/80 border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-md ${
                darkMode
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-500'
              }`}
            >
              <Briefcase className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className={`text-xl md:text-2xl font-bold ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Job Description
              </h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Optional - For better matching
              </p>
            </div>
          </div>
          
          {jobDescription && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-slate-700 text-slate-400' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Paste the job description to get tailored analysis on how well your resume matches the position
        </p>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Paste job description here..."
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
              isExpanded ? 'min-h-[240px]' : 'min-h-[120px]'
            } ${
              darkMode
                ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-emerald-500 placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 focus:ring-emerald-500 placeholder-slate-400'
            }`}
          />
          
          {/* Character count */}
          {jobDescription && (
            <div className={`absolute bottom-3 right-3 text-xs ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {jobDescription.length} characters
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {!jobDescription && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUseExample}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                darkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Use Example
            </motion.button>
          )}
          
          {jobDescription && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaved}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isSaved
                    ? darkMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg'
                }`}
              >
                {isSaved ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Job Description
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </motion.button>
            </>
          )}
        </div>

        {/* Info Box */}
        {jobDescription && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 p-3 rounded-lg border ${
              darkMode
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <p className={`text-xs flex items-center gap-2 ${
              darkMode ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              <Sparkles className="w-4 h-4" />
              Your resume analysis will be optimized to match this job description
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
