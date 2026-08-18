import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Flame, Heart } from 'lucide-react';
import { GhatAtmosphere, FloatingDiya } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface GhatVisualProps {
  atmosphere: GhatAtmosphere;
  onAtmosphereChange: (atm: GhatAtmosphere) => void;
  onOfferArghya: () => void;
  arghyaCount: number;
}

export const GhatVisual: React.FC<GhatVisualProps> = ({
  atmosphere,
  onAtmosphereChange,
  onOfferArghya,
  arghyaCount
}) => {
  // State for interactive floating diyas
  const [diyas, setDiyas] = useState<FloatingDiya[]>([
    { id: 1, x: 15, y: 72, speed: 0.8, lit: true, size: 28, wish: 'सुख, शांति और आरोग्य (Peace & Health)' },
    { id: 2, x: 38, y: 78, speed: 1.1, lit: true, size: 32, wish: 'परिवार की कुशलता (Family Well-being)' },
    { id: 3, x: 62, y: 75, speed: 0.9, lit: true, size: 26, wish: 'छठी मईया का आशीर्वाद (Mother Chhathi\'s Blessings)' },
    { id: 4, x: 82, y: 80, speed: 1.2, lit: true, size: 30, wish: 'मनोकामना पूर्ति (Fulfilled Wishes)' }
  ]);

  const [activeWish, setActiveWish] = useState<string | null>(null);

  const handleAddDiya = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Only allow placing in the river area (lower 40%)
    if (clickY > 60) {
      soundSynth.playDiyaLight();
      const wishes = [
        'छठी मईया सबका कल्याण करें',
        'घर-आँगन में खुशहाली रहे',
        'सूर्य देव की कृपा सब पर बरसे',
        'आरोग्य और दीर्घायु की कामना'
      ];
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      const newDiya: FloatingDiya = {
        id: Date.now(),
        x: Math.max(5, Math.min(95, clickX)),
        y: Math.max(68, Math.min(88, clickY)),
        speed: 0.7 + Math.random() * 0.5,
        lit: true,
        size: 26 + Math.floor(Math.random() * 8),
        wish: randomWish
      };
      setDiyas(prev => [...prev.slice(-12), newDiya]);
      setActiveWish(randomWish);
      setTimeout(() => setActiveWish(null), 3500);
    }
  };

  const isDawn = atmosphere === 'dawn';

  return (
    <div
      id="ghat-interactive-canvas"
      className="relative w-full h-[620px] md:h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-[#F28C28]/30 transition-all duration-1000 select-none"
      onClick={handleAddDiya}
      style={{
        background: isDawn
          ? 'radial-gradient(ellipse at 50% 30%, #9B3D12 0%, #4a1f0a 40%, #2D1B0D 80%, #150b05 100%)'
          : 'radial-gradient(ellipse at 50% 30%, #9B3D12 0%, #581c87 35%, #2D1B0D 75%, #0e0517 100%)'
      }}
    >
      {/* Sky Atmospheric Glow & Stars/Mist */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft fog / morning mist layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#F28C28]/10 to-transparent opacity-60 animate-pulse" />
        
        {/* Divine Sun Rays (Surya Mandal) */}
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[480px] md:h-[480px] pointer-events-none">
          <div
            className={`w-full h-full rounded-full transition-all duration-1000 ${
              isDawn
                ? 'bg-gradient-to-r from-[#FFD700]/30 via-[#F28C28]/25 to-[#9B3D12]/30 blur-3xl animate-sun-pulse'
                : 'bg-gradient-to-r from-[#F28C28]/30 via-[#E34234]/20 to-purple-600/30 blur-3xl animate-sun-pulse'
            }`}
          />
          {/* Rotating Subtle Sun Rays */}
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_60s_linear_infinite] opacity-40">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 md:w-1.5 h-full bg-gradient-to-t from-transparent via-[#FFD700]/40 to-transparent"
                style={{ transform: `rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* The Radiant Sun / Surya Dev - matching Natural Tones sun motif */}
        <motion.div
          animate={{
            y: isDawn ? [0, -6, 0] : [0, 4, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            onOfferArghya();
          }}
          title="Click to offer sacred Arghya (अर्घ्य समर्पण)"
        >
          {/* Outer divine halo & thick concentric ring */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-[10px] md:border-[12px] border-[#F28C28]/20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#F28C28]/15 blur-2xl animate-pulse" />
            
            {/* SVG Sun with Dashed Orbit */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_30px_rgba(242,140,40,0.5)]">
              <path d="M10,50 Q10,10 50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50" fill="none" stroke="#F28C28" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="50" cy="50" r="36" fill="url(#sunGradTheme)" />
              <defs>
                <radialGradient id="sunGradTheme">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#F28C28" />
                </radialGradient>
              </defs>
            </svg>

            {/* Red Auspicious Pill from Natural Tones */}
            <div className="absolute -bottom-3.5 bg-[#E34234] text-white px-3.5 py-1 text-[9px] md:text-[10px] uppercase font-sans font-bold tracking-wider rounded-full shadow-lg shadow-[#E34234]/40 whitespace-nowrap">
              Jai Chhathi Maiya
            </div>
          </div>
          
          {/* Gayatri / Surya Mantra floating halo */}
          <span className="mt-4 text-[11px] md:text-xs text-[#FFF5E1] font-folk tracking-widest text-natural-glow">
            ॐ सूर्याय नमः
          </span>
        </motion.div>
      </div>

      {/* Atmospheric Mode Switcher Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full border border-[#F28C28]/35">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28C28] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F28C28]"></span>
          </span>
          <span className="text-xs font-semibold text-[#FFF5E1] tracking-wide font-sans">
            {isDawn ? 'पावन भोर • Misty Dawn Ghat' : 'स्वर्णिम सांझ • Golden Twilight Ghat'}
          </span>
        </div>

        {/* Atmosphere Toggle Buttons */}
        <div className="flex items-center gap-1.5 glass-card p-1 rounded-full border border-[#F28C28]/35">
          <button
            id="toggle-dawn-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAtmosphereChange('dawn');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 font-sans ${
              isDawn
                ? 'bg-gradient-to-r from-[#F28C28] to-[#9B3D12] text-[#FFF5E1] shadow-lg shadow-[#9B3D12]/60 font-bold'
                : 'text-[#FFF5E1]/70 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>उषा (Dawn)</span>
          </button>
          <button
            id="toggle-dusk-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAtmosphereChange('dusk');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 font-sans ${
              !isDawn
                ? 'bg-gradient-to-r from-[#9B3D12] to-purple-800 text-[#FFF5E1] shadow-lg shadow-purple-950/60 font-bold'
                : 'text-[#FFF5E1]/70 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>संध्या (Dusk)</span>
          </button>
        </div>
      </div>

      {/* Central Heritage Object: The Sacred Bamboo Daura & Brass Soop (कलात्मक दउरा व सूप) */}
      <div className="absolute top-[38%] md:top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex flex-col items-center"
        >
          {/* Sugarcane Mandap (ईख का मंडप) Top Frame */}
          <div className="absolute -top-28 md:-top-32 w-64 md:w-80 h-32 flex justify-between pointer-events-none opacity-85">
            {/* Left Stalks */}
            <div className="w-2.5 h-44 bg-gradient-to-b from-emerald-800 via-lime-700 to-amber-900 rounded-full rotate-12 transform origin-bottom shadow-lg border-t-4 border-emerald-400" />
            <div className="w-2 h-44 bg-gradient-to-b from-emerald-700 via-lime-600 to-amber-800 rounded-full rotate-6 transform origin-bottom" />
            {/* Central Sacred Red Knot (मौली धागा) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 border-2 border-yellow-300 shadow-[0_0_12px_rgba(239,68,68,0.9)] flex items-center justify-center">
              <span className="text-[8px] text-yellow-200 font-bold">卐</span>
            </div>
            {/* Right Stalks */}
            <div className="w-2 h-44 bg-gradient-to-b from-emerald-700 via-lime-600 to-amber-800 rounded-full -rotate-6 transform origin-bottom" />
            <div className="w-2.5 h-44 bg-gradient-to-b from-emerald-800 via-lime-700 to-amber-900 rounded-full -rotate-12 transform origin-bottom shadow-lg border-t-4 border-emerald-400" />
          </div>

          {/* Layered Sacred Daura & Soop Illustration */}
          <div className="relative w-72 md:w-88 h-48 md:h-56 flex items-center justify-center">
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />

            {/* Sacred Daura (बाँस का दउरा) Base */}
            <div className="absolute bottom-2 w-60 md:w-72 h-24 rounded-[50%] bg-gradient-to-b from-[#854d0e] via-[#713f12] to-[#451a03] border-4 border-amber-600/70 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Bamboo Weaving Texture Lines */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:8px_8px]" />
              <div className="w-full h-1 bg-red-600/70 absolute top-2 border-dashed border-t border-yellow-400" />
            </div>

            {/* Brass Soop (पीतल का सूप) Resting in the Daura */}
            <div className="absolute bottom-6 w-48 md:w-56 h-28 rounded-t-3xl rounded-b-xl bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-2 border-yellow-200 shadow-xl flex flex-col items-center justify-start p-2">
              {/* Traditional Vermilion (Aipan & Sindoor Tika) */}
              <div className="w-full flex justify-center items-center gap-3 pt-1">
                <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.9)]" />
                <div className="w-3 h-3 rounded-full bg-red-600 border border-yellow-200 shadow-[0_0_8px_rgba(220,38,38,1)] flex items-center justify-center">
                  <span className="text-[6px] text-yellow-200">卐</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.9)]" />
              </div>

              {/* Offerings Inside Soop: Bananas, Thekua, Sugarcane, Pomelo, Ginger-Turmeric */}
              <div className="relative w-full h-full flex items-center justify-center gap-1.5 pt-1">
                {/* Banana Bunch (केला) */}
                <div className="w-7 h-10 bg-yellow-400 rounded-t-full rounded-b-md border border-amber-600/40 -rotate-12 shadow-sm flex flex-col justify-between items-center py-1">
                  <span className="text-[7px] text-amber-900 font-bold">🍌</span>
                </div>
                {/* Ghee Thekua (ठेकुआ) */}
                <div className="w-8 h-8 rounded-full bg-amber-800 border-2 border-amber-500 shadow-md flex items-center justify-center transform hover:scale-110">
                  <span className="text-[8px] text-amber-200 font-bold">🍪</span>
                </div>
                {/* Fresh Coconut (नारियल) */}
                <div className="w-9 h-9 rounded-full bg-[#5c2e0b] border-2 border-amber-700 shadow-md flex items-center justify-center">
                  <span className="text-[8px] text-amber-300 font-bold">🥥</span>
                </div>
                {/* Dabh Nimbu / Pomelo (डाभ नींबू) */}
                <div className="w-8 h-8 rounded-full bg-lime-500 border border-lime-700 shadow-sm flex items-center justify-center">
                  <span className="text-[8px] text-lime-950 font-bold">🍋</span>
                </div>
              </div>
            </div>

            {/* Glowing Earthen Diya (मिट्टी का प्रज्वलित दीपक) atop Soop */}
            <div className="absolute top-8 md:top-6 flex flex-col items-center">
              {/* Flame */}
              <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-t-full rounded-b-md animate-flicker shadow-[0_0_20px_rgba(251,191,36,1)]" />
              {/* Clay base */}
              <div className="w-8 h-3.5 bg-gradient-to-b from-[#9a3412] to-[#7c2d12] rounded-b-full border-t border-amber-400/80 shadow-md" />
            </div>
          </div>

          {/* Authentic Label */}
          <div className="glass-card px-4 py-1 rounded-full border border-[#F28C28]/40 flex items-center gap-1.5 shadow-lg mt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C28] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs md:text-sm font-devanagari font-bold text-[#FFF5E1] tracking-wider">
              पवित्र दउरा, सूप व पावन प्रसाद
            </span>
          </div>
        </motion.div>
      </div>

      {/* River Ganga Waters (पवित्र गंगाजल व तरंगें) */}
      <div className="absolute bottom-0 inset-x-0 h-56 md:h-64 pointer-events-auto overflow-hidden">
        {/* River Background Gradient */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isDawn
              ? 'bg-gradient-to-b from-[#2D1B0D]/80 via-[#1a0f07] to-[#0c0703]'
              : 'bg-gradient-to-b from-[#351528]/80 via-[#180a19] to-[#0a040b]'
          }`}
        />

        {/* River Water Surface Golden Reflection Ripples */}
        <div className="absolute inset-0 opacity-35">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,#F28C28_0%,transparent_70%)] animate-water-ripple" />
        </div>

        {/* River Steps (Ghat Pauri) Silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#150b05] to-transparent border-t border-[#9B3D12]/40 pointer-events-none flex items-center justify-between px-6">
          <span className="text-[11px] text-[#F28C28]/80 font-serif-royal font-bold">
            गंगे च यमुने चैव गोदावरि सरस्वति...
          </span>
          <span className="text-[11px] text-[#FFF5E1]/80 font-sans font-medium hidden sm:inline">
            गंगा, कोसी, गंडक व सोन तट • मिथिला, मगध, अंग व भोजपुरी माटी
          </span>
        </div>

        {/* Interactive Floating Diyas */}
        {diyas.map((diya) => (
          <motion.div
            key={diya.id}
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [0, (diya.id % 2 === 0 ? 12 : -12), 0],
              y: [0, (diya.id % 2 === 0 ? -4 : 4), 0]
            }}
            transition={{
              duration: 4 + diya.speed,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute cursor-pointer group z-20"
            style={{
              left: `${diya.x}%`,
              top: `${diya.y - 45}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
              soundSynth.playDiyaLight();
              setActiveWish(diya.wish || 'छठी मईया की जय');
              setTimeout(() => setActiveWish(null), 3000);
            }}
          >
            {/* Tooltip wish on hover */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap glass-card px-2.5 py-0.5 rounded text-[10px] text-[#FFF5E1] border border-[#F28C28]/40 z-30 font-sans">
              {diya.wish}
            </div>

            {/* Glowing Diya Visual */}
            <div className="relative flex flex-col items-center">
              {/* Flame */}
              <div
                className="bg-gradient-to-t from-[#F28C28] via-[#FFD700] to-[#FFF5E1] rounded-t-full rounded-b-sm animate-flicker shadow-[0_0_15px_rgba(242,140,40,0.9)]"
                style={{ width: `${diya.size * 0.35}px`, height: `${diya.size * 0.55}px` }}
              />
              {/* Earthen Bowl */}
              <div
                className="bg-gradient-to-b from-[#9B3D12] to-[#451a03] rounded-b-full border-t border-[#F28C28] shadow-md"
                style={{ width: `${diya.size}px`, height: `${diya.size * 0.4}px` }}
              />
              {/* Water Reflection Ring */}
              <div
                className="rounded-full bg-[#F28C28]/25 blur-sm -mt-1"
                style={{ width: `${diya.size * 1.4}px`, height: `${diya.size * 0.3}px` }}
              />
            </div>
          </motion.div>
        ))}

        {/* Click Prompt Indicator on River */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-center">
          <p className="text-[11px] md:text-xs text-[#FFF5E1]/70 font-sans font-medium tracking-wide flex items-center justify-center gap-1.5">
            <Flame className="w-3 h-3 text-[#F28C28] animate-flicker inline" />
            <span>नदी में कहीं भी क्लिक करके दीप प्रज्वलित करें (Click river to float a Diya)</span>
          </p>
        </div>
      </div>

      {/* Floating Active Prayer / Wish Pop-Up Banner */}
      <AnimatePresence>
        {activeWish && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 glass-card px-5 py-2.5 rounded-2xl border border-[#F28C28]/60 shadow-[0_0_30px_rgba(242,140,40,0.4)] flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-[#E34234] fill-[#E34234] animate-pulse" />
            <span className="text-sm font-devanagari font-bold text-[#FFF5E1]">
              {activeWish}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Overlay: Arghya Count Badge */}
      <div className="absolute bottom-16 right-4 z-20 pointer-events-auto">
        <button
          id="quick-arghya-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOfferArghya();
          }}
          className="glass-card hover:bg-[#F28C28]/20 active:scale-95 transition-all px-3.5 py-2 rounded-2xl border border-[#F28C28]/40 shadow-lg flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9B3D12] via-[#F28C28] to-[#FFD700] flex items-center justify-center text-black font-bold shadow-md group-hover:rotate-12 transition-transform">
            💧
          </div>
          <div className="text-left font-sans">
            <div className="text-[10px] text-[#F28C28] font-medium uppercase tracking-wider">अर्घ्य समर्पित</div>
            <div className="text-xs font-bold text-[#FFF5E1] font-devanagari">{arghyaCount} बार (Offerings)</div>
          </div>
        </button>
      </div>
    </div>
  );
};
