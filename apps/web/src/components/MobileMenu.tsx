import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutDashboard, FileText, BarChart3, Settings, Star } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  darkMode?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'editor', label: 'Resume Editor', icon: FileText },
  { id: 'saved', label: 'Saved Resumes', icon: Star },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MobileMenu({ isOpen, onClose, activeSection, setActiveSection, darkMode = false }: MobileMenuProps) {
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed left-0 top-0 bottom-0 w-64 shadow-2xl z-50 lg:hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('dashboard')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNavigation('dashboard');
                  }
                }}
                aria-label="Go to dashboard"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                }`}>
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <div>
                  <h2 className={`font-bold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    InsightATS
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Menu
                  </p>
                </div>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-slate-700 text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? darkMode
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : darkMode
                          ? 'text-slate-300 hover:bg-slate-700/50'
                          : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
