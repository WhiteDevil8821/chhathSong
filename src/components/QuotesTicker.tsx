import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { NOSTALGIC_QUOTES } from '../data/chhathData';

export const QuotesTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % NOSTALGIC_QUOTES.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const quote = NOSTALGIC_QUOTES[currentIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % NOSTALGIC_QUOTES.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + NOSTALGIC_QUOTES.length) % NOSTALGIC_QUOTES.length);
  };

  return (
    <div
      id="quotes-ticker-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative glass-card rounded-3xl p-6 md:p-8 border border-[#F28C28]/35 overflow-hidden shadow-2xl transition-all"
    >
      {/* Background Ambience */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F28C28]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#9B3D12]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F28C28]/25 mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#F28C28] rotate-180" />
          <span className="text-xs md:text-sm font-sans font-bold text-[#F28C28] uppercase tracking-widest">
            छठ की स्मृतियाँ व लोक दर्शन • Folk Philosophy & Memories
          </span>
        </div>

        {/* Carousel controls & indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            {NOSTALGIC_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === i
                    ? 'w-6 bg-gradient-to-r from-[#F28C28] to-[#9B3D12]'
                    : 'w-1.5 bg-[#FFF5E1]/20 hover:bg-[#F28C28]'
                }`}
                title={`Quote ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="p-1 rounded-lg hover:bg-[#F28C28]/20 text-[#FFF5E1] transition-colors cursor-pointer"
            title="Previous Quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg hover:bg-[#F28C28]/20 text-[#FFF5E1] transition-colors cursor-pointer"
            title="Next Quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote Motion Transition Container */}
      <div className="min-h-[140px] md:min-h-[120px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full space-y-3"
          >
            {/* Bhojpuri/Hindi Verse in High-Emotive Typography */}
            <p className="text-lg md:text-2xl font-folk font-normal text-[#FFF5E1] leading-relaxed text-natural-glow">
              {quote.quoteDevanagari}
            </p>

            {/* English Cultural Translation */}
            <p className="text-xs md:text-sm text-[#FFF5E1]/80 italic font-garamond text-base leading-snug">
              “{quote.translation}”
            </p>

            {/* Context & Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-sans">
              <span className="text-[#F28C28] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{quote.authorOrFolk}</span>
              </span>
              <span className="text-[#FFF5E1]/70 text-[11px] bg-black/40 px-3 py-1 rounded-full border border-[#F28C28]/25">
                {quote.context}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
