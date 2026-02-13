import { Bell, Search, User, Menu, LogOut, Settings, LogIn, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { NotificationsPopup } from './NotificationsPopup';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  user?: { email: string; full_name?: string } | null;
  onSignOut?: () => void;
  onNavigate?: (section: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function DashboardHeader({ onMenuClick, user, onSignOut, onNavigate, darkMode, onToggleDarkMode }: DashboardHeaderProps) {
  const [notifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = () => {
    setShowProfileMenu(false);
    if (onNavigate) {
      onNavigate('auth');
    }
  };

  const handleSettings = () => {
    setShowProfileMenu(false);
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleSignOut = () => {
    setShowProfileMenu(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <header className={`backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300 ${
      darkMode
        ? 'bg-slate-900/80 border-slate-700'
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Left Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
              aria-label="Open menu"
            >
              <Menu className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            </motion.button>

            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={() => onNavigate && onNavigate('dashboard')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNavigate && onNavigate('dashboard');
                }
              }}
              aria-label="Go to dashboard"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-base leading-none mb-0.5 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  InsightATS
                </h1>
                <p className={`text-[11px] leading-none ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Resume Intelligence
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Search - hidden on mobile */}
            <div className="relative hidden md:block">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 lg:w-56 transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50/80 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Mobile search button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
              aria-label="Search"
            >
              <Search className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                    aria-label={`${notifications} notifications`}
                  />
                )}
              </motion.button>

              {/* Notifications Popup */}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPopup
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    darkMode={darkMode}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Profile Button with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 pl-2 pr-1.5 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="User menu"
                aria-expanded={showProfileMenu}
              >
                {user ? (
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-xs">
                      {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <User className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 hidden sm:block transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                } ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border overflow-hidden ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                    style={{ zIndex: 60 }}
                  >
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className={`p-3.5 border-b ${
                          darkMode ? 'border-slate-700' : 'border-slate-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                              <span className="text-white font-semibold text-base">
                                {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate text-sm leading-tight mb-1 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {user.full_name || 'User'}
                              </p>
                              <p className={`text-xs truncate leading-tight ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1.5">
                          <button
                            onClick={handleSettings}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm ${
                              darkMode
                                ? 'hover:bg-slate-700 text-slate-300'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <Settings className={`w-4 h-4 ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                            <span>Settings</span>
                          </button>
                          <button
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm text-red-500 ${
                              darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                            }`}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Not Signed In */}
                        <div className={`p-3.5 border-b ${
                          darkMode ? 'border-slate-700' : 'border-slate-100'
                        }`}>
                          <p className={`text-xs leading-relaxed ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Sign in to save your resumes and track your progress across devices.
                          </p>
                        </div>
                        <div className="p-1.5">
                          <button
                            onClick={handleSignIn}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                          </button>
                          <button
                            onClick={handleSettings}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mt-1 transition-colors text-sm ${
                              darkMode
                                ? 'hover:bg-slate-700 text-slate-300'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <Settings className={`w-4 h-4 ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                            <span>Settings</span>
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
              onClick={onToggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
              ) : (
                <Moon className={`w-5 h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}