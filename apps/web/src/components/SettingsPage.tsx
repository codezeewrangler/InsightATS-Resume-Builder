import { motion } from 'motion/react';
import { Bell, Lock, Eye, Moon, Zap, Save, User, Mail, Building, Sun, Laptop } from 'lucide-react';
import { useState } from 'react';
import { ChangePasswordModal, ExportModal, DeleteAccountModal } from './ActionModals';

export function SettingsPage({ 
  darkMode = false, 
  themeMode = 'light',
  onThemeModeChange 
}: { 
  darkMode?: boolean;
  themeMode?: 'light' | 'dark' | 'auto';
  onThemeModeChange?: (mode: 'light' | 'dark' | 'auto') => void;
}) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    analysis: true,
    updates: true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showResumes: false,
    analytics: true,
  });

  const [activeModal, setActiveModal] = useState<'password' | 'export' | 'delete' | null>(null);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Settings
        </h2>
        <p className={`text-sm md:text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`backdrop-blur-sm rounded-2xl border shadow-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? 'bg-slate-800/60 border-slate-700/50' 
                : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500'
              }`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Profile Information
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500 placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500 placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500 placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Company
                </label>
                <div className="relative">
                  <Building className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    defaultValue="Tech Innovations Inc."
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-indigo-500 placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`backdrop-blur-sm rounded-2xl border shadow-lg p-6 transition-colors duration-300 ${
              darkMode
                ? 'bg-slate-800/60 border-slate-700/50'
                : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode
                  ? 'bg-gradient-to-br from-green-600 to-emerald-700'
                  : 'bg-gradient-to-br from-green-500 to-emerald-500'
              }`}>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Notifications
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage your notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-3 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Email Notifications
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Receive updates via email
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.email 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.email ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Push Notifications
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Get desktop notifications
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.push 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.push ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Analysis Complete
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Notify when resume analysis is done
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, analysis: !notifications.analysis })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.analysis 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.analysis ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Product Updates
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    News about features and improvements
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, updates: !notifications.updates })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.updates 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.updates ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`backdrop-blur-sm rounded-2xl border shadow-lg p-6 transition-colors duration-300 ${
              darkMode
                ? 'bg-slate-800/60 border-slate-700/50'
                : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode
                  ? 'bg-gradient-to-br from-purple-600 to-pink-700'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Privacy & Security
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Control your data and visibility
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-3 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Public Profile
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Make your profile visible to others
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, publicProfile: !privacy.publicProfile })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.publicProfile 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: privacy.publicProfile ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Show Resumes
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Display your resume count publicly
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, showResumes: !privacy.showResumes })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.showResumes 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: privacy.showResumes ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Analytics Tracking
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Help us improve with usage data
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy({ ...privacy, analytics: !privacy.analytics })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.analytics 
                      ? darkMode ? 'bg-indigo-600' : 'bg-blue-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: privacy.analytics ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <Zap className="w-8 h-8 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
            <p className="text-sm text-blue-100 mb-6">
              Manage your account settings quickly
            </p>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('password')}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-left font-medium text-sm"
              >
                Change Password
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('export')}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-left font-medium text-sm"
              >
                Export Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('delete')}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all text-left font-medium text-sm"
              >
                Delete Account
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`backdrop-blur-sm rounded-2xl border shadow-lg p-6 transition-colors duration-300 ${
              darkMode
                ? 'bg-slate-800/60 border-slate-700/50'
                : 'bg-white/80 border-slate-200'
            }`}
          >
            <Eye className={`w-8 h-8 mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
            <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Appearance
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Customize your dashboard theme
            </p>
            <div className="space-y-2">
              {/* Light Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onThemeModeChange?.('light')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium text-sm transition-all flex items-center gap-3 ${
                  themeMode === 'light'
                    ? darkMode
                      ? 'bg-indigo-600 border-2 border-indigo-500 text-white'
                      : 'bg-white border-2 border-blue-600 text-blue-600'
                    : darkMode
                      ? 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:border-slate-500'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </motion.button>

              {/* Dark Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onThemeModeChange?.('dark')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium text-sm transition-all flex items-center gap-3 ${
                  themeMode === 'dark'
                    ? darkMode
                      ? 'bg-indigo-600 border-2 border-indigo-500 text-white'
                      : 'bg-white border-2 border-blue-600 text-blue-600'
                    : darkMode
                      ? 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:border-slate-500'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </motion.button>

              {/* Auto Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onThemeModeChange?.('auto')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium text-sm transition-all flex items-center gap-3 ${
                  themeMode === 'auto'
                    ? darkMode
                      ? 'bg-indigo-600 border-2 border-indigo-500 text-white'
                      : 'bg-white border-2 border-blue-600 text-blue-600'
                    : darkMode
                      ? 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:border-slate-500'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <div className="flex-1">
                  <div>Auto</div>
                  <div className={`text-xs ${
                    themeMode === 'auto' 
                      ? darkMode ? 'text-indigo-200' : 'text-blue-500'
                      : darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Follows system
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </motion.div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={activeModal === 'password'}
        onClose={() => setActiveModal(null)}
        darkMode={darkMode}
      />
      <ExportModal
        isOpen={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        darkMode={darkMode}
      />
      <DeleteAccountModal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        darkMode={darkMode}
      />
    </div>
  );
}