import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface PresenceState {
  online: number;
  peakToday: number;
  isExact: boolean;
}

// Generate guaranteed unique session ID per device
function getUniqueSessionId(): string {
  const STORAGE_KEY = 'chhath_dev_session_id';
  let id = '';
  try {
    id = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
    if (!id) {
      id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // Storage restricted
      }
    }
  } catch {
    id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
  }
  return id;
}

export function useRealtimePresence() {
  const [presence, setPresence] = useState<PresenceState>({
    online: 1,
    peakToday: 1,
    isExact: true
  });

  useEffect(() => {
    const sessionId = getUniqueSessionId();
    const sessionDocRef = doc(db, 'presence', sessionId);
    let heartbeatTimer: NodeJS.Timeout | null = null;

    // 1. Register active session in Firestore
    const registerSession = async () => {
      try {
        await setDoc(
          sessionDocRef,
          {
            sessionId,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp()
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `presence/${sessionId}`);
      }
    };

    registerSession();

    // 2. Heartbeat every 10 seconds to keep session alive
    heartbeatTimer = setInterval(async () => {
      try {
        await setDoc(
          sessionDocRef,
          {
            sessionId,
            lastSeen: serverTimestamp()
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `presence/${sessionId}`);
      }
    }, 10000);

    // 3. Real-time global listener across all devices worldwide
    const presenceCollection = collection(db, 'presence');
    const unsubscribe = onSnapshot(
      presenceCollection,
      (snapshot) => {
        const now = Date.now();
        let activeCount = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.lastSeen) {
            let lastSeenMs = now;
            if (data.lastSeen instanceof Timestamp) {
              lastSeenMs = data.lastSeen.toMillis();
            } else if (typeof data.lastSeen === 'number') {
              lastSeenMs = data.lastSeen;
            } else if (typeof data.lastSeen.toMillis === 'function') {
              lastSeenMs = data.lastSeen.toMillis();
            }

            // Consider active if updated within the last 30 seconds
            if (now - lastSeenMs < 30000) {
              activeCount++;
            }
          } else {
            // Count recently created docs
            activeCount++;
          }
        });

        const finalCount = Math.max(1, activeCount);
        setPresence((prev) => ({
          online: finalCount,
          peakToday: Math.max(prev.peakToday, finalCount),
          isExact: true
        }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'presence');
      }
    );

    // 4. Tab visibility change re-touch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        registerSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Cleanup on tab close / unmount
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
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      deleteDoc(sessionDocRef).catch(() => {});
    };
  }, []);

  return presence;
}
