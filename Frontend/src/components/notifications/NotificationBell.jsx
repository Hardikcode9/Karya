import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, CreditCard, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data?.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up a polling interval for notifications
    const intervalId = setInterval(fetchNotifications, 60000); // every minute
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "payment":
        return <CreditCard size={14} className="text-emerald-600" />;
      case "booking":
        return <Calendar size={14} className="text-olive-600" />;
      default:
        return <Bell size={14} className="text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-charcoal dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-dark-surface">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between bg-cream/50 dark:bg-dark-surface/50">
              <h3 className="font-display font-semibold text-charcoal dark:text-dark-text">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-olive-700 dark:text-olive-400 font-medium hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-charcoal/50 dark:text-dark-muted">
                  <Bell size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-charcoal/5 dark:divide-dark-border/50">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-4 flex gap-3 transition-colors ${
                        !notif.isRead
                          ? "bg-olive-50/50 dark:bg-olive-900/10"
                          : "hover:bg-charcoal/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                          !notif.isRead
                            ? "bg-white dark:bg-dark-surface shadow-xs"
                            : "bg-charcoal/5 dark:bg-white/5"
                        }`}
                      >
                        {getIconForType(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal dark:text-dark-text mb-0.5">
                          {notif.title}
                        </p>
                        <p className="text-xs text-charcoal/70 dark:text-dark-muted line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-charcoal/40 dark:text-dark-muted/50 mt-1 font-medium">
                          {new Date(notif.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal/30 hover:text-olive-600 hover:bg-olive-100 transition-colors shrink-0"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
