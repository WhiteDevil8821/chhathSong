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

// Generate unique ID for this specific tab instance
function generateTabId(): string {
  return 'tab_' + Math.random().toString(36).substring(2, 9);
}

// Configuration Constants for Optimized Firestore Writes
const HEARTBEAT_INTERVAL_MS = 75000; // 75 seconds (reduced write frequency)
const MIN_WRITE_THROTTLE_MS = 30000;  // 30 seconds minimum between any writes (eliminates reconnect bursts)
const PRESENCE_ACTIVE_CUTOFF_SEC = 200; // 200 seconds cutoff for active query
const STATS_WRITE_THROTTLE_MS = 180000; // 3 minutes throttle for aggregated stats document write

export const PresenceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [presence, setPresence] = useState<PresenceState>({
    online: 1,
    peakToday: 1,
    isExact: true,
    isSyncing: true
  });

  // Write throttling and tracking refs
  const lastWriteTimeRef = useRef<number>(0);
  const lastRecordedFirestoreCount = useRef<number | null>(null);
  const lastStatsWriteTime = useRef<number>(0);
  const isLeaderRef = useRef<boolean>(true);
  const tabIdRef = useRef<string>(generateTabId());

  useEffect(() => {
    const deviceId = getOrCreateDeviceId();
    const tabId = tabIdRef.current;
    const sessionDocRef = doc(db, 'presence', deviceId);
    const globalStatsDocRef = doc(db, 'stats', 'live_presence');
    
    let heartbeatTimer: NodeJS.Timeout | null = null;
    let broadcastChannel: BroadcastChannel | null = null;
    let isMounted = true;

    // -------------------------------------------------------------
    // STRATEGY 3: Multi-Tab Sync & Tab Leadership via BroadcastChannel
    // Ensures N tabs on the same browser share exactly 1 write stream
    // -------------------------------------------------------------
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('chhath_devotee_sync');

        // Announce presence to other tabs and negotiate leadership
        broadcastChannel.postMessage({
          type: 'TAB_OPENED',
          tabId,
          deviceId
        });

        broadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          // If an older leader tab exists, become follower (no Firestore writes)
          if (data.type === 'LEADER_HEARTBEAT' && data.tabId !== tabId) {
            isLeaderRef.current = false;
          }

          // Follower tab receives updated presence count directly from Leader (0 network cost)
          if (data.type === 'PRESENCE_BROADCAST' && typeof data.online === 'number') {
            if (isMounted) {
              setPresence((prev) => ({
                online: Math.max(1, data.online),
                peakToday: Math.max(prev.peakToday, data.peakToday || data.online),
                isExact: true,
                isSyncing: false
              }));
            }
          }

          // If current leader closes, claim leadership
          if (data.type === 'LEADER_CLOSED') {
            isLeaderRef.current = true;
            scheduleHeartbeat(true);
          }
        };
      }
    } catch {
      // BroadcastChannel fallback: Single tab mode
      isLeaderRef.current = true;
    }

    // -------------------------------------------------------------
    // STRATEGY 4: Local Write Throttling on Reconnect & Actions
    // Prevents burst writes during reconnects or rapid tab toggling
    // -------------------------------------------------------------
    const canPerformWrite = (isForce: boolean = false): boolean => {
      if (!isLeaderRef.current) return false;
      const now = Date.now();
      if (!isForce && now - lastWriteTimeRef.current < MIN_WRITE_THROTTLE_MS) {
        return false; // Throttled: Less than 30s since last write
      }
      return true;
    };

    // Helper: Compute live count from Firestore server aggregation
    const syncActiveCount = async () => {
      if (!isMounted) return;
      try {
        const cutoffTime = new Date(Date.now() - PRESENCE_ACTIVE_CUTOFF_SEC * 1000);
        const activePresenceQuery = query(
          collection(db, 'presence'),
          where('lastSeen', '>=', Timestamp.fromDate(cutoffTime))
        );

        let activeCount = 1;
        try {
          const countSnap = await getCountFromServer(activePresenceQuery);
          activeCount = Math.max(1, countSnap.data().count);
        } catch {
          const fallbackSnap = await getCountFromServer(collection(db, 'presence'));
          activeCount = Math.max(1, fallbackSnap.data().count);
        }

        if (isMounted) {
          setPresence((prev) => {
            const newPeak = Math.max(prev.peakToday, activeCount);
            
            // Broadcast locally to sibling tabs in same browser
            if (broadcastChannel) {
              broadcastChannel.postMessage({
                type: 'PRESENCE_BROADCAST',
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

        // Write to /stats/live_presence ONLY if count changed or > 3 mins passed
        const now = Date.now();
        const hasCountChanged = lastRecordedFirestoreCount.current !== activeCount;
        const isTimeStale = now - lastStatsWriteTime.current > STATS_WRITE_THROTTLE_MS;

        if (isLeaderRef.current && (hasCountChanged || isTimeStale)) {
          lastRecordedFirestoreCount.current = activeCount;
          lastStatsWriteTime.current = now;

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

    // -------------------------------------------------------------
    // Write Pulse: Updates device presence in Firestore
    // -------------------------------------------------------------
    const performHeartbeatWrite = async (isForce: boolean = false) => {
      if (!isMounted) return;

      // STRATEGY 1: Visibility Gating - Do NOT write if user has hidden/minimized the tab
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      // STRATEGY 4: Local Write Throttling check
      if (!canPerformWrite(isForce)) {
        return;
      }

      try {
        lastWriteTimeRef.current = Date.now();

        await setDoc(sessionDocRef, {
          deviceId,
          lastSeen: serverTimestamp()
        });

        // Broadcast to other tabs that this leader is healthy
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'LEADER_HEARTBEAT',
            tabId,
            deviceId
          });
        }

        await syncActiveCount();
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `presence/${deviceId}`);
      }
    };

    // -------------------------------------------------------------
    // STRATEGY 2: Increased Heartbeat Interval (75s)
    // -------------------------------------------------------------
    const scheduleHeartbeat = (immediate: boolean = false) => {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }

      if (immediate) {
        performHeartbeatWrite(true);
      }

      heartbeatTimer = setInterval(() => {
        performHeartbeatWrite(false);
      }, HEARTBEAT_INTERVAL_MS);
    };

    // Initial Registration
    scheduleHeartbeat(true);

    // -------------------------------------------------------------
    // Realtime Listener for Global Stats (O(1) read)
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // STRATEGY 1: Visibility Gating - Pause on hidden, throttle-check on visible
    // -------------------------------------------------------------
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Pause active interval when backgrounded
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
      } else if (document.visibilityState === 'visible') {
        // Resumed: Resume timer with write throttling protection
        const elapsedSinceLastWrite = Date.now() - lastWriteTimeRef.current;
        if (elapsedSinceLastWrite >= MIN_WRITE_THROTTLE_MS) {
          scheduleHeartbeat(true);
        } else {
          // Stagger remainder so we don't burst write
          const remainingDelay = MIN_WRITE_THROTTLE_MS - elapsedSinceLastWrite;
          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              scheduleHeartbeat(true);
            }
          }, remainingDelay);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // -------------------------------------------------------------
    // Tab Cleanup
    // -------------------------------------------------------------
    const handleUnload = () => {
      if (broadcastChannel && isLeaderRef.current) {
        broadcastChannel.postMessage({
          type: 'LEADER_CLOSED',
          tabId
        });
      }
      try {
        if (isLeaderRef.current) {
          deleteDoc(sessionDocRef).catch(() => {});
        }
      } catch {
        // ignore unload aborts
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      isMounted = false;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (broadcastChannel) {
        if (isLeaderRef.current) {
          broadcastChannel.postMessage({
            type: 'LEADER_CLOSED',
            tabId
          });
        }
        broadcastChannel.close();
      }
      unsubscribeStats();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      if (isLeaderRef.current) {
        deleteDoc(sessionDocRef).catch(() => {});
      }
    };
  }, []);

  return <PresenceContext.Provider value={presence}>{children}</PresenceContext.Provider>;
};

export const useRealtimePresence = () => useContext(PresenceContext);
