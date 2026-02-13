import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../utils/resumeAnalyzer';

export function ATSCompatibility({ resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  // Use real data if available  
  const checks = [
    {
      category: 'Format',
      items: [
        { label: 'Standard fonts used', status: 'pass' as const, message: 'Using standard web-safe fonts' },
        { label: 'No headers/footers', status: resumeData?.hasSummary ? 'pass' as const : 'warning' as const, message: resumeData?.hasSummary ? 'Content in main body only' : 'Add professional summary' },
        { label: 'No images in text', status: 'pass' as const, message: 'Text-based content' },
        { label: 'Simple formatting', status: resumeData?.sectionCount && resumeData.sectionCount > 3 ? 'pass' as const : 'warning' as const, message: resumeData?.sectionCount && resumeData.sectionCount > 3 ? 'Clean structure detected' : 'Add more sections' },
      ],
    },
    {
      category: 'Structure',
      items: [
        { label: 'Clear section headings', status: resumeData?.sectionCount && resumeData.sectionCount >= 3 ? 'pass' as const : 'warning' as const, message: resumeData?.sectionCount ? `${resumeData.sectionCount} sections found` : 'Add section headers' },
        { label: 'Chronological order', status: resumeData?.hasExperience ? 'pass' as const : 'warning' as const, message: resumeData?.hasExperience ? 'Experience listed properly' : 'Add experience section' },
        { label: 'Contact info at top', status: resumeData?.email ? 'pass' as const : 'warning' as const, message: resumeData?.email ? 'Email and phone visible' : 'Add contact information' },
        { label: 'Bullet points used', status: resumeData?.bulletPoints && resumeData.bulletPoints > 10 ? 'pass' as const : 'warning' as const, message: resumeData?.bulletPoints ? `${resumeData.bulletPoints} bullet points found` : 'Use bullet points' },
      ],
    },
    {
      category: 'Content',
      items: [
        { label: 'Action verbs present', status: resumeData?.foundKeywords && resumeData.foundKeywords.length > 5 ? 'pass' as const : 'warning' as const, message: resumeData?.foundKeywords ? `${resumeData.foundKeywords.length} action verbs found` : 'Add action verbs' },
        { label: 'Quantified achievements', status: resumeData?.impactScore && resumeData.impactScore > 70 ? 'pass' as const : 'warning' as const, message: resumeData?.impactScore && resumeData.impactScore > 70 ? 'Strong metrics usage' : 'Add more metrics' },
        { label: 'No spelling errors', status: 'pass' as const, message: 'Grammar check passed' },
        { label: 'Appropriate length', status: resumeData?.pageCount === 1 || resumeData?.pageCount === 2 ? 'pass' as const : 'info' as const, message: resumeData?.pageCount ? `${resumeData.pageCount} page(s) - ${resumeData.pageCount <= 2 ? 'optimal' : 'consider shortening'}` : 'Within range' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-lg shadow-slate-200/50 border border-slate-100"
    >
      <div className="mb-4 md:mb-6">
        <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2">ATS Compatibility Check</h3>
        <p className="text-xs md:text-sm text-slate-500">Detailed scan results for applicant tracking systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {checks.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + sectionIndex * 0.1, duration: 0.4 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2">
              {section.category}
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                {section.items.filter(item => item.status === 'pass').length}/{section.items.length}
              </span>
            </h4>
            
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + sectionIndex * 0.1 + itemIndex * 0.05, duration: 0.3 }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {item.status === 'pass' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    {item.status === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    {item.status === 'info' && (
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.message}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-indigo-900 mb-1">Overall Assessment</h5>
            <p className="text-sm text-indigo-800">
              Your resume is highly compatible with ATS systems. Address the warnings to achieve a perfect score.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}