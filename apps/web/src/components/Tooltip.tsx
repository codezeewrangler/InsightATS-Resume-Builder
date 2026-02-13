import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
              {content}
              <div
                className={`absolute w-2 h-2 bg-slate-900/95 border-slate-700 rotate-45 ${
                  position === 'top'
                    ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b'
                    : position === 'bottom'
                    ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t'
                    : position === 'left'
                    ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r'
                    : 'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
