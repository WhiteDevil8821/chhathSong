import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface PresenceState {
  online: number;
  peakToday: number;
  isExact: boolean;
  isSyncing: boolean;
}

const PresenceContext = createContext<PresenceState>({
  online: 1,
  peakToday: 1,
  isExact: true,
  isSyncing: false
});

// Device-level unique ID shared across tabs in the same browser
function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'chhath_device_presence_id';
  let id = '';
  try {
    id = localStorage.getItem(STORAGE_KEY) || '';
    if (!id) {
      id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // Storage restricted
      }
    }
  } catch {
    id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  }
  return id;
}

export const PresenceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [presence, setPresence] = useState<PresenceState>({
    online: 1,
    peakToday: 1,
    isExact: true,
    isSyncing: true
  });

  // Track last known online count in Firestore to prevent redundant writes
  const lastRecordedFirestoreCount = useRef<number | null>(null);
  const lastRecordedTime = useRef<number>(0);

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    const sessionDocRef = doc(db, 'presence', deviceId);
    const globalStatsDocRef = doc(db, 'stats', 'live_presence');
    let heartbeatTimer: NodeJS.Timeout | null = null;
    let broadcastChannel: BroadcastChannel | null = null;
    let isMounted = true;
    let isLeader = true;

    // 1. Cross-tab Coordinator (0 extra writes/reads for duplicate tabs)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('chhath_devotee_sync');

        // Claim leadership or defer to existing active tab
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'PRESENCE_UPDATE' && typeof event.data.online === 'number') {
            if (isMounted) {
              setPresence((prev) => ({
                online: Math.max(1, event.data.online),
                peakToday: Math.max(prev.peakToday, event.data.peakToday || event.data.online),
                isExact: true,
                isSyncing: false
              }));
            }
          }
        };
      }
    } catch {
      // BroadcastChannel unavailable
    }

    // Helper: Compute live count and ONLY write to Firestore if the number has CHANGED
    const syncActiveCount = async () => {
      if (!isMounted) return;
      try {
        // Sessions active in the last 150 seconds (2.5 mins)
        const cutoffTime = new Date(Date.now() - 150 * 1000);
        const activePresenceQuery = query(
          collection(db, 'presence'),
          where('lastSeen', '>=', Timestamp.fromDate(cutoffTime))
        );

        let activeCount = 1;
        try {
          // Server aggregation cost: 1 read per 1,000 documents
          const countSnap = await getCountFromServer(activePresenceQuery);
          activeCount = Math.max(1, countSnap.data().count);
        } catch {
          const fallbackSnap = await getCountFromServer(collection(db, 'presence'));
          activeCount = Math.max(1, fallbackSnap.data().count);
        }

        if (isMounted) {
          setPresence((prev) => {
            const newPeak = Math.max(prev.peakToday, activeCount);
            // Broadcast locally to sibling tabs on the same machine (0 network cost)
            if (broadcastChannel) {
              broadcastChannel.postMessage({
                type: 'PRESENCE_UPDATE',
                online: activeCount,
                peakToday: newPeak
              });
            }
            return {
              online: activeCount,
              peakToday: newPeak,
              isExact: true,
              isSyncing: false
            };
          });
        }

        // --- WRITE-MINIMIZATION LOGIC ---
        // ONLY write to /stats/live_presence IF the count actually changed or > 3 mins passed!
        const now = Date.now();
        const hasCountChanged = lastRecordedFirestoreCount.current !== activeCount;
        const isTimeStale = now - lastRecordedTime.current > 180000; // 3 minutes

        if (hasCountChanged || isTimeStale) {
          lastRecordedFirestoreCount.current = activeCount;
          lastRecordedTime.current = now;

          await setDoc(
            globalStatsDocRef,
            {
              online: activeCount,
              updatedAt: serverTimestamp()
            },
            { merge: true }
          );
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'presence/count');
      }
    };

    // 2. Initial Registration (1 write upon page open)
    const registerDevice = async () => {
      try {
        await setDoc(sessionDocRef, {
          deviceId,
          lastSeen: serverTimestamp()
        });
        await syncActiveCount();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `presence/${deviceId}`);
      }
    };

    registerDevice();

    // 3. Relaxed Heartbeat (Every 60s while tab is active, instead of 25s)
    // Cuts device session writes by >58%
    heartbeatTimer = setInterval(async () => {
      // If user is not looking at the tab, pause heartbeats to save writes
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      try {
        await setDoc(sessionDocRef, {
          deviceId,
          lastSeen: serverTimestamp()
        });
        await syncActiveCount();
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `presence/${deviceId}`);
      }
    }, 60000); // 60 seconds interval

    // 4. Single-document Realtime Listener (O(1) read: only 1 read when global count changes)
    const unsubscribeStats = onSnapshot(
      globalStatsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && typeof data.online === 'number') {
            const count = Math.max(1, data.online);
            lastRecordedFirestoreCount.current = count;
            if (isMounted) {
              setPresence((prev) => ({
                online: count,
                peakToday: Math.max(prev.peakToday, count),
                isExact: true,
                isSyncing: false
              }));
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'stats/live_presence');
      }
    );

    // 5. Smart Visibility Recovery (When user switches back to this tab, refresh session)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        registerDevice();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 6. Cleanup on tab close
    const handleUnload = () => {
      try {
        deleteDoc(sessionDocRef).catch(() => {});
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      isMounted = false;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (broadcastChannel) broadcastChannel.close();
      unsubscribeStats();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      deleteDoc(sessionDocRef).catch(() => {});
    };
  }, []);

  return <PresenceContext.Provider value={presence}>{children}</PresenceContext.Provider>;
};

export const useRealtimePresence = () => useContext(PresenceContext);
