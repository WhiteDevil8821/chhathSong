import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Radio, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSynth } from '../utils/soundSynthesizer';
import { ArghyaLotaVisual } from './CulturalArtifactVisuals';
import { useLanguage } from '../context/LanguageContext';
import { useRealtimePresence } from '../context/PresenceContext';

interface InteractiveArghyaProps {
  onArghyaOffered?: () => void;
  count?: number;
}

export const InteractiveArghya: React.FC<InteractiveArghyaProps> = ({
  onArghyaOffered
}) => {
  const { isHindi } = useLanguage();
  const presence = useRealtimePresence();
  const [isPouring, setIsPouring] = useState(false);
  const [lastBlessing, setLastBlessing] = useState<string | null>(null);

  const blessingsHi = [
    'ॐ सूर्याय नमः! सूर्य देव आपको तेज, स्वास्थ्य और दीर्घायु प्रदान करें।',
    'छठी मईया की असीम कृपा आपके परिवार पर सदा बनी रहे।',
    'उगते सूर्य का यह पावन अर्घ्य आपके जीवन में नई ऊर्जा और प्रकाश भरे।',
    'जय छठी मईया! मनोकामनाएं पूर्ण हों और घर-आँगन में सुख-शांति बसे।',
    'कंचन थार सजाए के, कलश उठाए के सूर्य देव के चरणों में शत-शत नमन।'
  ];

  const blessingsEn = [
    'Om Suryaya Namaha! May the Sun God bestow vigor, radiant health, and longevity.',
    'May the boundless blessings of Mother Chhathi reside forever with your family.',
    'May this sacred offering illuminate your life with divine energy and clarity.',
    'Jai Chhathi Maiya! May all noble aspirations be fulfilled with peace and joy.',
    'Salutations to the illuminator of the cosmos, may Surya Dev enlighten our intellect.'
  ];

  const triggerArghya = () => {
    if (isPouring) return;
    setIsPouring(true);

    // 1. Play sound synthesis: sacred pouring stream
    soundSynth.playArghyaStream();

    // 2. Trigger auspicious marigold petals confetti shower
    const end = Date.now() + 1400;
    const colors = ['#f59e0b', '#d97706', '#ef4444', '#fde047', '#ffedd5', '#d4af37'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.25
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.25
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 3. Record Live Arghya in Firestore & optimistic local update
    presence.recordArghyaOffering();
    if (onArghyaOffered) {
      onArghyaOffered();
    }

    const activeList = isHindi ? blessingsHi : blessingsEn;
    const randomBlessing = activeList[Math.floor(Math.random() * activeList.length)];
    setLastBlessing(randomBlessing);

    setTimeout(() => {
      setIsPouring(false);
    }, 2800);
  };

  const totalCount = presence.totalArghya || 0;
  const userCount = presence.userArghyaCount || 0;

  return (
    <div id="interactive-arghya-section" className="relative rounded-3xl bg-[#1C120B]/90 p-6 md:p-8 border border-[#D4AF37]/30 overflow-hidden shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Info & Mantra */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-sans font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
            <span>{isHindi ? 'पवित्र अनुष्ठान • Sacred Ritual' : 'Sacred Arghya Offering Ritual'}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#FFF5E1] tracking-wide">
            {isHindi ? 'भगवान सूर्य को अर्घ्य समर्पण (Offer Holy Arghya)' : 'Offer Sacred Arghya to Lord Surya'}
          </h3>

          <p className="text-sm md:text-base text-[#FFF5E1]/85 leading-relaxed max-w-xl font-sans font-normal">
            {isHindi
              ? 'हाथों में पीतल का कलश या सूप लेकर तांबे/पीतल के लोटे से गंगाजल और कच्चे दूध की पावन धार सूर्य देव को अर्पित करें। पावन मंत्रोच्चार और भक्ति भाव के साथ छठी मईया से प्रार्थना करें।'
              : 'Offer the holy continuous stream of Ganga water and pure cow milk through the consecrated brass Kalash to the Sun God amidst Vedic mantras and deep devotion.'}
          </p>

          {/* Sacred Mantra Display Box */}
          <div className="p-4 rounded-2xl bg-black/35 border border-[#D4AF37]/20 text-center space-y-1">
            <div className="text-xs text-[#D4AF37] font-sans font-bold tracking-widest uppercase">
              {isHindi ? 'सूर्य गायत्री मंत्र (Surya Gayatri Mantra)' : 'Surya Gayatri Mantra'}
            </div>
            <div className="text-sm md:text-base font-serif font-bold text-[#FFF5E1]">
              “ॐ आदित्याय विद्महे प्रभाकराय धीमहि तन्नः सूर्यः प्रचोदयात्”
            </div>
            <div className="text-[11px] text-[#FFF5E1]/70 italic">
              “Salutations to the illuminator of the cosmos, may Surya Dev enlighten our intellect.”
            </div>
          </div>

          {/* Live Arghya Status Counters (Global Live Sync + Personal Offerings) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 font-sans">
            {/* Global Live Arghya Count with Pulsing Beacon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/45 shadow-sm text-xs">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </span>
              <span className="text-[#FFF5E1]/85 font-medium">
                {isHindi ? 'विश्वभर से समर्पित अर्घ्य:' : 'Total Arghya Offered Globally:'}
              </span>
              <strong className="text-[#D4AF37] font-extrabold tracking-wide font-mono text-sm">
                {totalCount.toLocaleString('en-IN')}
              </strong>
            </div>

            {/* Devotee's Personal Offering Count */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/45 shadow-sm text-xs text-[#FFF5E1]">
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[#FFF5E1]/85 font-medium">
                {isHindi ? 'आपकी भेंट:' : 'Your Offerings:'}
              </span>
              <strong className="text-[#D4AF37] font-extrabold font-mono text-sm">
                {userCount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Ritual Interactive Visual Container */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Circular Sun Halo Background */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-[#8A3B14]/50 via-[#1C120B]/80 to-[#D4AF37]/20 border border-[#D4AF37]/35 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
            
            {/* Sun Rays radiating */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-2 border-dashed border-[#D4AF37]/25 rounded-full pointer-events-none"
            />

            {/* Sacred Lota / Kalash Interactive Element */}
            <motion.button
              id="arghya-action-btn"
              onClick={triggerArghya}
              disabled={isPouring}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={`relative z-10 w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 shadow-2xl ${
                isPouring
                  ? 'bg-gradient-to-br from-[#D4AF37] via-[#F28C28] to-[#8A3B14] ring-4 ring-[#D4AF37] ring-offset-4 ring-offset-[#1C120B]'
                  : 'bg-gradient-to-br from-[#C87D32] via-[#8A3B14] to-[#451a03] hover:from-[#D4AF37] hover:via-[#C87D32] hover:to-[#8A3B14]'
              }`}
            >
              {/* Kalash Icon */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={isPouring ? { rotate: [-25, -35, -25], y: [-5, 5, -5] } : { rotate: 0, y: 0 }}
                  transition={{ duration: 1.2, repeat: isPouring ? Infinity : 0 }}
                  className="drop-shadow-md"
                >
                  <ArghyaLotaVisual size={54} isPouring={isPouring} />
                </motion.div>

                {/* Pouring Stream Animation Effect */}
                {isPouring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 80 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-10 left-3 w-3 bg-gradient-to-b from-white via-amber-100 to-cyan-200 rounded-full blur-[1px] shadow-[0_0_12px_rgba(255,255,255,0.9)] -rotate-12 pointer-events-none"
                  />
                )}
              </div>

              <span className="text-xs md:text-sm font-serif font-bold text-[#FFF5E1] mt-1 uppercase tracking-wider">
                {isPouring
                  ? (isHindi ? 'अर्घ्य अर्पण...' : 'Offering...')
                  : (isHindi ? 'अर्घ्य दें (Offer)' : 'Offer Arghya')}
              </span>
              <span className="text-[10px] text-[#FFF5E1]/80 font-sans font-medium">
                {isPouring ? (isHindi ? 'पवित्र मंत्रोच्चार' : 'Chanting...') : (isHindi ? 'कलश पर क्लिक करें' : 'Click to Offer')}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Blessing Toast */}
      <AnimatePresence>
        {lastBlessing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 p-3.5 rounded-2xl bg-black/40 border border-[#D4AF37]/45 text-center"
          >
            <p className="text-xs md:text-sm font-serif font-semibold text-[#FFF5E1]">
              🙏 {lastBlessing}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
