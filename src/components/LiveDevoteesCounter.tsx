import React, { useState } from 'react';
import { Users, ChevronDown } from 'lucide-react';
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

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setShowInfoDropdown(!showInfoDropdown)}
        className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1C120A]/90 hover:bg-[#2A1B0E] border border-[#D4AF37]/35 text-xs text-[#FFF5E1] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-sm group whitespace-nowrap shrink-0"
        title={isHindi ? 'वर्तमान में लाइव जुड़े श्रद्धालु' : 'Exact Live Connected Devotees'}
      >
        {/* Live Pulsing Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        <span className="font-sans font-medium text-[11px] sm:text-xs text-[#FFF5E1] flex items-center gap-1">
          <strong className="text-[#D4AF37] font-bold">{presence.online.toLocaleString('en-IN')}</strong>
          <span className="hidden sm:inline">{isHindi ? 'श्रद्धालु लाइव' : 'Devotees Live'}</span>
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
                हुएं हैं।
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
};
