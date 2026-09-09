import { AnimatePresence, motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { useOffline } from "../../hooks/useOffline";

export default function OfflineIndicator() {
  const { isOnline, queueSize, justSynced } = useOffline();

  return (
    <AnimatePresence>
      {(!isOnline || justSynced) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
        >
          {!isOnline ? (
            <div className="flex items-start gap-3 bg-charcoal text-cream rounded-2xl px-4 py-3.5 shadow-soft">
              <WifiOff size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm leading-snug">
                You're offline. Your changes will sync automatically when you're back online.
                {queueSize > 0 && (
                  <span className="block text-cream/60 mt-1">{queueSize} action(s) waiting to sync.</span>
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-olive-700 text-cream rounded-2xl px-4 py-3 shadow-soft">
              <RefreshCw size={16} />
              <p className="text-sm">Back online — your changes are synced.</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
