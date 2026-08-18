import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Share2,
  Info,
  Radio,
  Compass,
  Award,
  Music,
  Mail,
  Shield,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { GhatAtmosphere } from './types';
import { GhatVisual } from './components/GhatVisual';
import { InteractiveArghya } from './components/InteractiveArghya';
import { QuotesTicker } from './components/QuotesTicker';
import { FourDaysTimeline } from './components/FourDaysTimeline';
import { CulturalArtifactsGrid } from './components/CulturalArtifactsGrid';
import { NostalgicMemoriesBoard } from './components/NostalgicMemoriesBoard';
import { NostalgicMusicPlayer } from './components/NostalgicMusicPlayer';
import { InfoModals, ActiveModal } from './components/InfoModals';
import { soundSynth } from './utils/soundSynthesizer';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [atmosphere, setAtmosphere] = useState<GhatAtmosphere>('dawn');
  const [arghyaCount, setArghyaCount] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const contactEmail = 'ankit.kumar221099@gmail.com';

  const handleOfferArghya = () => {
    setArghyaCount(prev => prev + 1);
  };

  const handleToggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    soundSynth.setMuted(nextMuted);
  };

  const handleShare = () => {
    setActiveModal('share');
  };

  return (
    <div className="min-h-screen bg-[#2D1B0D] text-[#FFF5E1] relative selection:bg-[#F28C28] selection:text-[#2D1B0D] pb-36 font-serif">
      {/* Natural Tones Dynamic Background Ambient & Dot Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle 10px Dot Matrix from Natural Tones Theme */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#F28C28 0.75px, transparent 0.75px)',
            backgroundSize: '12px 12px'
          }}
        />
        {/* Deep Earthen Terracotta Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#9B3D12]/35 via-transparent to-black/60" />

        {/* Atmospheric Dynamic Sky Glow */}
        <div
          className={`absolute top-0 inset-x-0 h-[600px] transition-all duration-1000 opacity-40 blur-[100px] ${
            atmosphere === 'dawn'
              ? 'bg-gradient-to-b from-[#F28C28]/30 via-[#9B3D12]/40 to-transparent'
              : 'bg-gradient-to-b from-[#9B3D12]/50 via-purple-900/30 to-transparent'
          }`}
        />
      </div>

      {/* Top Floating Navigation / Status Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#2D1B0D]/90 border-b border-[#F28C28]/25 px-3 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Regional Identity */}
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-tr from-[#9B3D12] via-[#F28C28] to-[#FFD700] flex items-center justify-center shadow-[0_0_20px_rgba(242,140,40,0.4)] border border-[#F28C28]/40 text-base md:text-lg shrink-0">
              🪔
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#F28C28] font-sans font-bold truncate">
                  Mithila • Magadh • Anga
                </span>
                <span className="hidden xs:inline-block text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full bg-[#E34234] text-white font-sans font-bold tracking-wider uppercase shrink-0">
                  छठी मईया
                </span>
              </div>
              <p className="text-xs md:text-sm font-devanagari font-bold text-[#FFF5E1] tracking-wide text-natural-glow truncate">
                महापर्व छठ • The Pride of Bihar
              </p>
            </div>
          </div>

          {/* Desktop Navigation Controls */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            {/* Pan-Bihar Sacred Ghat Location Badge */}
            <div className="hidden lg:flex border border-[#F28C28]/40 rounded-full px-3.5 py-1.5 backdrop-blur-sm bg-black/20">
              <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#FFF5E1]">
                पावन घाट • सम्पूर्ण बिहार
              </span>
            </div>

            {/* About Modal Button */}
            <button
              onClick={() => setActiveModal('about')}
              className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-[#F28C28]/20 text-xs font-sans font-semibold text-[#FFF5E1] border border-[#F28C28]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="About Chhath Mahaparv"
            >
              <Info className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>परिचय (About)</span>
            </button>

            {/* Contact Modal Button */}
            <button
              onClick={() => setActiveModal('contact')}
              className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-[#F28C28]/20 text-xs font-sans font-semibold text-[#FFF5E1] border border-[#F28C28]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Contact & Feedback"
            >
              <Mail className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>संपर्क (Contact)</span>
            </button>

            {/* Audio Synthesis Sound Toggle */}
            <button
              id="header-sound-mute-btn"
              onClick={handleToggleMute}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isAudioMuted
                  ? 'bg-black/40 border-[#E34234]/40 text-[#E34234]'
                  : 'bg-black/30 border-[#F28C28]/40 text-[#F28C28] hover:bg-[#F28C28]/20'
              }`}
              title={isAudioMuted ? 'Unmute ritual sounds' : 'Mute ritual sounds'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Share / Blessings Button */}
            <button
              id="header-share-btn"
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#9B3D12] to-[#F28C28] hover:opacity-95 text-xs font-sans font-semibold text-[#2D1B0D] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2D1B0D]" />
              <span>शुभकामनाएँ (Share)</span>
            </button>
          </div>

          {/* Mobile Right Controls: Sound & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Audio Toggle (Always accessible) */}
            <button
              id="header-mobile-sound-btn"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isAudioMuted
                  ? 'bg-black/40 border-[#E34234]/40 text-[#E34234]'
                  : 'bg-black/30 border-[#F28C28]/40 text-[#F28C28]'
              }`}
              title={isAudioMuted ? 'Unmute ritual sounds' : 'Mute ritual sounds'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Hamburger Button */}
            <button
              id="header-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-black/40 border border-[#F28C28]/40 text-[#FFF5E1] hover:bg-[#F28C28]/20 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#F28C28]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown / Drawer Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-[#F28C28]/20 mt-3 pt-3 space-y-2.5"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveModal('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#F28C28]/30 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#F28C28]/20 transition-all cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>परिचय (About)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#F28C28]/30 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#F28C28]/20 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>संपर्क (Contact)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveModal('privacy');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#F28C28]/30 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#F28C28]/20 transition-all cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>गोपनीयता (Privacy)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal('terms');
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-[#F28C28]/30 text-left flex items-center gap-2 text-xs font-semibold text-[#FFF5E1] hover:bg-[#F28C28]/20 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>नियम व शर्तें (Terms)</span>
                </button>
              </div>

              {/* Share Blessings Full Button */}
              <button
                onClick={() => {
                  handleShare();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9B3D12] via-[#F28C28] to-[#FFD700] text-[#2D1B0D] font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#2D1B0D]" />
                <span>शुभकामनाएँ भेजें (Share Blessings)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 space-y-12 md:space-y-16">
        {/* Hero Branding & Memorable Title Section */}
        <section id="hero-title-section" className="text-center space-y-4 max-w-4xl mx-auto">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2">
            <h2 className="text-xs uppercase tracking-[0.4em] text-[#F28C28] font-sans font-bold">
              Mithila • Magadh • Anga • Bhojpuriya Maati
            </h2>
          </div>

          {/* Large Memorable Title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-light tracking-tighter leading-none text-[#FFF5E1]">
            CHHATH <span className="italic font-extralight text-[#F28C28]">PUJA</span>
          </h1>

          <div className="text-lg md:text-2xl font-devanagari font-semibold text-[#F28C28] tracking-wider text-natural-glow">
            द प्राइड ऑफ बिहार • लोक आस्था का महापर्व
          </div>

          {/* Subtitle & Cultural Statement */}
          <p className="mt-4 text-base sm:text-lg opacity-85 max-w-2xl mx-auto font-sans font-light leading-relaxed text-[#FFF5E1]">
            The celebration of cosmic energy, faith, and the eternal bond between the Sun and the Earth.
            जहाँ उगते और डूबते दोनों सूर्यों को नमन किया जाता है।
          </p>
        </section>

        {/* 1. Visually Rich Nostalgic Ganga Ghat Canvas & Central Object */}
        <section aria-label="Sacred Ganga Ghat">
          <GhatVisual
            atmosphere={atmosphere}
            onAtmosphereChange={setAtmosphere}
            onOfferArghya={handleOfferArghya}
            arghyaCount={arghyaCount}
          />
        </section>

        {/* 2. Rotating Nostalgic Quotes & Verses */}
        <section aria-label="Nostalgic Quotes and Memories">
          <QuotesTicker />
        </section>

        {/* 3. Interactive Sacred Arghya Ritual */}
        <section aria-label="Interactive Arghya Ritual">
          <InteractiveArghya onArghyaOffered={handleOfferArghya} count={arghyaCount} />
        </section>

        {/* 4. The 4 Sacred Days of Chhath Puja */}
        <section aria-label="Four Sacred Days of Chhath">
          <FourDaysTimeline />
        </section>

        {/* 5. Authentic Artifacts: Daura, Soop, Thekua, Ganna Mandap, Sindoor */}
        <section aria-label="Sacred Cultural Artifacts">
          <CulturalArtifactsGrid />
        </section>

        {/* 6. Emotional Nostalgia, Train Journey & Community Unity */}
        <section aria-label="Bihari Diaspora Memories">
          <NostalgicMemoriesBoard />
        </section>

        {/* Production Footer with Navigation Links & Contact Info */}
        <footer className="pt-12 pb-16 border-t border-[#F28C28]/25 text-center space-y-6 font-sans">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🪔</span>
            <span className="text-lg md:text-xl font-devanagari font-bold text-[#FFF5E1] text-natural-glow">
              जय छठी मईया • सूर्य देवाय नमः
            </span>
            <span className="text-xl">🪔</span>
          </div>

          <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-xl mx-auto leading-relaxed">
            स्वर कोकिला <strong>पद्म भूषण शारदा सिन्हा</strong> जी के अमर स्वरों को भावभीनी श्रद्धांजलि, जिनके गीतों के बिना छठ का महापर्व अधूरा है।
          </p>

          {/* Quick Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#F28C28]">
            <button
              onClick={() => setActiveModal('about')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              परिचय (About Chhath)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              संपर्क (Contact Us)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              सांस्कृतिक मर्यादा एवं नीति (Privacy & Terms)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('share')}
              className="hover:underline hover:text-[#FFF5E1] transition-all cursor-pointer"
            >
              शुभकामनाएँ साझा करें (Share)
            </button>
          </div>

          {/* Creator Social Media Handles */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-devanagari text-[#FFF5E1]/70">
              संयोजक व निर्माता (Creator):
            </span>
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/_ek__bihari__/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#E1306C]/15 hover:bg-[#E1306C]/30 text-[#FFF5E1] border border-[#E1306C]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="Instagram @_ek__bihari__"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/DarkPheonix8831/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#FFF5E1] border border-[#1877F2]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="Facebook Ankit Singh"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1877F2] group-hover:scale-110 transition-transform">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ankitsingh2210/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 text-[#FFF5E1] border border-[#0A66C2]/40 text-xs font-semibold flex items-center gap-1.5 transition-all group"
                title="LinkedIn Ankit Singh"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Contact Email & Copyright */}
          <div className="pt-1 space-y-1.5 text-xs text-[#FFF5E1]/60 font-mono">
            <div>
              Contact: <a href={`mailto:${contactEmail}`} className="text-[#F28C28] hover:underline font-semibold">{contactEmail}</a>
            </div>
            <div className="text-[#FFF5E1]/40 text-[11px]">
              © {new Date().getFullYear()} Chhath: The Pride of Bihar. All rights reserved. • A cultural tribute to Bihar & Purvanchal.
            </div>
          </div>
        </footer>
      </main>

      {/* Fixed Glassmorphism YouTube Music Player */}
      <NostalgicMusicPlayer
        currentTrackIndex={currentTrackIndex}
        onTrackChange={setCurrentTrackIndex}
        isPlaying={isPlaying}
        onPlayPauseToggle={() => setIsPlaying(prev => !prev)}
      />

      {/* Production Info & Contact Modals */}
      <InfoModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        contactEmail={contactEmail}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
