import { LayoutDashboard, FileText, BarChart3, Settings, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
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

export function Sidebar({ activeSection, setActiveSection, darkMode = false }: SidebarProps) {
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className={`w-64 backdrop-blur-sm border-r fixed left-0 top-[73px] bottom-0 p-4 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800/60 border-slate-700/50' 
        : 'bg-white/50 border-slate-200'
    }`}>
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ 
                scale: 1.05, 
                x: 8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
                isActive
                  ? darkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : darkMode
                    ? 'text-slate-300 hover:bg-slate-700/50'
                    : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {/* Hover effect background */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-5 h-5 relative z-10" />
              </motion.div>
              <span className="font-medium relative z-10">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
