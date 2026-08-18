import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronDown, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRealtimePresence } from '../hooks/useRealtimePresence';

interface LiveDevoteesCounterProps {
  variant?: 'navbar' | 'hero' | 'card';
  className?: string;
}

export const LiveDevoteesCounter: React.FC<LiveDevoteesCounterProps> = ({
  variant = 'navbar',
  className = ''
}) => {
  const { isHindi } = useLanguage();
  const presence = useRealtimePresence();
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showInfoDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowInfoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInfoDropdown]);

  const count = presence.online;
  const isSingular = count === 1;

  const getDevoteeLabel = () => {
    if (isHindi) {
      return isSingular ? 'श्रद्धालु लाइव' : 'श्रद्धालु लाइव';
    }
    return isSingular ? 'Devotee Live' : 'Devotees Live';
  };

  const getMobileLabel = () => {
    if (isHindi) {
      return 'लाइव';
    }
    return isSingular ? 'Live' : 'Live';
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setShowInfoDropdown(!showInfoDropdown)}
        className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1C120A]/95 hover:bg-[#2A1B0E] border border-[#D4AF37]/40 text-xs text-[#FFF5E1] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-sm group whitespace-nowrap shrink-0 hover:border-[#D4AF37]/70"
        title={isHindi ? 'वर्तमान में लाइव जुड़े श्रद्धालु' : 'Live Connected Devotees'}
      >
        {/* Live Pulsing Green Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </span>

        <span className="font-sans font-medium text-[11px] sm:text-xs text-[#FFF5E1] flex items-center gap-1">
          <strong className="text-[#D4AF37] font-bold tracking-tight">
            {count.toLocaleString('en-IN')}
          </strong>
          <span className="hidden sm:inline text-[#FFF5E1]/90">{getDevoteeLabel()}</span>
          <span className="sm:hidden text-[#FFF5E1]/90">{getMobileLabel()}</span>
        </span>

        <ChevronDown
          className={`w-3 h-3 text-[#D4AF37]/80 transition-transform duration-200 ${
            showInfoDropdown ? 'rotate-180 text-[#D4AF37]' : ''
          }`}
        />
      </button>

      {/* Info Dropdown Popover */}
      {showInfoDropdown && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-[#1C120A] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 text-xs space-y-2.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <span className="font-bold text-[#D4AF37] flex items-center gap-1.5 text-xs">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              {isHindi ? 'सटीक लाइव उपस्थिति' : 'Real-time Live Presence'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Active
            </span>
          </div>

          <p className="text-[11px] text-[#FFF5E1]/90 leading-relaxed font-sans">
            {isHindi ? (
              <>
                वर्तमान में इस पावन मंच पर ठीक{' '}
                <strong className="text-[#D4AF37] font-bold">{count}</strong> श्रद्धालु सीधे जुड़े
                हुए हैं।
              </>
            ) : (
              <>
                Exactly <strong className="text-[#D4AF37] font-bold">{count}</strong> active devotee
                {isSingular ? ' is' : 's are'} currently connected at the Ghat in real-time.
              </>
            )}
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FFF5E1]/70 font-sans">
            <span>{isHindi ? 'आज का उच्चतम (Peak Today):' : "Today's Peak Devotees:"}</span>
            <span className="font-mono text-[#D4AF37] font-bold text-xs">
              {Math.max(presence.peakToday, count)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
