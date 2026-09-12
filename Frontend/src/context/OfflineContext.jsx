import { useEffect, useState, useCallback } from "react";
import { openDB } from "idb";
import { OfflineContext } from "./contexts";

import api from "../utils/api";

const DB_NAME = "karya-db";
const STORE_QUEUE = "sync-queue";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [justSynced, setJustSynced] = useState(false);

  const refreshQueueSize = useCallback(async () => {
    try {
      const db = await getDb();
      const count = await db.count(STORE_QUEUE);
      setQueueSize(count);
    } catch {
      // IndexedDB unavailable
    }
  }, []);

  const queueAction = useCallback(
    async (action) => {
      try {
        const db = await getDb();
        await db.add(STORE_QUEUE, { ...action, queuedAt: Date.now() });
        await refreshQueueSize();
      } catch {
        // no-op
      }
    },
    [refreshQueueSize]
  );

  const syncQueue = useCallback(async () => {
    try {
      const db = await getDb();
      const all = await db.getAll(STORE_QUEUE);
      if (all.length === 0) return;
      
      for (const action of all) {
        try {
          if (action.type === 'BOOKING_CREATED') {
            // The BookingModal now stores backend-compatible fields
            const { type, queuedAt, id, ...bookingPayload } = action;
            await api.post('/bookings', bookingPayload);
          } else if (action.type === 'EMERGENCY_SOS') {
            await api.post('/bookings/sos', action);
          } else if (action.type === 'CART_CHECKOUT') {
            await api.post('/bookings/checkout', action);
          }
          await db.delete(STORE_QUEUE, action.id);
        } catch (error) {
          console.error("Failed to sync action", action.id, error);
        }
      }
      
      const newCount = await db.count(STORE_QUEUE);
      setQueueSize(newCount);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 3000);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function initQueue() {
      try {
        const db = await getDb();
        const count = await db.count(STORE_QUEUE);
        if (active) setQueueSize(count);
      } catch {
        // ignore
      }
    }
    initQueue();

    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      active = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncQueue]);

  return (
    <OfflineContext.Provider
      value={{ isOnline, queueSize, justSynced, queueAction, syncQueue }}
    >
      {children}
    </OfflineContext.Provider>
  );
}
