import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Utensils, Heart, ChevronRight, Sun, Sunrise, Sunset, Waves } from 'lucide-react';
import { SACRED_DAYS } from '../data/chhathData';
import { SacredDay } from '../types';

export const FourDaysTimeline: React.FC = () => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
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
    <div id="four-days-section" className="relative glass-card rounded-3xl p-6 md:p-8 border border-[#F28C28]/35 overflow-hidden shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#F28C28]/25">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#F28C28]/40 text-[#F28C28] text-xs font-sans font-bold tracking-widest uppercase mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>४ दिवसीय पावन महापर्व • 4 Sacred Days</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-devanagari font-bold text-[#FFF5E1]">
            छठ पर्व की पवित्र यात्रा (The 4 Sacred Days)
          </h3>
        </div>

        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md font-sans">
          कठोर संयम, सात्विकता और अटूट आस्था — जानिए नहाय-खाय से उषा अर्घ्य तक की संपूर्ण यात्रा।
        </p>
      </div>

      {/* 4 Days Selection Tabs - with Natural Tones border-l styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SACRED_DAYS.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border-l-4 cursor-pointer relative overflow-hidden font-sans ${
                isSelected
                  ? 'bg-black/50 border-l-[#F28C28] border-y border-r border-[#F28C28]/50 shadow-xl shadow-black/60 scale-[1.02]'
                  : 'bg-black/25 border-l-[#9B3D12] border-y border-r border-[#F28C28]/20 hover:border-[#F28C28]/40 hover:bg-black/40 text-[#FFF5E1]/80'
              }`}
            >
              {/* Day Number Badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#F28C28] text-[#2D1B0D]'
                      : 'bg-black/60 text-[#F28C28]'
                  }`}
                >
                  Day {day.dayNumber}
                </span>
                {getDayIcon(day.iconType)}
              </div>

              <h4 className="text-sm md:text-base font-devanagari font-bold text-[#FFF5E1]">
                {day.hindiName}
              </h4>
              <p className="text-[11px] text-[#F28C28]/90 truncate mt-0.5 font-medium">
                {day.englishName}
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
          transition={{ duration: 0.4 }}
          className="p-5 md:p-6 rounded-2xl bg-black/35 border border-[#F28C28]/30 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/50 border border-[#F28C28]/40 text-[#F28C28]">
                {activeDay.tithi}
              </span>
              <span className="text-xs text-[#FFF5E1]/70 font-medium">
                Day {activeDay.dayNumber} of Chhath Puja
              </span>
            </div>

            <div>
              <h4 className="text-xl md:text-2xl font-devanagari font-bold text-[#FFF5E1]">
                {activeDay.hindiName} — {activeDay.englishName}
              </h4>
              <p className="text-sm md:text-base text-[#FFF5E1]/85 leading-relaxed mt-2 font-normal">
                {activeDay.ritualSummary}
              </p>
            </div>

            {/* Spiritual Significance */}
            <div className="p-4 rounded-xl bg-black/30 border border-[#F28C28]/25">
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                आध्यात्मिक महत्व (Spiritual Significance)
              </span>
              <p className="text-xs md:text-sm text-[#FFF5E1]/80 leading-relaxed font-serif">
                {activeDay.significance}
              </p>
            </div>

            {/* Childhood Memory & Nostalgia */}
            <div className="flex items-start gap-3 pt-1">
              <Heart className="w-4 h-4 text-[#E34234] shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-[#F28C28] block uppercase tracking-wider">
                  यादों की सुवास (Nostalgic Memory):
                </span>
                <p className="text-xs md:text-sm text-[#FFF5E1]/75 italic mt-0.5 font-garamond text-base">
                  "{activeDay.memories}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Prasad & Offerings Checklist */}
          <div className="rounded-xl bg-black/40 p-4 border border-[#F28C28]/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-[#F28C28]/25 mb-3 font-sans">
                <Utensils className="w-4 h-4 text-[#F28C28]" />
                <h5 className="text-sm font-devanagari font-bold text-[#FFF5E1]">
                  विशिष्ट प्रसाद व भोग (Sacred Prasad)
                </h5>
              </div>

              <div className="space-y-2 font-sans">
                {activeDay.prasads.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-black/50 border border-[#F28C28]/20 text-xs text-[#FFF5E1] font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Folk Note */}
            <div className="p-3 rounded-lg bg-black/50 border border-[#F28C28]/25 text-center">
              <span className="text-xs text-[#F28C28] font-folk">
                "शुद्धता, स्वच्छता आ असीम श्रद्धा — ईहे ह छठ के मूल मंत्र"
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
