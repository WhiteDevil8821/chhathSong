import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info, X, Heart, Shield, Layers } from 'lucide-react';
import { CULTURAL_ARTIFACTS } from '../data/chhathData';
import { CulturalArtifact } from '../types';
import {
  SacredDauraVisual,
  SacredSoopVisual,
  ThekuaVisual,
  GannaMandapVisual,
  SacredSindoorVisual,
  MittiChulhaVisual,
  ArghyaLotaVisual
} from './CulturalArtifactVisuals';

export const CulturalArtifactsGrid: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<CulturalArtifact | null>(null);

  // Prevent background scrolling when modal is open on mobile and desktop
  useEffect(() => {
    if (selectedArtifact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtifact]);

  const renderArtifactVisual = (id: string, size = 48) => {
    switch (id) {
      case 'daura':
        return <SacredDauraVisual size={size} />;
      case 'soop':
        return <SacredSoopVisual size={size} />;
      case 'thekua':
        return <ThekuaVisual size={size} />;
      case 'ganna':
        return <GannaMandapVisual size={size} />;
      case 'sindoor':
        return <SacredSindoorVisual size={size} />;
      case 'chulha':
        return <MittiChulhaVisual size={size} />;
      default:
        return <ArghyaLotaVisual size={size} />;
    }
  };

  return (
    <div id="cultural-artifacts-section" className="relative glass-card rounded-3xl p-6 md:p-8 border border-[#F28C28]/35 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#F28C28]/25">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#F28C28]/40 text-[#F28C28] text-xs font-sans font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>छठ के पावन प्रतीक • Sacred Symbols & Artifacts</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-devanagari font-bold text-[#FFF5E1]">
            माटी और संस्कृति के अनमोल अंग
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md font-sans">
          सूप, दउरा से लेकर सिंदूर और ठेकुआ तक — जानिए छठ से जुड़ी हर पवित्र वस्तु की ऐतिहासिक और भावनात्मक महत्ता।
        </p>
      </div>

      {/* Artifacts Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CULTURAL_ARTIFACTS.map((artifact) => (
          <motion.div
            key={artifact.id}
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={() => setSelectedArtifact(artifact)}
            className="p-5 rounded-2xl bg-black/35 border border-[#F28C28]/25 hover:border-[#F28C28]/60 hover:bg-black/50 transition-all cursor-pointer shadow-lg group relative overflow-hidden flex flex-col justify-between font-sans"
          >
            {/* Top Tag & Visual Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-black/50 border border-[#F28C28]/35 group-hover:scale-110 transition-transform flex items-center justify-center">
                {renderArtifactVisual(artifact.id, 42)}
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E34234] text-white uppercase tracking-wider shadow-sm">
                {artifact.badge}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1 my-2">
              <h4 className="text-lg font-devanagari font-bold text-[#FFF5E1] group-hover:text-[#F28C28] transition-colors">
                {artifact.title}
              </h4>
              <h5 className="text-xs text-[#F28C28] font-medium">
                {artifact.hindiTitle} • {artifact.subtitle}
              </h5>
              <p className="text-xs text-[#FFF5E1]/75 line-clamp-2 mt-2 leading-relaxed">
                {artifact.description}
              </p>
            </div>

            {/* Click inspect button / trigger */}
            <div className="pt-3 border-t border-[#F28C28]/20 flex items-center justify-between text-[11px] text-[#F28C28] font-semibold">
              <span className="font-medium">विस्तार से जानें (Learn More)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArtifact(artifact);
                }}
                className="p-1 rounded-full hover:bg-[#F28C28]/20 transition-colors"
                aria-label={`Learn more about ${artifact.title}`}
              >
                <Info className="w-4 h-4 text-[#F28C28] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Artifact Detailed Modal / Inspector rendered via Portal to body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedArtifact && (
              <div
                className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain"
                onClick={() => setSelectedArtifact(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-2xl glass-card rounded-3xl p-5 sm:p-7 md:p-8 border border-[#F28C28]/50 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans my-auto"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 hover:bg-[#F28C28]/30 border border-[#F28C28]/30 text-[#FFF5E1] transition-all cursor-pointer z-20 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    title="Close"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Header */}
                  <div className="flex items-center gap-4 pr-10">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-[#F28C28]/40 flex-shrink-0 flex items-center justify-center">
                      {renderArtifactVisual(selectedArtifact.id, 56)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E34234] text-white">
                          {selectedArtifact.badge}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-devanagari font-bold text-[#FFF5E1] mt-1 leading-snug">
                        {selectedArtifact.title} ({selectedArtifact.hindiTitle})
                      </h3>
                      <p className="text-xs text-[#F28C28]">
                        {selectedArtifact.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-[#F28C28]/25 space-y-1.5">
                    <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block">
                      विवरण व स्वरूप (Description)
                    </span>
                    <p className="text-xs sm:text-sm text-[#FFF5E1]/90 leading-relaxed font-normal">
                      {selectedArtifact.description}
                    </p>
                  </div>

                  {/* Grid of Materials & Symbolism */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/35 border border-[#F28C28]/25 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>सामग्री (Materials)</span>
                      </div>
                      <p className="text-xs text-[#FFF5E1]/80 leading-relaxed">
                        {selectedArtifact.materials}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/35 border border-[#F28C28]/25 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                        <Shield className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>सांस्कृतिक प्रतीक (Symbolism)</span>
                      </div>
                      <p className="text-xs text-[#FFF5E1]/80 leading-relaxed">
                        {selectedArtifact.symbolism}
                      </p>
                    </div>
                  </div>

                  {/* Childhood Nostalgia Note */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-[#E34234]/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#E34234] uppercase tracking-wider">
                      <Heart className="w-3.5 h-3.5 text-[#E34234]" />
                      <span>बचपन की यादें (Nostalgic Bihar Memory)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#FFF5E1]/90 italic font-garamond text-base leading-relaxed">
                      "{selectedArtifact.childhoodMemory}"
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
