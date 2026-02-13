import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResumeData } from '../utils/resumeAnalyzer';

interface ComparisonData {
  label: string;
  current: number;
  potential: number;
}

function buildComparisonData(resumeData: ResumeData): ComparisonData[] {
  const data: ComparisonData[] = [
    {
      label: 'ATS Score',
      current: resumeData.atsScore,
      potential: Math.min(100, resumeData.atsScore + Math.round((100 - resumeData.atsScore) * 0.6)),
    },
    {
      label: 'Keywords',
      current: resumeData.keywordMatchScore,
      potential: Math.min(100, resumeData.keywordMatchScore + Math.round((100 - resumeData.keywordMatchScore) * 0.5)),
    },
    {
      label: 'Format',
      current: resumeData.formatQualityScore,
      potential: Math.min(100, resumeData.formatQualityScore + Math.round((100 - resumeData.formatQualityScore) * 0.7)),
    },
    {
      label: 'Impact',
      current: resumeData.impactScore,
      potential: Math.min(100, resumeData.impactScore + Math.round((100 - resumeData.impactScore) * 0.5)),
    },
  ];

  if (resumeData.jobMatchScore) {
    data.push({
      label: 'Job Match',
      current: resumeData.jobMatchScore,
      potential: Math.min(100, resumeData.jobMatchScore + Math.round((100 - resumeData.jobMatchScore) * 0.4)),
    });
  }

  return data;
}

export function ComparisonSlider({ darkMode = false, resumeData }: { darkMode?: boolean; resumeData?: ResumeData | null }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const comparisonData = resumeData ? buildComparisonData(resumeData) : [];

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={`rounded-2xl p-4 md:p-6 shadow-lg border transition-colors duration-300 ${darkMode
          ? 'bg-slate-800/60 border-slate-700/50 shadow-slate-900/50'
          : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}
    >
      <div className="mb-4 md:mb-6">
        <h3 className={`font-bold text-lg md:text-xl mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Current vs Potential</h3>
        <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Slide to compare current scores with potential improvements</p>
      </div>

      {comparisonData.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="text-sm">Upload a resume to see comparison analysis.</p>
        </div>
      ) : (
        <>
          <div
            className={`relative h-48 md:h-64 rounded-xl overflow-hidden cursor-ew-resize ${darkMode
                ? 'bg-gradient-to-r from-slate-700 to-indigo-900/50'
                : 'bg-gradient-to-r from-slate-100 to-indigo-100'
              }`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Current State */}
            <div className="absolute inset-0 p-4 md:p-6">
              <div className={`text-xs md:text-sm font-semibold mb-3 md:mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>CURRENT</div>
              <div className="space-y-2 md:space-y-3">
                {comparisonData.map((item) => (
                  <div key={`current-${item.label}`} className="flex items-center justify-between">
                    <span className={`text-xs md:text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                    <span className={`text-base md:text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.current}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential State - Clipped */}
            <motion.div
              className="absolute inset-0 p-4 md:p-6 bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4">POTENTIAL</div>
              <div className="space-y-2 md:space-y-3">
                {comparisonData.map((item) => (
                  <div key={`potential-${item.label}`} className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-white">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg font-bold text-white">{item.potential}%</span>
                      {item.potential > item.current && (
                        <TrendingUp className="w-4 h-4 text-emerald-300" />
                      )}
                      {item.potential < item.current && (
                        <TrendingDown className="w-4 h-4 text-red-300" />
                      )}
                      {item.potential === item.current && (
                        <Minus className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Slider Handle */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%` }}
              animate={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-slate-400 rounded-full" />
                  <div className="w-0.5 h-4 bg-slate-400 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <motion.span
              className={darkMode ? 'text-slate-400' : 'text-slate-600'}
              animate={{ opacity: sliderPosition < 50 ? 1 : 0.4 }}
            >
              Current
            </motion.span>
            <div className={`w-32 h-1 rounded-full relative ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <motion.div
                className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full"
                style={{ width: `${sliderPosition}%` }}
              />
            </div>
            <motion.span
              className={`font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              animate={{ opacity: sliderPosition > 50 ? 1 : 0.4 }}
            >
              Potential
            </motion.span>
          </div>
        </>
      )}
    </motion.div>
  );
}