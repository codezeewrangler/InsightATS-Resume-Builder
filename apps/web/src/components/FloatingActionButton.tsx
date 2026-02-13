import { Upload, Download, Share2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { UploadModal, ExportModal, ShareModal, ReanalyzeModal } from './ActionModals';

export function FloatingActionButton({ darkMode = false }: { darkMode?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'upload' | 'export' | 'share' | 'reanalyze' | null>(null);

  const actions = [
    { 
      icon: Upload, 
      label: 'Upload New', 
      color: 'from-blue-500 to-indigo-500',
      modal: 'upload' as const
    },
    { 
      icon: Download, 
      label: 'Export Report', 
      color: 'from-emerald-500 to-teal-500',
      modal: 'export' as const
    },
    { 
      icon: Share2, 
      label: 'Share', 
      color: 'from-purple-500 to-pink-500',
      modal: 'share' as const
    },
    { 
      icon: RefreshCw, 
      label: 'Re-analyze', 
      color: 'from-orange-500 to-red-500',
      modal: 'reanalyze' as const
    },
  ];

  const handleActionClick = (modal: typeof activeModal) => {
    setActiveModal(modal);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 md:bottom-20 right-0 space-y-3"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, x: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleActionClick(action.modal)}
                    className={`flex items-center gap-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group`}
                  >
                    <span className="text-xs md:text-sm font-medium hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                      {action.label}
                    </span>
                    <Icon className="w-5 h-5" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center transition-shadow"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.div>
        </motion.button>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={activeModal === 'upload'} 
        onClose={() => setActiveModal(null)} 
        darkMode={darkMode}
      />
      <ExportModal 
        isOpen={activeModal === 'export'} 
        onClose={() => setActiveModal(null)} 
        darkMode={darkMode}
      />
      <ShareModal 
        isOpen={activeModal === 'share'} 
        onClose={() => setActiveModal(null)} 
        darkMode={darkMode}
      />
      <ReanalyzeModal 
        isOpen={activeModal === 'reanalyze'} 
        onClose={() => setActiveModal(null)} 
        darkMode={darkMode}
      />
    </>
  );
}