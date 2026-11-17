import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Sun, Sunrise, Sunset, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SACRED_DAYS } from '../data/chhathData';
import { ChhathCountdownStatus, SacredDay } from '../types';
import { FESTIVAL_BOUNDARIES_IST_MS, formatISTClock } from '../utils/chhathDaySchedule';

const FESTIVAL_DATES_IST = {
  nahayKhayStart: new Date(FESTIVAL_BOUNDARIES_IST_MS.nahayKhayStart),
  kharnaStart: new Date(FESTIVAL_BOUNDARIES_IST_MS.kharnaStart),
  sandhyaStart: new Date(FESTIVAL_BOUNDARIES_IST_MS.sandhyaStart),
  ushaStart: new Date(FESTIVAL_BOUNDARIES_IST_MS.ushaStart),
  festivalEnd: new Date(FESTIVAL_BOUNDARIES_IST_MS.festivalEnd)
};

export const ChhathCountdown2026: React.FC<{ onSelectDay?: (dayNumber: number) => void }> = ({ onSelectDay }) => {
  const { isHindi } = useLanguage();
  const [countdown, setCountdown] = useState<ChhathCountdownStatus>({
    status: 'before',
    currentDayNameHindi: 'नहाय-खाय',
    currentDayNameEnglish: 'Nahay Khay',
    currentDayNumber: 1,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formattedTimeIST: '',
    nextEventTitle: 'चैती छठ पूजा २०२७ (Chaiti Chhath 2027)',
    nextEventDate: '10-13 April 2027'
  });

  const [activeTabDay, setActiveTabDay] = useState<number>(1);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeStrIST = formatISTClock(now.getTime(), true);

      const target = FESTIVAL_DATES_IST.nahayKhayStart;
      const diffMs = target.getTime() - now.getTime();

      if (now < FESTIVAL_DATES_IST.nahayKhayStart) {
        // Before festival
        const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setCountdown({
          status: 'before',
          currentDayNameHindi: 'नहाय-खाय (प्रारंभ)',
          currentDayNameEnglish: 'Nahay Khay (Beginning)',
          currentDayNumber: 1,
          days,
          hours,
          minutes,
          seconds,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'चैती छठ पूजा २०२७ (Nahay-Khay)',
          nextEventDate: '10 April 2027'
        });
      } else if (now >= FESTIVAL_DATES_IST.nahayKhayStart && now < FESTIVAL_DATES_IST.kharnaStart) {
        // Day 1: Nahay Khay
        const diffToEnd = FESTIVAL_DATES_IST.kharnaStart.getTime() - now.getTime();
        const totalSeconds = Math.floor(diffToEnd / 1000);
        setCountdown({
          status: 'nahay_khay',
          currentDayNameHindi: 'आज प्रथम दिवस: नहाय-खाय',
          currentDayNameEnglish: 'Today: Day 1 - Nahay-Khay',
          currentDayNumber: 1,
          days: 0,
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'कल: लोहंडा और खरना (Lohanda & Kharna)',
          nextEventDate: '11 April 2027'
        });
        setActiveTabDay(1);
      } else if (now >= FESTIVAL_DATES_IST.kharnaStart && now < FESTIVAL_DATES_IST.sandhyaStart) {
        // Day 2: Kharna
        const diffToEnd = FESTIVAL_DATES_IST.sandhyaStart.getTime() - now.getTime();
        const totalSeconds = Math.floor(diffToEnd / 1000);
        setCountdown({
          status: 'kharna',
          currentDayNameHindi: 'आज द्वितीय दिवस: लोहंडा और खरना',
          currentDayNameEnglish: 'Today: Day 2 - Lohanda & Kharna',
          currentDayNumber: 2,
          days: 0,
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'कल: पहला अर्घ्य - संध्या अर्घ्य',
          nextEventDate: '12 April 2027'
        });
        setActiveTabDay(2);
      } else if (now >= FESTIVAL_DATES_IST.sandhyaStart && now < FESTIVAL_DATES_IST.ushaStart) {
        // Day 3: Sandhya Arghya
        const diffToEnd = FESTIVAL_DATES_IST.ushaStart.getTime() - now.getTime();
        const totalSeconds = Math.floor(diffToEnd / 1000);
        setCountdown({
          status: 'sandhya_arghya',
          currentDayNameHindi: 'आज तृतीय दिवस: संध्या अर्घ्य (पहला अर्घ्य)',
          currentDayNameEnglish: 'Today: Day 3 - Sandhya Arghya (Dusk Offering)',
          currentDayNumber: 3,
          days: 0,
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'कल भोर: उषा अर्घ्य और पारण',
          nextEventDate: '13 April 2027'
        });
        setActiveTabDay(3);
      } else if (now >= FESTIVAL_DATES_IST.ushaStart && now < FESTIVAL_DATES_IST.festivalEnd) {
        // Day 4: Usha Arghya & Paran
        const diffToEnd = FESTIVAL_DATES_IST.festivalEnd.getTime() - now.getTime();
        const totalSeconds = Math.floor(diffToEnd / 1000);
        setCountdown({
          status: 'usha_arghya',
          currentDayNameHindi: 'आज चतुर्थ दिवस: उषा अर्घ्य और पारण (महापर्व संपन्न)',
          currentDayNameEnglish: 'Today: Day 4 - Usha Arghya & Paran (Dawn Offering)',
          currentDayNumber: 4,
          days: 0,
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'पारण एवं प्रसाद वितरण',
          nextEventDate: '13 April 2027'
        });
        setActiveTabDay(4);
      } else {
        // Concluded
        setCountdown({
          status: 'concluded',
          currentDayNameHindi: 'चैती छठ पूजा 2027 संपन्न • जय छठी मईया',
          currentDayNameEnglish: 'Chaiti Chhath Puja 2027 Concluded • Jai Chhathi Maiya',
          currentDayNumber: 4,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formattedTimeIST: timeStrIST,
          nextEventTitle: 'आगामी कार्तिक छठ पर्व 2027 (Kartik Chhath 2027)',
          nextEventDate: '03 - 06 November 2027'
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDayIcon = (dayNumber: number) => {
    switch (dayNumber) {
      case 1:
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Sparkles className="w-5 h-5 text-orange-400" />;
      case 3:
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 4:
        return <Sunrise className="w-5 h-5 text-yellow-300" />;
      default:
        return <Calendar className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const selectedDayInfo: SacredDay = SACRED_DAYS.find(d => d.dayNumber === activeTabDay) || SACRED_DAYS[0];

  return (
    <section id="chhath-2026-countdown" className="w-full relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#1C120B] via-[#140D07] to-[#0D0805] border border-[#D4AF37]/35 p-3.5 sm:p-5 md:p-7 shadow-2xl overflow-hidden font-sans">
      {/* Decorative Ambient Background Glows */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FF8C00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Live Badge & IST Clock */}
      <div className="flex items-center justify-between gap-2 pb-3 md:pb-4 border-b border-[#D4AF37]/20 relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
            <span>{isHindi ? 'चैती छठ २०२७' : 'Chaiti Chhath 2027'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-[#FFF5E1]/80 truncate hidden sm:inline">
            {isHindi ? '१० से १३ अप्रैल २०२७' : '10 to 13 April 2027'}
          </span>
        </div>

        {/* Live IST Clock Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-[#FFF5E1] text-[10px] sm:text-xs shrink-0">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
          <span className="font-mono font-semibold text-white">
            {countdown.formattedTimeIST || 'IST'}
          </span>
        </div>
      </div>

      {/* Main Countdown Display: 4 Columns on all screen sizes to fit 1st view */}
      <div className="py-3 sm:py-4 md:py-5 grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 relative z-10">
        {[
          { label: isHindi ? 'दिन' : 'Days', subLabel: 'Days', value: countdown.days },
          { label: isHindi ? 'घंटे' : 'Hours', subLabel: 'Hours', value: countdown.hours },
          { label: isHindi ? 'मिनट' : 'Mins', subLabel: 'Mins', value: countdown.minutes },
          { label: isHindi ? 'सेकंड' : 'Secs', subLabel: 'Secs', value: countdown.seconds }
        ].map((unit, idx) => (
          <div
            key={idx}
            className="p-2 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-black/60 border border-[#D4AF37]/30 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group hover:border-[#D4AF37]/60 transition-colors"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="text-xl sm:text-3xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5E1] via-[#FFE5B4] to-[#D4AF37] tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] md:text-xs font-sans uppercase font-bold text-[#D4AF37]/90 tracking-wider mt-1 sm:mt-1.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Festival Status & Quick Schedule Indicator */}
      <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/40 border border-[#D4AF37]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans relative z-10 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="text-[#FFF5E1]/90 truncate">
            <strong className="text-[#D4AF37]">
              {isHindi ? countdown.currentDayNameHindi : countdown.currentDayNameEnglish}
            </strong>
            <span className="hidden md:inline">{' • '}{countdown.nextEventTitle}</span>
          </span>
        </div>
        <span className="text-[#D4AF37] bg-black/60 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 text-[11px] font-semibold whitespace-nowrap self-end sm:self-center">
          {countdown.nextEventDate}
        </span>
      </div>

      {/* 4 Days Interactive Schedule Pills & Quick Tabs */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm md:text-base font-serif font-bold text-[#FFF5E1] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isHindi ? 'चार दिवसीय महापर्व पंचांग' : '4 Sacred Festival Days'}</span>
          </h3>
          <span className="text-[10px] sm:text-xs text-[#D4AF37]/80">
            {isHindi ? 'क्लिक कर विवरण देखें' : 'Click to view details'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {SACRED_DAYS.map((day) => {
            const isSelected = day.dayNumber === activeTabDay;
            const isToday = countdown.currentDayNumber === day.dayNumber && countdown.status !== 'before' && countdown.status !== 'concluded';

            return (
              <button
                key={day.dayNumber}
                type="button"
                id={`countdown-day-${day.dayNumber}`}
                onClick={() => {
                  setActiveTabDay(day.dayNumber);
                  if (onSelectDay) onSelectDay(day.dayNumber);
                }}
                className={`p-2 sm:p-2.5 md:p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-black/75 border-[#D4AF37] shadow-md'
                    : 'bg-black/35 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-black/50 text-[#FFF5E1]/80'
                }`}
              >
                {isToday && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-[8px] font-bold uppercase animate-pulse">
                    Live
                  </span>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isSelected ? 'bg-[#D4AF37] text-[#140D07]' : 'bg-black/50 text-[#D4AF37]'
                  }`}>
                    {isHindi ? `दिन ${day.dayNumber}` : `Day ${day.dayNumber}`}
                  </span>
                  {getDayIcon(day.dayNumber)}
                </div>

                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#FFF5E1] truncate">
                  {isHindi ? day.hindiName : day.englishName}
                </h4>

                <p className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#D4AF37] truncate mt-0.5">
                  {isHindi ? day.date2026 : day.gregorianDate2026}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Day Quick Expand Card */}
        <motion.div
          key={selectedDayInfo.dayNumber}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/50 border border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans"
        >
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#D4AF37] text-xs sm:text-sm font-serif">
                {isHindi ? selectedDayInfo.hindiName : selectedDayInfo.englishName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/30 text-[#FFF5E1]/90 text-[10px]">
                {isHindi ? selectedDayInfo.date2026 : selectedDayInfo.gregorianDate2026}
              </span>
            </div>
            <p className="text-[#FFF5E1]/85 text-[11px] sm:text-xs leading-relaxed">
              {selectedDayInfo.ritualSummary}
            </p>
            {selectedDayInfo.arghyaTimeHint && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black/40 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] sm:text-[11px] font-medium">
                <Clock className="w-3 h-3" />
                <span>{selectedDayInfo.arghyaTimeHint}</span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-black/40 border border-[#D4AF37]/20 space-y-1">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
              {isHindi ? 'प्रसाद एवं भोग' : 'Prasad & Offerings'}
            </span>
            <ul className="space-y-0.5">
              {selectedDayInfo.prasads.map((p, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#FFF5E1]/80">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
