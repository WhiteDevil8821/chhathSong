import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Utensils, Heart, Sun, Sunrise, Sunset, Waves } from 'lucide-react';
import { SACRED_DAYS } from '../data/chhathData';
import { SacredDay } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useChhathDailyGreeting } from '../hooks/useChhathDailyGreeting';

export const FourDaysTimeline: React.FC = () => {
  const { isHindi } = useLanguage();
  const greeting = useChhathDailyGreeting();
  const [hasManualSelection, setHasManualSelection] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => greeting.dayNumber ?? 1);

  useEffect(() => {
    if (!hasManualSelection && greeting.dayNumber) {
      setSelectedDayNumber(greeting.dayNumber);
    }
  }, [greeting.dayNumber, hasManualSelection]);

  const activeDay: SacredDay = SACRED_DAYS.find(d => d.dayNumber === selectedDayNumber) || SACRED_DAYS[0];

  const getDayIcon = (type: string) => {
    switch (type) {
      case 'bath':
        return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'kheer':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'sunset':
        return <Sunset className="w-5 h-5 text-orange-400" />;
      case 'sunrise':
        return <Sunrise className="w-5 h-5 text-yellow-300" />;
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div id="four-days-section" className="relative rounded-3xl bg-[#1C120B]/90 p-6 md:p-8 border border-[#D4AF37]/30 overflow-hidden shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-sans font-bold tracking-widest uppercase mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isHindi ? '४ दिवसीय पावन महापर्व • 4 Sacred Days' : '4 Sacred Days of Chhath Mahaparv'}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'छठ पर्व की पवित्र यात्रा (The 4 Sacred Days)' : 'The 4 Sacred Days of Chhath Puja'}
          </h3>
        </div>

        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md font-sans">
          {isHindi
            ? 'कठोर संयम, सात्विकता और अटूट आस्था — जानिए नहाय-खाय से उषा अर्घ्य तक की संपूर्ण यात्रा।'
            : 'Rigorous penance, sacred purity, and unwavering faith — the journey from Nahay Khay to the dawn Usha Arghya.'}
        </p>
      </div>

      {/* 4 Days Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SACRED_DAYS.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          const isToday = greeting.dayNumber === day.dayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                setHasManualSelection(true);
                setSelectedDayNumber(day.dayNumber);
              }}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative overflow-hidden font-sans ${
                isSelected
                  ? 'bg-black/65 border-[#D4AF37] shadow-xl shadow-black/60 scale-[1.02]'
                  : 'bg-black/30 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-black/45 text-[#FFF5E1]/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider">
                  <span
                    className={`px-2 py-0.5 rounded uppercase ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#180F08]'
                        : 'bg-black/60 text-[#D4AF37]'
                    }`}
                  >
                    {isHindi ? `दिवस ${day.dayNumber}` : `Day ${day.dayNumber}`}
                  </span>
                  {isToday && (
                    <span className="text-[#FFD54F] font-semibold">
                      · {isHindi ? 'आज' : 'Today'}
                    </span>
                  )}
                </div>
                {getDayIcon(day.iconType)}
              </div>

              <h4 className="text-sm md:text-base font-serif font-bold text-[#FFF5E1]">
                {isHindi ? day.hindiName : day.englishName}
              </h4>
              <p className="text-[11px] text-[#D4AF37]/90 truncate mt-0.5 font-medium">
                {isHindi ? day.englishName : day.hindiName}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detailed Presentation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.dayNumber}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="p-5 md:p-6 rounded-2xl bg-black/35 border border-[#D4AF37]/25 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/50 border border-[#D4AF37]/35 text-[#D4AF37]">
                {activeDay.tithi}
              </span>
              <span className="text-xs text-[#FFF5E1]/70 font-medium">
                {isHindi ? `छठ पूजा का ${activeDay.dayNumber}वाँ दिवस` : `Day ${activeDay.dayNumber} of Chhath Puja`}
              </span>
            </div>

            <div>
              <h4 className="text-xl md:text-2xl font-serif font-bold text-[#FFF5E1]">
                {activeDay.hindiName} — {activeDay.englishName}
              </h4>
              <p className="text-sm md:text-base text-[#FFF5E1]/85 leading-relaxed mt-2 font-normal">
                {activeDay.ritualSummary}
              </p>
            </div>

            {/* Spiritual Significance */}
            <div className="p-4 rounded-xl bg-black/30 border border-[#D4AF37]/20">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                {isHindi ? 'आध्यात्मिक महत्व (Spiritual Significance)' : 'Spiritual & Cosmic Significance'}
              </span>
              <p className="text-xs md:text-sm text-[#FFF5E1]/80 leading-relaxed">
                {activeDay.significance}
              </p>
            </div>

            {/* Childhood Memory & Nostalgia */}
            <div className="flex items-start gap-3 pt-1">
              <Heart className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-[#D4AF37] block uppercase tracking-wider">
                  {isHindi ? 'यादों की सुवास (Nostalgic Memory):' : 'Homeland Memory:'}
                </span>
                <p className="text-xs md:text-sm text-[#FFF5E1]/75 italic mt-0.5">
                  "{activeDay.memories}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Prasad & Offerings Checklist */}
          <div className="rounded-xl bg-black/40 p-4 border border-[#D4AF37]/25 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-[#D4AF37]/20 mb-3 font-sans">
                <Utensils className="w-4 h-4 text-[#D4AF37]" />
                <h5 className="text-sm font-serif font-bold text-[#FFF5E1]">
                  {isHindi ? 'विशिष्ट प्रसाद व भोग (Sacred Prasad)' : 'Sacred Prasad & Offerings'}
                </h5>
              </div>

              <div className="space-y-2 font-sans">
                {activeDay.prasads.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-black/50 border border-[#D4AF37]/15 text-xs text-[#FFF5E1] font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Folk Note */}
            <div className="p-3 rounded-lg bg-black/50 border border-[#D4AF37]/20 text-center">
              <span className="text-xs text-[#D4AF37]">
                {isHindi
                  ? '"शुद्धता, स्वच्छता आ असीम श्रद्धा — ईहे ह छठ के मूल मंत्र"'
                  : '"Absolute Purity, Nature, and Unbroken Devotion — The Core of Chhath"'}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
