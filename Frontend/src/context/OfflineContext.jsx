import { useEffect, useState, useCallback } from "react";
import { openDB } from "idb";
import { OfflineContext } from "./contexts";

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
      await db.clear(STORE_QUEUE);
      setQueueSize(0);
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
