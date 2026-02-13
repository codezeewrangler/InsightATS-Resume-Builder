import { ScoreCards } from './ScoreCards';
import { ResumePreview } from './ResumePreview';
import { MetricsChart } from './MetricsChart';
import { SkillsAnalysis } from './SkillsAnalysis';
import { KeywordsSection } from './KeywordsSection';
import { ATSCompatibility } from './ATSCompatibility';
import { ImprovementSuggestions } from './ImprovementSuggestions';
import { ComparisonSlider } from './ComparisonSlider';
import { InteractiveTabs } from './InteractiveTabs';
import { CircularProgress } from './CircularProgress';
import { AnimatedStats } from './AnimatedStats';
import { Upload, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../utils/resumeAnalyzer';
import { ImprovementSuggestionItem } from '../utils/improvementSuggestions';

interface ResumeAnalysisProps {
  fileName: string;
  onReset: () => void;
  darkMode?: boolean;
  jobDescription?: string;
  resumeData: ResumeData | null;
  isAnalyzing: boolean;
  onApplyInEditor?: (suggestions: ImprovementSuggestionItem[]) => void;
}

export function ResumeAnalysis({ 
  fileName, 
  onReset, 
  darkMode = false, 
  jobDescription,
  resumeData,
  isAnalyzing,
  onApplyInEditor,
}: ResumeAnalysisProps) {
  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`backdrop-blur-sm rounded-3xl shadow-xl border p-12 text-center ${
            darkMode 
              ? 'bg-slate-800/60 border-slate-700/50' 
              : 'bg-white/80 border-slate-200'
          }`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Loader2 className={`w-20 h-20 ${
              darkMode ? 'text-indigo-400' : 'text-blue-600'
            }`} />
          </motion.div>
          
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Analyzing Resume...
          </h2>
          
          <p className={`text-lg mb-4 ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {fileName}
          </p>
          
          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              ✓ Extracting text content
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              ✓ Analyzing structure and formatting
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              ✓ Calculating ATS compatibility score
            </motion.p>
            {jobDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                ✓ Matching against job description
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Show message if no data available yet
  if (!resumeData) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
          Loading analysis...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
            darkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Resume Analysis
          </h2>
          <p className={`text-sm md:text-base ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Comprehensive ATS compatibility check for {fileName}
          </p>
        </div>
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
            darkMode 
              ? 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-indigo-400' 
              : 'bg-white/80 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">New Upload</span>
        </motion.button>
      </div>

      {/* Job Description Match Banner */}
      {jobDescription && typeof resumeData.jobMatchScore === 'number' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-sm border rounded-xl p-4 shadow-lg ${
            darkMode
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
            }`}>
              <Briefcase className={`w-5 h-5 ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
                <h3 className={`font-semibold ${
                  darkMode ? 'text-emerald-300' : 'text-emerald-900'
                }`}>
                  Job-Specific Analysis Active - {resumeData.jobMatchScore}% Match
                </h3>
              </div>
              <p className={`text-sm mt-1 ${
                darkMode ? 'text-emerald-400/80' : 'text-emerald-700'
              }`}>
                Resume matched against {resumeData.matchingSkills?.length || 0} required skills from job description
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <ScoreCards darkMode={darkMode} resumeData={resumeData} />

      <AnimatedStats darkMode={darkMode} resumeData={resumeData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <MetricsChart darkMode={darkMode} resumeData={resumeData} />
        </div>
        <div>
          <ResumePreview darkMode={darkMode} resumeData={resumeData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SkillsAnalysis darkMode={darkMode} resumeData={resumeData} />
        <KeywordsSection darkMode={darkMode} resumeData={resumeData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ComparisonSlider darkMode={darkMode} resumeData={resumeData} />
        <InteractiveTabs darkMode={darkMode} resumeData={resumeData} />
      </div>

      <CircularProgress darkMode={darkMode} resumeData={resumeData} />

      <ATSCompatibility darkMode={darkMode} resumeData={resumeData} />

      <ImprovementSuggestions
        darkMode={darkMode}
        resumeData={resumeData}
        onApplyInEditor={onApplyInEditor}
      />
    </div>
  );
}
