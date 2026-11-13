import React, { useState } from 'react';
import { Sun, Sunrise, Sunset, Sparkles, Clock, Share2, Check } from 'lucide-react';
import { useChhathDailyGreeting } from '../hooks/useChhathDailyGreeting';
import { useLanguage } from '../context/LanguageContext';

interface DailyGreetingBarProps {
  onOpenShareModal?: () => void;
}

export const DailyGreetingBar: React.FC<DailyGreetingBarProps> = ({ onOpenShareModal }) => {
  const { isHindi } = useLanguage();
  const greeting = useChhathDailyGreeting();
  const [copied, setCopied] = useState(false);

  const renderPhaseIcon = () => {
    switch (greeting.dayNumber) {
      case 1:
        return <Sun className="w-4 h-4 text-[#FFD54F] shrink-0" />;
      case 2:
        return <Sparkles className="w-4 h-4 text-[#F28C28] shrink-0" />;
      case 3:
        return <Sunset className="w-4 h-4 text-[#FF8A65] shrink-0" />;
      case 4:
        return <Sunrise className="w-4 h-4 text-[#FFE082] shrink-0" />;
      default:
        return <Sun className="w-4 h-4 text-[#FFD54F] shrink-0" />;
    }
  };

  const handleShareClick = () => {
    if (onOpenShareModal) {
      onOpenShareModal();
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(greeting.shareGreetingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      aria-label={isHindi ? 'आज की छठ शुभकामनाएँ' : "Today's Chhath Greeting"}
      className="w-full rounded-2xl bg-gradient-to-r from-[#2A1508]/95 via-[#1E0E05]/95 to-[#2A1508]/95 border border-[#D4AF37]/40 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            {renderPhaseIcon()}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold text-[#D4AF37]">
              <span>{isHindi ? greeting.dayTagHi : greeting.dayTagEn}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#FFE5B4]">
                <Clock className="w-3 h-3" />
                {greeting.istShortTimeFormatted}
              </span>
            </div>
            <p className="text-sm sm:text-base font-serif font-bold text-[#FFF5E1] leading-snug">
              {isHindi ? greeting.greetingTitleHi : greeting.greetingTitleEn}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShareClick}
          className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#FFD54F] hover:text-[#180F08] border border-[#D4AF37]/45 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{isHindi ? 'कॉपी हो गया' : 'Copied'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'शुभकामना भेजें' : 'Share Wishes'}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
