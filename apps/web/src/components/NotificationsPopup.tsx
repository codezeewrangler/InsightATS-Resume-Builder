import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, TrendingUp, Clock, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'improvement';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export function NotificationsPopup({ isOpen, onClose, darkMode = false }: NotificationsPopupProps) {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'improvement':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map((notif) => ({ ...notif, unread: false }))
    );
  };

  const removeNotification = (id: number) => {
    setNotificationsList(notificationsList.filter((notif) => notif.id !== id));
  };

  const unreadCount = notificationsList.filter((n) => n.unread).length;

  void onClose;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={`absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl border overflow-hidden ${
            darkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
          style={{ zIndex: 60 }}
        >
          {/* Header */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`font-semibold text-base ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-500">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`text-xs font-medium transition-colors ${
                  darkMode
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-700'
                }`}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notificationsList.length > 0 ? (
              notificationsList.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`px-4 py-3 border-b transition-colors ${
                    darkMode
                      ? 'border-slate-700 hover:bg-slate-700/50'
                      : 'border-slate-100 hover:bg-slate-50'
                  } ${notification.unread ? (darkMode ? 'bg-slate-700/30' : 'bg-blue-50/50') : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-medium text-sm ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {notification.title}
                          {notification.unread && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className={`flex-shrink-0 p-1 rounded transition-colors ${
                            darkMode
                              ? 'hover:bg-slate-600 text-slate-400 hover:text-slate-300'
                              : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className={`w-3 h-3 ${
                          darkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                        <span className={`text-xs ${
                          darkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-100'
                }`}>
                  <CheckCircle className={`w-8 h-8 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
                <p className={`text-sm ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  No notifications
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificationsList.length > 0 && (
            <div className={`px-4 py-2 border-t ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                className={`w-full text-center text-sm font-medium py-1.5 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-indigo-400 hover:bg-slate-700'
                    : 'text-indigo-600 hover:bg-slate-50'
                }`}
              >
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}