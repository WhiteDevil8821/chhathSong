import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSynth } from '../utils/soundSynthesizer';
import { ArghyaLotaVisual } from './CulturalArtifactVisuals';

interface InteractiveArghyaProps {
  onArghyaOffered: () => void;
  count: number;
}

export const InteractiveArghya: React.FC<InteractiveArghyaProps> = ({
  onArghyaOffered,
  count
}) => {
  const [isPouring, setIsPouring] = useState(false);
  const [lastBlessing, setLastBlessing] = useState<string | null>(null);

  const blessings = [
    'ॐ सूर्याय नमः! सूर्य देव आपको तेज, स्वास्थ्य और दीर्घायु प्रदान करें।',
    'छठी मईया की असीम कृपा आपके परिवार पर सदा बनी रहे।',
    'उगते सूर्य का यह पावन अर्घ्य आपके जीवन में नई ऊर्जा और प्रकाश भरे।',
    'जय छठी मईया! मनोकामनाएं पूर्ण हों और घर-आँगन में सुख-शांति बसे।'
  ];

  const triggerArghya = () => {
    if (isPouring) return;
    setIsPouring(true);

    // 1. Play sound synthesis: sacred pouring stream
    soundSynth.playArghyaStream();

    // 2. Trigger auspicious marigold petals confetti shower
    const end = Date.now() + 1200;
    const colors = ['#f59e0b', '#d97706', '#ef4444', '#fde047', '#ffedd5'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.2
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.2
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 3. Callback
    onArghyaOffered();
    const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
    setLastBlessing(randomBlessing);

    setTimeout(() => {
      setIsPouring(false);
    }, 2800);
  };

  return (
    <div id="interactive-arghya-section" className="relative glass-card rounded-3xl p-6 md:p-8 border border-[#F28C28]/35 overflow-hidden shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F28C28]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Info & Mantra */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[#F28C28]/40 text-[#F28C28] text-xs font-sans font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C28] animate-spin" style={{ animationDuration: '6s' }} />
            <span>पवित्र अनुष्ठान • Sacred Ritual</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-devanagari font-bold text-[#FFF5E1] tracking-wide">
            भगवान सूर्य को अर्घ्य समर्पण (Offer Holy Arghya)
          </h3>

          <p className="text-sm md:text-base text-[#FFF5E1]/85 leading-relaxed max-w-xl font-sans font-normal">
            हाथों में पीतल का कलश या सूप लेकर तांबे/पीतल के लोटे से गंगाजल और कच्चे दूध की पावन धार सूर्य देव को अर्पित करें।
            पावन मंत्रोच्चार और भक्ति भाव के साथ छठी मईया से प्रार्थना करें।
          </p>

          {/* Sacred Mantra Display Box */}
          <div className="p-4 rounded-2xl bg-black/35 border border-[#F28C28]/25 text-center space-y-1">
            <div className="text-xs text-[#F28C28] font-sans font-bold tracking-widest uppercase">
              सूर्य गायत्री मंत्र (Surya Gayatri Mantra)
            </div>
            <div className="text-sm md:text-base font-devanagari font-bold text-[#FFF5E1] text-natural-glow">
              “ॐ आदित्याय विद्महे प्रभाकराय धीमहि तन्नः सूर्यः प्रचोदयात्”
            </div>
            <div className="text-[11px] text-[#FFF5E1]/60 italic font-garamond">
              “Salutations to the illuminator of the cosmos, may Surya Dev enlighten our intellect.”
            </div>
          </div>

          {/* Arghya Status Details */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 font-sans">
            <div className="text-xs text-[#F28C28] bg-black/40 px-3.5 py-1.5 rounded-full border border-[#F28C28]/35 font-bold">
              कुल समर्पित अर्घ्य: <span className="text-[#FFF5E1] font-extrabold">{count}</span>
            </div>
          </div>
        </div>

        {/* Right Ritual Interactive Visual Container */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Circular Sun Halo Background */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-[#9B3D12]/50 via-[#2D1B0D]/80 to-[#F28C28]/20 border border-[#F28C28]/40 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(242,140,40,0.2)]">
            
            {/* Sun Rays radiating */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-2 border-dashed border-[#F28C28]/30 rounded-full pointer-events-none"
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
                  ? 'bg-gradient-to-br from-[#FFD700] via-[#F28C28] to-[#9B3D12] ring-4 ring-[#F28C28] ring-offset-4 ring-offset-[#2D1B0D]'
                  : 'bg-gradient-to-br from-[#F28C28] via-[#9B3D12] to-[#4a1f0a] hover:from-[#FFD700] hover:via-[#F28C28] hover:to-[#9B3D12]'
              }`}
            >
              {/* Kalash Icon / Visual Representation */}
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

              <span className="text-xs md:text-sm font-devanagari font-bold text-[#FFF5E1] mt-1 uppercase tracking-wider">
                {isPouring ? 'अर्घ्य अर्पण...' : 'अर्घ्य दें (Offer)'}
              </span>
              <span className="text-[10px] text-[#FFF5E1]/80 font-sans font-medium">
                {isPouring ? 'पवित्र मंत्रोच्चार' : 'Click / Tap Lota'}
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
            className="mt-6 p-3.5 rounded-2xl bg-black/40 border border-[#F28C28]/50 text-center"
          >
            <p className="text-xs md:text-sm font-devanagari font-semibold text-[#FFF5E1]">
              🙏 {lastBlessing}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
