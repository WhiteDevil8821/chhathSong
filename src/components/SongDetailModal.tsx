import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Play, Volume2, Mic2, Calendar, Share2, Check, Sparkles, BookOpen, Music, Heart, ArrowRight } from 'lucide-react';
import { ChhathSong } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SongDetailModalProps {
  song: ChhathSong | null;
  allSongs: ChhathSong[];
  isPlaying: boolean;
  currentPlayingId: string;
  onClose: () => void;
  onPlaySong: (song: ChhathSong) => void;
  onSelectRelatedSong: (song: ChhathSong) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  allSongs,
  isPlaying,
  currentPlayingId,
  onClose,
  onPlaySong,
  onSelectRelatedSong
}) => {
  const { isHindi } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showEmbedVideo, setShowEmbedVideo] = useState(false);

  useEffect(() => {
    setShowEmbedVideo(false);
  }, [song?.id]);

  if (!song) return null;

  const isCurrentPlaying = song.id === currentPlayingId && isPlaying;

  // Find related songs
  const relatedSongs: ChhathSong[] = (song.relatedSongIds || [])
    .map(id => allSongs.find(s => s.id === id))
    .filter((s): s is ChhathSong => Boolean(s));

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?song=${song.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${song.title} - Chhath Geet Lyrics & Meaning: ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="song-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-[#1A110A] border border-[#D4AF37]/40 shadow-2xl p-6 md:p-8 space-y-6 text-[#FFF5E1] my-8 max-h-[90vh] overflow-y-auto font-sans"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <Mic2 className="w-3.5 h-3.5" />
                <span>{song.singer || song.artist}</span>
              </span>
              {song.whenSung && (
                <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-[#FFF5E1]/70 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{song.whenSung}</span>
                </span>
              )}
            </div>

            <h2 id="song-modal-title" className="text-2xl md:text-3xl font-serif font-bold text-[#FFF5E1] mt-2">
              {song.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/80 text-[#FFF5E1]/70 hover:text-white border border-[#D4AF37]/30 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Play in Audio Bar / Watch Video Facade */}
        <div className="rounded-2xl bg-black/60 border border-[#D4AF37]/30 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onPlaySong(song)}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isCurrentPlaying
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'bg-[#D4AF37] text-[#180F08] hover:bg-[#FFE5B4] shadow-lg shadow-[#D4AF37]/20'
              }`}
            >
              {isCurrentPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>{isHindi ? 'अभी बज रहा है (Playing in Player)' : 'Now Playing in Bottom Bar'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isHindi ? 'प्लेयर में गीत बजाएं' : 'Play Song in Music Player'}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowEmbedVideo(!showEmbedVideo)}
                className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/70 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] transition-colors"
              >
                {showEmbedVideo
                  ? (isHindi ? 'वीडियो छिपाएं' : 'Hide Video Player')
                  : (isHindi ? 'YouTube वीडियो देखें' : 'Watch YouTube Video')}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/70 border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF5E1]/80 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{isHindi ? 'कॉपी हो गया!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isHindi ? 'शेयर करें' : 'Share Link'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lazy Embedded YouTube Player (Only loads when user chooses) */}
          {showEmbedVideo && (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#D4AF37]/30 mt-3">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${song.youtubeId || song.videoId || song.id}?autoplay=1&rel=0`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>

        {/* Sacred Lyrics Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 text-[#D4AF37] font-bold text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{isHindi ? 'पावन बोल (Sacred Lyrics)' : 'Sacred Lyrics Snippet'}</span>
          </div>

          <div className="p-5 rounded-2xl bg-black/50 border border-[#D4AF37]/25 space-y-3">
            <p className="text-base md:text-lg font-serif font-semibold text-[#FFE5B4] leading-relaxed italic">
              "{song.lyricsSnippetHindi || song.lyricsHighlight || 'केलवा के पात पर उगेलन सुरुज देव झाँके-झुके...'}"
            </p>

            {(song.lyricsSnippetEnglish || !isHindi) && (
              <p className="text-xs md:text-sm text-[#FFF5E1]/70 font-sans italic border-t border-white/10 pt-2.5">
                "{song.lyricsSnippetEnglish || 'Upon the sacred banana leaves, Lord Surya arises with radiant morning grace...'}"
              </p>
            )}
          </div>
        </div>

        {/* Spiritual & Lyrical Meaning */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
            {isHindi ? 'आध्यात्मिक भावार्थ व संदेश' : 'Spiritual & Lyrical Meaning'}
          </span>
          <div className="p-4 rounded-xl bg-black/35 border border-[#D4AF37]/20 text-sm text-[#FFF5E1]/85 leading-relaxed">
            {song.meaning ||
              (isHindi
                ? 'छठ महापर्व की महिमा, सूर्यदेव व छठी मइया के प्रति अगाध श्रद्धा और लोक आस्था का पावन लोकगीत।'
                : 'A sacred folk hymn honoring Chhathi Maiya and Lord Surya with deep devotion during the Mahaparv of Chhath.')}
          </div>
        </div>

        {/* Cultural & Devotional Context */}
        {song.culturalContext && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सांस्कृतिक धरोहर व परंपरा' : 'Cultural Folk Heritage'}</span>
            </span>
            <p className="text-xs md:text-sm text-[#FFF5E1]/80 leading-relaxed bg-black/25 p-3.5 rounded-xl border border-white/5">
              {song.culturalContext}
            </p>
          </div>
        )}

        {/* Related Chhath Songs */}
        {relatedSongs.length > 0 && (
          <div className="pt-3 border-t border-[#D4AF37]/20 space-y-3">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              {isHindi ? 'संबंधित अन्य पावन छठ गीत' : 'Related Sacred Chhath Songs'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {relatedSongs.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelatedSong(rel)}
                  className="p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5 max-w-[85%]">
                    <span className="text-xs font-serif font-bold text-[#FFF5E1] group-hover:text-[#FFE5B4] line-clamp-1 block">
                      {rel.title}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] block">
                      {rel.singer || rel.artist}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]/60 group-hover:text-[#D4AF37] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
