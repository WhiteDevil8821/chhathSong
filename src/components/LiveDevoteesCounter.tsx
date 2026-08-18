import React, { useState, useEffect } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PresenceData {
  online: number;
  exactLive?: number;
  peakToday: number;
  isExact?: boolean;
}

interface LiveDevoteesCounterProps {
  variant?: 'navbar' | 'hero' | 'card';
  className?: string;
}

// Generate guaranteed unique identifier per device / tab session
function getUniqueSessionId(): string {
  let id = '';
  try {
    id = sessionStorage.getItem('chhath_dev_sid') || '';
    if (!id) {
      id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem('chhath_dev_sid', id);
    }
  } catch {
    id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }
  return id;
}

export const LiveDevoteesCounter: React.FC<LiveDevoteesCounterProps> = ({
  variant = 'navbar',
  className = ''
}) => {
  const { isHindi } = useLanguage();
  const [presence, setPresence] = useState<PresenceData>({
    online: 1,
    peakToday: 1,
    isExact: true
  });
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);

  useEffect(() => {
    const cid = getUniqueSessionId();

    // 1. Immediate REST sync on mount
    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/presence?cid=${encodeURIComponent(cid)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.online === 'number') {
            setPresence(data);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchPresence();

    // 2. Real-time Server-Sent Events (SSE) stream for instant sub-second multi-device sync
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`/api/presence/stream?cid=${encodeURIComponent(cid)}`);

      eventSource.onmessage = (event) => {
        try {
          if (!event.data) return;
          const data = JSON.parse(event.data);
          if (data && typeof data.online === 'number') {
            setPresence(data);
          }
        } catch {
          // ignore non-json
        }
      };

      eventSource.onerror = () => {
        // EventSource will auto-reconnect if connection drops
      };
    } catch {
      // EventSource fallback
    }

    // 3. Fallback Heartbeat ping every 6 seconds to ensure presence is never lost
    const heartbeatInterval = setInterval(() => {
      fetch(`/api/presence/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cid })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.online === 'number') {
            setPresence((prev) => ({
              ...prev,
              online: data.online,
              peakToday: Math.max(prev.peakToday, data.online)
            }));
          }
        })
        .catch(() => {});
    }, 6000);

    // 4. Instant re-sync when tab becomes visible (e.g., waking from lockscreen on mobile)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPresence();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Instant leave tracking on page unload/tab close
    const handleUnload = () => {
      try {
        if (eventSource) {
          eventSource.close();
        }
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`/api/presence/leave?cid=${encodeURIComponent(cid)}`);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);

  if (variant === 'navbar') {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setShowInfoDropdown(!showInfoDropdown)}
          className="px-3 py-1.5 rounded-full bg-[#1C120A]/90 hover:bg-[#2A1B0E] border border-[#D4AF37]/35 text-xs text-[#FFF5E1] flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
          title={isHindi ? 'वर्तमान में लाइव जुड़े श्रद्धालु' : 'Exact Live Connected Devotees'}
        >
          {/* Live Pulsing Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="font-sans font-medium text-[11px] text-[#FFF5E1]">
            <strong className="text-[#D4AF37] font-bold">{presence.online.toLocaleString('en-IN')}</strong>{' '}
            <span className="hidden sm:inline">{isHindi ? 'श्रद्धालु ऑनलाइन' : 'Devotees Online'}</span>
            <span className="sm:hidden">{isHindi ? 'लाइव' : 'Live'}</span>
          </span>

          <ChevronDown
            className={`w-3 h-3 text-[#D4AF37]/70 transition-transform ${
              showInfoDropdown ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Info Dropdown */}
        {showInfoDropdown && (
          <div
            className="absolute top-full right-0 mt-2 w-64 bg-[#1C120A] border border-[#D4AF37]/35 rounded-2xl p-3.5 shadow-2xl z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#D4AF37]/20 text-[11px]">
              <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F28C28]" />
                {isHindi ? 'सटीक लाइव उपस्थिति' : 'Exact Live Presence'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                ● Live Realtime
              </span>
            </div>

            <p className="text-[11px] text-[#FFF5E1]/80 leading-tight">
              {isHindi ? (
                <>
                  वर्तमान में इस पावन मंच पर ठीक{' '}
                  <strong className="text-[#D4AF37]">{presence.online}</strong> श्रद्धालु सीधे जुड़े
                  हुए हैं।
                </>
              ) : (
                <>
                  Exactly <strong className="text-[#D4AF37]">{presence.online}</strong> active devotee
                  {presence.online > 1 ? 's are' : ' is'} currently connected in real-time.
                </>
              )}
            </p>

            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FFF5E1]/60">
              <span>{isHindi ? 'आज का उच्चतम:' : "Today's Peak:"}</span>
              <span className="font-mono text-[#D4AF37] font-bold">{presence.peakToday}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hero Variant
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1C120A]/90 border border-[#D4AF37]/35 shadow-lg backdrop-blur-md ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-xs font-sans text-[#FFF5E1]">
        <strong className="text-[#D4AF37] font-extrabold">{presence.online.toLocaleString('en-IN')}</strong>{' '}
        {isHindi
          ? 'श्रद्धालु पावन घाट पर लाइव उपस्थित (Live Devotees Online)'
          : 'Devotees currently connected at the Sacred Ghat (Live)'}
      </span>
    </div>
  );
};
