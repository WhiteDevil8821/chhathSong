import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Flame, Heart, Droplets, Moon } from 'lucide-react';
import { GhatAtmosphere, FloatingDiya } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';
import { useLanguage } from '../context/LanguageContext';

interface GhatVisualProps {
  atmosphere: GhatAtmosphere;
  onAtmosphereChange: (atm: GhatAtmosphere) => void;
  onOfferArghya: () => void;
  arghyaCount: number;
}

interface FloatingPetal {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  speed: number;
}

export const GhatVisual: React.FC<GhatVisualProps> = ({
  atmosphere,
  onAtmosphereChange,
  onOfferArghya,
  arghyaCount
}) => {
  const { isHindi } = useLanguage();

  const [diyas, setDiyas] = useState<FloatingDiya[]>([
    { id: 1, x: 15, y: 72, speed: 0.8, lit: true, size: 36, wish: isHindi ? 'सुख, शांति और आरोग्य' : 'Peace, Health & Joy' },
    { id: 2, x: 34, y: 80, speed: 1.1, lit: true, size: 40, wish: isHindi ? 'परिवार की कुशलता' : 'Family Well-being' },
    { id: 3, x: 58, y: 74, speed: 0.9, lit: true, size: 38, wish: isHindi ? 'छठी मईया का आशीर्वाद' : "Mother Chhathi's Blessings" },
    { id: 4, x: 80, y: 82, speed: 1.2, lit: true, size: 36, wish: isHindi ? 'मनोकामना पूर्ति' : 'Fulfilled Prayers' }
  ]);

  // Floating marigold petals and sacred blossoms on the river
  const [petals] = useState<FloatingPetal[]>([
    { id: 101, x: 8, y: 68, color: '#F59E0B', size: 10, rotation: 25, speed: 3.5 },
    { id: 102, x: 25, y: 78, color: '#DC2626', size: 8, rotation: 65, speed: 4.2 },
    { id: 103, x: 45, y: 70, color: '#FBBF24', size: 11, rotation: -40, speed: 3.8 },
    { id: 104, x: 70, y: 76, color: '#EA580C', size: 9, rotation: 15, speed: 4.6 },
    { id: 105, x: 88, y: 69, color: '#F59E0B', size: 10, rotation: 80, speed: 3.9 }
  ]);

  const [activeWish, setActiveWish] = useState<string | null>(null);
  const [isPouringStream, setIsPouringStream] = useState<boolean>(false);
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);

  const handleAddDiya = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Trigger visual ripple on water area
    if (clickY > 55) {
      setClickRipple({ x: clickX, y: clickY });
      setTimeout(() => setClickRipple(null), 1200);

      soundSynth.playDiyaLight();
      const wishes = isHindi
        ? [
            'छठी मईया सबका कल्याण करें',
            'घर-आँगन में खुशहाली रहे',
            'सूर्य देव की कृपा सब पर बरसे',
            'आरोग्य और दीर्घायु की कामना'
          ]
        : [
            'May Mother Chhathi bless all',
            'Peace and prosperity at home',
            'Divine grace of Sun God',
            'Health, wellness and longevity'
          ];
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      const newDiya: FloatingDiya = {
        id: Date.now(),
        x: Math.max(8, Math.min(92, clickX)),
        y: Math.max(65, Math.min(88, clickY)),
        speed: 0.7 + Math.random() * 0.5,
        lit: true,
        size: 34 + Math.floor(Math.random() * 8),
        wish: randomWish
      };
      setDiyas((prev) => [...prev.slice(-14), newDiya]);
      setActiveWish(randomWish);
      setTimeout(() => setActiveWish(null), 3500);
    }
  };

  const handleArghyaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPouringStream(true);
    onOfferArghya();
    setTimeout(() => setIsPouringStream(false), 2400);
  };

  const isDawn = atmosphere === 'dawn';

  return (
    <div
      id="ghat-interactive-canvas"
      className="relative w-full h-[620px] md:h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 transition-all duration-1000 select-none font-sans"
      onClick={handleAddDiya}
      style={{
        background: isDawn
          ? 'radial-gradient(ellipse at 50% 26%, #9E3E10 0%, #541E08 30%, #2A1207 65%, #130703 100%)'
          : 'radial-gradient(ellipse at 50% 26%, #8E2E10 0%, #4A1238 35%, #240A28 70%, #0C0312 100%)'
      }}
    >
      {/* 1. Atmospheric Sky Glow & Cosmic Rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft morning fog & sacred mist layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#D4AF37]/10 to-transparent opacity-60 animate-pulse" />

        {/* Ambient Radial Sunburst */}
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[480px] md:h-[480px] pointer-events-none">
          <div
            className={`w-full h-full rounded-full transition-all duration-1000 ${
              isDawn
                ? 'bg-gradient-to-r from-[#FFD700]/30 via-[#F28C28]/25 to-[#9E3E10]/30 blur-3xl'
                : 'bg-gradient-to-r from-[#F28C28]/30 via-[#E34234]/25 to-purple-600/30 blur-3xl'
            }`}
          />
          {/* Subtle Rotating Sun Rays */}
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_80s_linear_infinite] opacity-35">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-full bg-gradient-to-t from-transparent via-[#FFD700]/40 to-transparent"
                style={{ transform: `rotate(${i * 22.5}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* 2. Majestic Surya Dev Mandala (The Radiant Sun) */}
        <motion.div
          animate={{
            y: isDawn ? [0, -5, 0] : [0, 4, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group pointer-events-auto z-10"
          onClick={handleArghyaClick}
          title={isHindi ? 'क्लिक करके सूर्य देव को अर्घ्य दें' : 'Click to offer sacred Arghya to Surya Dev'}
        >
          {/* Radiant Sun Disc with Authentic Aura */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            {/* Outer Corona Pulse */}
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/25 blur-xl animate-pulse" />

            {/* Sun SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(255,215,0,0.65)]"
            >
              <defs>
                <radialGradient id="suryaMandalaGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="25%" stopColor="#FFD700" />
                  <stop offset="65%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </radialGradient>
              </defs>
              {/* Outer Ray Flares */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.75"
              />
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.9"
              />
              {/* Main Solar Body */}
              <circle cx="50" cy="50" r="36" fill="url(#suryaMandalaGrad)" />
            </svg>

            {/* Auspicious Devotional Tag */}
            <div className="absolute -bottom-3 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white px-3 py-0.5 text-[9px] md:text-[10px] uppercase font-sans font-bold tracking-wider rounded-full shadow-md border border-[#FEF08A]/40 whitespace-nowrap">
              {isHindi ? 'जय छठी मईया' : 'Jai Chhathi Maiya'}
            </div>
          </div>

          {/* Devotional Mantra Floating Inscription */}
          <span className="mt-4 text-[11px] md:text-xs text-[#FFF5E1] font-serif font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {isHindi ? 'ॐ सूर्याय नमः • ॐ घृणिः सूर्य आदित्याय' : 'Om Suryaya Namaha • The Cosmic Light'}
          </span>
        </motion.div>
      </div>

      {/* 3. Top Atmosphere & Location Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-[#D4AF37]/35 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <span className="text-[11px] md:text-xs font-semibold text-[#FFF5E1] tracking-wide">
            {isDawn
              ? isHindi
                ? 'पावन भोर • उषा अर्घ्य घाट'
                : 'Misty Dawn • Usha Arghya Ghat'
              : isHindi
              ? 'स्वर्णिम संध्या • सांध्य अर्घ्य घाट'
              : 'Golden Twilight • Sandhya Arghya Ghat'}
          </span>
        </div>

        {/* Atmosphere Toggle Switch */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-[#D4AF37]/35 shadow-lg">
          <button
            id="toggle-dawn-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAtmosphereChange('dawn');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isDawn
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F28C28] text-[#180F08] shadow-md font-bold'
                : 'text-[#FFF5E1]/70 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{isHindi ? 'उषा (Dawn)' : 'Dawn'}</span>
          </button>
          <button
            id="toggle-dusk-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAtmosphereChange('dusk');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              !isDawn
                ? 'bg-gradient-to-r from-[#C87D32] to-[#8E2E10] text-white shadow-md font-bold'
                : 'text-[#FFF5E1]/70 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{isHindi ? 'संध्या (Dusk)' : 'Dusk'}</span>
          </button>
        </div>
      </div>

      {/* 4. Central Sacred Chhath Altar: Sugarcane Canopy & Daura-Soop Prasad Offering */}
      <div className="absolute top-[35%] md:top-[33%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex flex-col items-center"
        >
          {/* Authentic Sugarcane Canopy Mandap (ईख का मंडप) */}
          <div className="relative w-80 md:w-96 h-64 md:h-72 flex items-center justify-center">
            {/* SVG of Sugarcane Mandap & Marigold Garlands */}
            <svg
              viewBox="0 0 300 240"
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="caneStalkGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="40%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#14532D" />
                </linearGradient>
                <linearGradient id="caneStalkGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="40%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
                <radialGradient id="altarDiyaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sugarcane Stalks */}
              <path d="M150 18 Q100 80 40 230" stroke="url(#caneStalkGrad1)" strokeWidth="6" strokeLinecap="round" />
              <path d="M150 18 Q120 90 75 235" stroke="url(#caneStalkGrad2)" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M150 18 Q180 90 225 235" stroke="url(#caneStalkGrad2)" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M150 18 Q200 80 260 230" stroke="url(#caneStalkGrad1)" strokeWidth="6" strokeLinecap="round" />

              {/* Sugarcane Nodes */}
              <line x1="58" y1="180" x2="68" y2="183" stroke="#FEF08A" strokeWidth="2.5" />
              <line x1="90" y1="180" x2="99" y2="183" stroke="#FEF08A" strokeWidth="2.5" />
              <line x1="201" y1="180" x2="210" y2="183" stroke="#FEF08A" strokeWidth="2.5" />
              <line x1="232" y1="180" x2="242" y2="183" stroke="#FEF08A" strokeWidth="2.5" />

              {/* Crown Leaves */}
              <path d="M150 18 Q110 -5 70 8" stroke="#22C55E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M150 18 Q190 -5 230 8" stroke="#22C55E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M150 18 Q140 -12 130 -15" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M150 18 Q160 -12 170 -15" stroke="#4ADE80" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Sacred Kalawa knot */}
              <ellipse cx="150" cy="20" rx="14" ry="7" fill="#DC2626" stroke="#FEF08A" strokeWidth="2" />
              <circle cx="150" cy="20" r="3" fill="#FEF08A" />

              {/* Marigold Garland Arch */}
              <path
                d="M75 140 Q150 90 225 140"
                stroke="#F59E0B"
                strokeWidth="7"
                strokeDasharray="4 8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M75 140 Q150 90 225 140"
                stroke="#DC2626"
                strokeWidth="4"
                strokeDasharray="2 10"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Sacred Daura Basket with Brass Soop */}
            <div className="absolute bottom-2 flex flex-col items-center pointer-events-auto">
              <svg
                viewBox="0 0 200 130"
                className="w-56 md:w-64 h-36 md:h-40 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dauraWeaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="50%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                  <linearGradient id="brassSoopGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="25%" stopColor="#FDE047" />
                    <stop offset="65%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <radialGradient id="thekuaCrisp" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="60%" stopColor="#B45309" />
                    <stop offset="100%" stopColor="#451A03" />
                  </radialGradient>
                </defs>

                {/* Bamboo Daura Base Bowl */}
                <ellipse cx="100" cy="98" rx="84" ry="24" fill="url(#dauraWeaveGrad)" stroke="#B45309" strokeWidth="3" />
                <path d="M20 98 Q100 125 180 98" stroke="#78350F" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M28 88 Q100 114 172 88" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

                {/* Auspicious Red Chunri Border */}
                <path d="M30 92 Q100 116 170 92 Q100 76 30 92 Z" fill="#DC2626" opacity="0.85" />
                <path d="M34 94 Q100 118 166 94" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

                {/* Brass Soop */}
                <path
                  d="M45 45 L155 45 L145 92 C140 98 120 102 100 102 C80 102 60 98 55 92 Z"
                  fill="url(#brassSoopGlowGrad)"
                  stroke="#78350F"
                  strokeWidth="2"
                />
                <path d="M43 45 L157 45" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" />
                <path d="M45 45 L55 92 C60 98 80 102 100 102 C120 102 140 98 145 92 L155 45" stroke="#FDE047" strokeWidth="1.5" fill="none" />

                {/* Vermilion Aipan */}
                <path d="M52 68 Q100 80 148 68" stroke="#DC2626" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <circle cx="100" cy="74" r="4.5" fill="#DC2626" />
                <circle cx="82" cy="72" r="3" fill="#DC2626" />
                <circle cx="118" cy="72" r="3" fill="#DC2626" />
                <circle cx="100" cy="74" r="1.5" fill="#FEF08A" />

                {/* Offerings: Coconut, Bananas, Thekua, Pomelo, Diya */}
                <circle cx="76" cy="54" r="13" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
                <path d="M76 41 Q82 48 76 54" stroke="#4ADE80" strokeWidth="1.5" fill="none" />
                <path d="M76 41 C72 32 66 35 70 41 Z" fill="#22C55E" />

                <path d="M112 44 C120 45 130 52 126 62 C120 60 114 52 112 44 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
                <path d="M118 41 C128 43 136 50 133 59 C126 57 120 49 118 41 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.2" />

                <ellipse cx="98" cy="62" rx="12" ry="8" fill="url(#thekuaCrisp)" stroke="#F59E0B" strokeWidth="1.2" />
                <path d="M88 62 L108 62" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M94 58 Q98 62 102 58 M94 66 Q98 62 102 66" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" fill="none" />

                <circle cx="132" cy="72" r="9" fill="#EAB308" stroke="#A16207" strokeWidth="1.2" />
                <circle cx="130" cy="70" r="2" fill="#FEF08A" opacity="0.8" />

                <ellipse cx="100" cy="86" rx="10" ry="4.5" fill="#78350F" stroke="#EA580C" strokeWidth="1" />
                <circle cx="100" cy="78" r="14" fill="url(#altarDiyaGlow)" />
                <path d="M100 84 C95 80 95 72 100 66 C105 72 105 80 100 84 Z" fill="#FDE047" stroke="#EA580C" strokeWidth="1" />
                <circle cx="100" cy="76" r="2.5" fill="#FFFBEB" />
              </svg>
            </div>
          </div>

          {/* Elegant Pill Label */}
          <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/35 flex items-center gap-2 shadow-xl -mt-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '9s' }} />
            <span className="text-xs font-bold text-[#FFF5E1] tracking-wider">
              {isHindi ? 'पवित्र दउरा, सूप व पावन प्रसाद' : 'Sacred Bamboo Daura, Brass Soop & Prasad'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 5. REDESIGNED SACRED RIVER GANGA WATERS & GHAT STEPS (पवित्र गंगा तट) */}
      <div className="absolute bottom-0 inset-x-0 h-64 md:h-72 pointer-events-auto overflow-hidden">
        {/* River Water Rich Multi-Gradient Horizon Transition */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isDawn
              ? 'bg-gradient-to-b from-[#3B1706]/40 via-[#1C0B04]/90 to-[#0A0301]'
              : 'bg-gradient-to-b from-[#330F2C]/40 via-[#170517]/90 to-[#070108]'
          }`}
        />

        {/* Ambient Sunlight / Firelight Golden Horizon Sheen */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none opacity-80" />

        {/* Animated Water Surface Ripple Waves SVG */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 300">
            <defs>
              <linearGradient id="waveGlowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGlowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#F97316" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Background Wave Ripple Layer 1 */}
            <path
              d="M0,60 C300,90 600,30 900,75 C1050,95 1150,50 1200,65 L1200,300 L0,300 Z"
              fill="url(#waveGlowGrad1)"
              className="animate-pulse"
              style={{ animationDuration: '6s' }}
            />
            {/* Mid-ground Wave Ripple Layer 2 */}
            <path
              d="M0,120 C250,95 550,140 850,110 C1020,95 1120,130 1200,115 L1200,300 L0,300 Z"
              fill="url(#waveGlowGrad2)"
              className="animate-pulse"
              style={{ animationDuration: '8s' }}
            />
          </svg>
        </div>

        {/* Floating Sacred Marigold Blossom Petals on Current */}
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            animate={{
              x: [0, 14, 0],
              y: [0, -6, 0],
              rotate: [petal.rotation, petal.rotation + 20, petal.rotation]
            }}
            transition={{
              duration: petal.speed,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute pointer-events-none z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{
              left: `${petal.x}%`,
              top: `${petal.y - 40}%`
            }}
          >
            {/* Hand-crafted Marigold Flower Petal SVG */}
            <svg width={petal.size * 2} height={petal.size * 2} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#B45309" />
              <ellipse cx="12" cy="6" rx="3.5" ry="5" fill={petal.color} opacity="0.9" />
              <ellipse cx="12" cy="18" rx="3.5" ry="5" fill={petal.color} opacity="0.9" />
              <ellipse cx="6" cy="12" rx="5" ry="3.5" fill={petal.color} opacity="0.9" />
              <ellipse cx="18" cy="12" rx="5" ry="3.5" fill={petal.color} opacity="0.9" />
              <ellipse cx="8" cy="8" rx="3" ry="4" fill="#FDE047" opacity="0.8" transform="rotate(45 8 8)" />
              <ellipse cx="16" cy="16" rx="3" ry="4" fill="#FDE047" opacity="0.8" transform="rotate(45 16 16)" />
            </svg>
          </motion.div>
        ))}

        {/* User Click Water Splash Ring */}
        {clickRipple && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute pointer-events-none z-20 w-24 h-8 rounded-full border border-[#FFD700] bg-[#FFD700]/15 blur-xs"
            style={{
              left: `${clickRipple.x}%`,
              top: `${clickRipple.y - 42}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* Interactive Floating Terracotta Clay Diyas (प्रामाणिक मिट्टी के दीप) */}
        {diyas.map((diya) => (
          <motion.div
            key={diya.id}
            initial={{ opacity: 0, scale: 0.4, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [0, diya.id % 2 === 0 ? 12 : -12, 0],
              y: [0, diya.id % 2 === 0 ? -5 : 5, 0]
            }}
            transition={{
              duration: 4.8 + diya.speed,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute cursor-pointer group z-20 select-none"
            style={{
              left: `${diya.x}%`,
              top: `${diya.y - 42}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
              soundSynth.playDiyaLight();
              setActiveWish(diya.wish || (isHindi ? 'छठी मईया की जय' : 'Glory to Chhathi Maiya'));
              setTimeout(() => setActiveWish(null), 3200);
            }}
          >
            {/* Elegant Prayer Tooltip on Hover */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap px-3 py-1 rounded-full bg-black/90 text-[11px] font-semibold text-[#FFF5E1] border border-[#D4AF37] z-40 shadow-xl flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>{diya.wish}</span>
            </div>

            {/* Sculpted Terracotta Clay Diya with Lifelike Multi-layer Flame */}
            <div className="relative flex flex-col items-center">
              {/* 1. Ambient Warm Flame Glow Halo */}
              <div
                className="absolute -top-4 rounded-full bg-gradient-to-t from-[#F59E0B]/50 via-[#DC2626]/30 to-transparent blur-md animate-pulse pointer-events-none"
                style={{ width: `${diya.size * 1.5}px`, height: `${diya.size * 1.5}px` }}
              />

              {/* 2. Realistic SVG Clay Lamp & Flame */}
              <svg
                width={diya.size * 1.3}
                height={diya.size * 1.1}
                viewBox="0 0 60 50"
                fill="none"
                className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              >
                <defs>
                  {/* Clay Pot Gradients */}
                  <linearGradient id={`clayBaseGrad-${diya.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="45%" stopColor="#9A3412" />
                    <stop offset="100%" stopColor="#431407" />
                  </linearGradient>
                  {/* Flame Gradient */}
                  <linearGradient id={`diyaFlameGrad-${diya.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="25%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>

                {/* Floating Lotus Leaf Base Pad */}
                <ellipse cx="30" cy="42" rx="26" ry="6.5" fill="#14532D" opacity="0.85" />
                <ellipse cx="30" cy="41" rx="24" ry="5" fill="#166534" />
                <path d="M10 41 Q30 44 50 41" stroke="#4ADE80" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                {/* Terracotta Clay Diya Bowl */}
                <path
                  d="M12 28 C12 40 48 40 48 28 C48 26 12 26 12 28 Z"
                  fill={`url(#clayBaseGrad-${diya.id})`}
                  stroke="#7C2D12"
                  strokeWidth="1.5"
                />
                {/* Diya Clay Rim Lip */}
                <ellipse cx="30" cy="27" rx="18" ry="4" fill="#C2410C" stroke="#FEF08A" strokeWidth="0.8" opacity="0.9" />
                <ellipse cx="30" cy="27" rx="14" ry="2.5" fill="#451A03" />

                {/* Sacred Red Tilak on Diya Body */}
                <circle cx="30" cy="33" r="2" fill="#DC2626" />
                <circle cx="30" cy="33" r="0.8" fill="#FEF08A" />

                {/* Lifelike Flickering Flame Teardrop */}
                <g className="animate-flicker origin-bottom" style={{ transformOrigin: '30px 26px' }}>
                  {/* Outer Red/Orange Flame Halo */}
                  <path
                    d="M30 6 C23 15 22 24 30 26 C38 24 37 15 30 6 Z"
                    fill={`url(#diyaFlameGrad-${diya.id})`}
                    className="drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]"
                  />
                  {/* Inner Intense Golden-White Core */}
                  <path
                    d="M30 13 C26 18 26 24 30 25 C34 24 34 18 30 13 Z"
                    fill="#FFFBEB"
                    opacity="0.95"
                  />
                  {/* Blue Base Core (Hot Flame Bottom) */}
                  <ellipse cx="30" cy="25.5" rx="3.5" ry="1.5" fill="#38BDF8" opacity="0.75" />
                </g>
              </svg>

              {/* 3. Golden Specular Water Reflection Ripple Below */}
              <div
                className="rounded-full bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent blur-xs -mt-1 animate-pulse"
                style={{ width: `${diya.size * 1.6}px`, height: `${diya.size * 0.3}px`, animationDuration: '2.5s' }}
              />
            </div>
          </motion.div>
        ))}

        {/* 6. REFINED BOTTOM GHAT STONE PROMENADE & CONTROLS HUD */}
        <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-auto">
          {/* Subtle Carved Ghat Steps Elevation Layer */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/45 to-[#D4AF37]/10" />

          {/* Main Stone Step Deck Container */}
          <div className="bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-[#D4AF37]/25 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-2xl">
            {/* Left: Holy Rivers Inscription */}
            <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-semibold tracking-wide shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[12px] md:text-[13px]">
                {isHindi ? 'पवित्र गंगा, कोसी, गंडक व सोन घाट' : 'Sacred Waters of Ganga, Kosi, Gandak & Sone'}
              </span>
            </div>

            {/* Center: Interactive Prompt Pill with Ripple Indicator */}
            <div className="flex items-center gap-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-[#FFF5E1] shadow-inner transition-colors">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B] animate-flicker shrink-0" />
              <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                {isHindi
                  ? 'नदी में कहीं भी क्लिक करके दीप प्रज्वलित करें'
                  : 'Click anywhere on the river to light & float a Diya'}
              </span>
            </div>

            {/* Right: Sacred Arghya Counter Action Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] text-[#FFF5E1]/60 hidden lg:inline font-sans">
                {isHindi ? 'पटना • देव सूर्य मंदिर • हरिद्वार' : 'Patna • Deo Sun Temple • Haridwar'}
              </span>

              <button
                id="sacred-arghya-bottom-btn"
                onClick={handleArghyaClick}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/30 to-[#F59E0B]/30 hover:from-[#D4AF37]/45 hover:to-[#F59E0B]/45 active:scale-95 transition-all border border-[#D4AF37]/60 shadow-lg flex items-center gap-2 cursor-pointer group"
                title={isHindi ? 'सूर्य देव को अर्घ्य समर्पित करें' : 'Offer sacred Arghya to Surya Dev'}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8E2E10] to-[#FFD700] flex items-center justify-center shadow group-hover:rotate-12 transition-transform">
                  <Droplets className="w-3 h-3 text-[#180F08] font-bold" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-wider">
                    {isHindi ? 'अर्घ्य समर्पण' : 'Sacred Arghya'}
                  </div>
                  <div className="text-[11px] font-bold text-[#FFF5E1]">
                    {arghyaCount} {isHindi ? 'समर्पित' : 'Offerings'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Sacred Water Stream Animation when Arghya is Offered */}
      {isPouringStream && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Radiant Blessings Shower */}
            <div className="absolute top-28 w-2.5 h-52 bg-gradient-to-b from-[#FFFBEB] via-[#38BDF8] to-transparent rounded-full blur-xs animate-pulse opacity-85" />
            <div className="absolute top-32 px-5 py-2 rounded-2xl bg-black/85 border border-[#D4AF37] text-sm font-bold text-[#FFD700] shadow-2xl flex items-center gap-2 backdrop-blur-md">
              <Droplets className="w-4 h-4 text-[#38BDF8] animate-bounce" />
              <span>{isHindi ? 'ॐ सूर्याय नमः • अर्घ्य समर्पित!' : 'Om Suryaya Namaha • Arghya Offered!'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 8. Floating Wish / Prayer Notification Banner */}
      <AnimatePresence>
        {activeWish && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.92 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-[#E34234] fill-[#E34234] animate-pulse" />
            <span className="text-sm font-serif font-bold text-[#FFF5E1]">
              {activeWish}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
