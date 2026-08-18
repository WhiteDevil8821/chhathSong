import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  ListMusic,
  Disc,
  ExternalLink,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Tv,
  RefreshCw,
  Radio
} from 'lucide-react';
import { ChhathSong } from '../types';
import { CHHATH_SONGS } from '../data/chhathData';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type RepeatMode = 'off' | 'all' | 'one';

interface NostalgicMusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
}

export const NostalgicMusicPlayer: React.FC<NostalgicMusicPlayerProps> = ({
  currentTrackIndex,
  onTrackChange,
  isPlaying,
  onPlayPauseToggle
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [progress, setProgress] = useState(0);
  const [liveTrackData, setLiveTrackData] = useState<{ title?: string; author?: string } | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<any[]>(CHHATH_SONGS);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Live');

  const playerRef = useRef<any>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  repeatModeRef.current = repeatMode;

  const currentTrackIndexRef = useRef<number>(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;

  const playlistSongsRef = useRef<any[]>(playlistSongs);
  playlistSongsRef.current = playlistSongs;

  // The exact YouTube Playlist ID requested by user
  const playlistId = 'PLenw-C64yBCo';
  const playlistUrl = `https://youtube.com/playlist?list=${playlistId}`;

  const currentSong = playlistSongs[currentTrackIndex] || playlistSongs[0] || CHHATH_SONGS[0];

  // Fetch live playlist tracks dynamically from backend API / YouTube feed
  const fetchLivePlaylist = async () => {
    setIsLoadingSongs(true);
    try {
      const res = await fetch(`/api/playlist?list=${playlistId}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.songs) && data.songs.length > 0) {
          setPlaylistSongs(data.songs);
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch dynamic playlist:', e);
    } finally {
      setIsLoadingSongs(false);
    }
  };

  useEffect(() => {
    fetchLivePlaylist();
  }, []);

  // Helper to extract live track information from YouTube Iframe and update progress
  const syncLiveTrackInfo = (player: any) => {
    if (!player) return;
    try {
      if (typeof player.getVideoData === 'function') {
        const data = player.getVideoData();
        if (data && (data.title || data.author)) {
          setLiveTrackData({
            title: data.title || '',
            author: data.author || ''
          });
        }
      }

      if (typeof player.getPlaylistIndex === 'function') {
        const pIdx = player.getPlaylistIndex();
        if (typeof pIdx === 'number' && pIdx >= 0 && pIdx !== currentTrackIndexRef.current) {
          onTrackChange(pIdx % (playlistSongsRef.current.length || 1));
        }
      }

      // Sync actual duration & current time for accurate seekbar
      if (typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const curr = player.getCurrentTime();
        const dur = player.getDuration();
        if (dur > 0 && typeof curr === 'number') {
          setProgress(Math.min(100, Math.max(0, (curr / dur) * 100)));
        }
      }
    } catch (e) {
      // Sandbox or restricted origin
    }
  };

  // Initialize YouTube Iframe API with the user's specific playlist once
  useEffect(() => {
    let interval: any;

    const setupYT = () => {
      if (window.YT && window.YT.Player && playerContainerRef.current) {
        if (!playerRef.current) {
          playerRef.current = new window.YT.Player('yt-hidden-player', {
            height: '200',
            width: '200',
            playerVars: {
              listType: 'playlist',
              list: playlistId,
              autoplay: 0,
              controls: 1,
              enablejsapi: 1,
              origin: window.location.origin,
              playsinline: 1,
              rel: 0
            },
            events: {
              onReady: (event: any) => {
                if (isMuted) event.target.mute();
                syncLiveTrackInfo(event.target);
                try {
                  if (typeof event.target.getPlaylist === 'function') {
                    const videoIds = event.target.getPlaylist();
                    if (Array.isArray(videoIds) && videoIds.length > 0) {
                      console.log('YouTube Player playlist ready:', videoIds.length);
                    }
                  }
                } catch (e) {}
              },
              onStateChange: (event: any) => {
                syncLiveTrackInfo(event.target);
                // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
                if (event.data === 1 && !isPlayingRef.current) {
                  onPlayPauseToggle();
                } else if (event.data === 2 && isPlayingRef.current) {
                  onPlayPauseToggle();
                } else if (event.data === 0) {
                  handleTrackEnded();
                }
              }
            }
          });
        }
      }
    };

    if (window.YT && window.YT.Player) {
      setupYT();
    } else {
      window.onYouTubeIframeAPIReady = setupYT;
    }

    return () => {};
  }, [playlistId]);

  // Interval for updating progress and info when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current) {
          syncLiveTrackInfo(playerRef.current);
        }
      }, 800);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle mute state toggle on the YouTube player
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isMuted && typeof playerRef.current.mute === 'function') {
          playerRef.current.mute();
        } else if (!isMuted && typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
        }
      } catch (e) {}
    }
  }, [isMuted]);

  // Handle when current track finishes playing
  const handleTrackEnded = () => {
    const currentMode = repeatModeRef.current;
    if (currentMode === 'one') {
      // Repeat the exact same song
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
      }
      setProgress(0);
    } else if (currentMode === 'all') {
      // Repeat whole playlist / go to next
      handleNext();
    } else {
      // Repeat off: advance unless last song
      const total = playlistSongsRef.current.length || 1;
      if (currentTrackIndexRef.current < total - 1) {
        handleNext();
      } else {
        if (isPlaying) onPlayPauseToggle();
      }
    }
  };

  // Toggle Repeat Mode between: 'all' -> 'one' -> 'off' -> 'all'
  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'all') return 'one';
      if (prev === 'one') return 'off';
      return 'all';
    });
  };

  // Sync state with YouTube player with immediate direct command execution
  const togglePlay = () => {
    if (playerRef.current) {
      try {
        if (isPlaying) {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        } else {
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          } else if (typeof playerRef.current.playVideoAt === 'function') {
            playerRef.current.playVideoAt(currentTrackIndex);
          }
        }
      } catch (e) {
        console.warn('YT player toggle error:', e);
      }
    }
    onPlayPauseToggle();
  };

  const handleNext = () => {
    const total = playlistSongs.length || 1;
    const nextIndex = (currentTrackIndex + 1) % total;
    onTrackChange(nextIndex);
    setProgress(0);
    if (!isPlaying) onPlayPauseToggle();
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.playVideoAt === 'function') {
          playerRef.current.playVideoAt(nextIndex);
        } else if (typeof playerRef.current.nextVideo === 'function') {
          playerRef.current.nextVideo();
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('Next track error:', e);
      }
    }
  };

  const handlePrev = () => {
    const total = playlistSongs.length || 1;
    const prevIndex = (currentTrackIndex - 1 + total) % total;
    onTrackChange(prevIndex);
    setProgress(0);
    if (!isPlaying) onPlayPauseToggle();
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.playVideoAt === 'function') {
          playerRef.current.playVideoAt(prevIndex);
        } else if (typeof playerRef.current.previousVideo === 'function') {
          playerRef.current.previousVideo();
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('Prev track error:', e);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newProgress = Math.max(0, Math.min(100, pos * 100));
    setProgress(newProgress);
    if (
      playerRef.current &&
      typeof playerRef.current.getDuration === 'function' &&
      typeof playerRef.current.seekTo === 'function'
    ) {
      try {
        const totalDuration = playerRef.current.getDuration();
        if (totalDuration > 0) {
          playerRef.current.seekTo(pos * totalDuration, true);
        }
      } catch (e) {}
    }
  };

  const handleSelectTrack = (idx: number) => {
    onTrackChange(idx);
    setProgress(0);
    if (playerRef.current && typeof playerRef.current.playVideoAt === 'function') {
      try {
        playerRef.current.playVideoAt(idx);
      } catch (e) {}
    }
    if (!isPlaying) onPlayPauseToggle();
  };

  return (
    <aside
      aria-label="Music Player"
      id="chhath-music-player"
      className="fixed bottom-3 inset-x-3 md:inset-x-6 z-40 max-w-5xl mx-auto select-none"
    >
      {/* Expandable Playlist & Live YouTube Video Embed Drawer */}
      <AnimatePresence>
        {(showPlaylist || showVideoEmbed) && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mb-2 rounded-2xl glass-player p-4 md:p-5 border border-[#F28C28]/40 overflow-hidden shadow-2xl font-sans"
          >
            {/* Header with Title, Live Sync button, Repeat Selector and YouTube Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F28C28]/25">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#F28C28]" />
                <h4 className="text-sm font-devanagari font-bold text-[#FFF5E1]">
                  छठ महापर्व के अमर लोकगीत (Live YouTube Playlist)
                </h4>
                <span className="text-[11px] text-[#F28C28] bg-black/40 px-2 py-0.5 rounded-full border border-[#F28C28]/30 font-mono">
                  {playlistSongs.length} Songs
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Refresh / Live Sync Button */}
                <button
                  onClick={fetchLivePlaylist}
                  disabled={isLoadingSongs}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-[#FFF5E1]/90 border border-[#F28C28]/30 transition-all cursor-pointer"
                  title="Sync with latest YouTube playlist updates"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSongs ? 'animate-spin text-[#F28C28]' : ''}`} />
                  <span>{isLoadingSongs ? 'सिंक हो रहा है...' : 'लाइव रिफ्रेश'}</span>
                </button>

                {/* Repeat Mode Quick Selector inside drawer */}
                <button
                  onClick={cycleRepeatMode}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    repeatMode === 'one'
                      ? 'bg-[#E34234]/80 text-white border-[#E34234]'
                      : repeatMode === 'all'
                      ? 'bg-[#F28C28]/25 text-[#FFF5E1] border-[#F28C28]'
                      : 'bg-black/40 text-[#FFF5E1]/60 border-white/10'
                  }`}
                  title="Toggle Repeat: Repeat 1 Song, Repeat Whole Playlist, or Off"
                >
                  {repeatMode === 'one' ? (
                    <>
                      <Repeat1 className="w-3.5 h-3.5 text-white" />
                      <span>गीत दोहराएं (Repeat 1)</span>
                    </>
                  ) : repeatMode === 'all' ? (
                    <>
                      <Repeat className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>पूरी प्लेलिस्ट (Repeat All)</span>
                    </>
                  ) : (
                    <>
                      <Repeat className="w-3.5 h-3.5 opacity-50" />
                      <span>लूप बंद (Repeat Off)</span>
                    </>
                  )}
                </button>

                {/* Toggle YouTube Video Frame */}
                <button
                  onClick={() => setShowVideoEmbed(!showVideoEmbed)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    showVideoEmbed
                      ? 'bg-[#F28C28] text-[#2D1B0D] font-bold'
                      : 'bg-black/40 text-[#FFF5E1]/80 hover:text-white border border-[#F28C28]/30'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>{showVideoEmbed ? 'Hide Video' : 'Show YouTube Video'}</span>
                </button>

                {/* Direct External Link */}
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#E34234]/80 hover:bg-[#E34234] text-[11px] text-white flex items-center gap-1 font-bold shadow-sm transition-all"
                >
                  <span>YouTube पर खोलें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Live Interactive YouTube Video Embed Frame (Plays the exact playlist) */}
            {showVideoEmbed && (
              <div className="mt-3 mb-4 rounded-xl overflow-hidden border border-[#F28C28]/50 shadow-xl bg-black aspect-video max-w-xl mx-auto">
                <iframe
                  id="yt-embed-iframe"
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&enablejsapi=1&autoplay=${
                    isPlaying ? 1 : 0
                  }&rel=0`}
                  title="Chhath Songs YouTube Playlist"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Song Items List dynamically loaded from YouTube playlist - Scrollable with max 6 visible in 1 view */}
            <div className="flex flex-col gap-1.5 mt-3 max-h-[340px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#F28C28]/40 scrollbar-track-black/20">
              {playlistSongs.map((song, idx) => (
                <button
                  key={song.id || song.videoId || idx}
                  onClick={() => handleSelectTrack(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer min-h-[50px] shrink-0 ${
                    currentTrackIndex === idx
                      ? 'bg-[#F28C28]/25 border border-[#F28C28]/70 text-[#FFF5E1] shadow-md'
                      : 'hover:bg-black/40 bg-black/20 border border-[#F28C28]/10 text-[#FFF5E1]/75'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden min-w-0 pr-2">
                    <span className="text-xs font-mono text-[#F28C28] font-bold w-5 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate min-w-0">
                      <div className="text-xs md:text-sm font-devanagari font-semibold text-[#FFF5E1] truncate">
                        {song.title}
                      </div>
                      <div className="text-[10px] text-[#FFF5E1]/60 truncate">
                        {song.artist} {song.tag ? `• ${song.tag}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#F28C28] shrink-0 ml-2">
                    {song.duration || 'Chhath Folk'}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden YouTube Iframe for Background Playback - placed offscreen to prevent mobile browser throttling */}
      <div
        ref={playerContainerRef}
        className="fixed -left-[9999px] -top-[9999px] w-[200px] h-[200px] pointer-events-none opacity-0 overflow-hidden"
        aria-hidden="true"
      >
        <div id="yt-hidden-player" />
      </div>

      {/* Main Glassmorphism Player Bar */}
      <div className="glass-player rounded-2xl md:rounded-3xl p-3 md:p-4 border border-[#F28C28]/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Glow backdrop based on play state */}
        <div
          className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
            isPlaying ? 'bg-[#F28C28]/25 opacity-100' : 'bg-[#F28C28]/5 opacity-40'
          }`}
        />

        {/* Top Mini Progress Bar (Seekable) */}
        <div
          onClick={handleSeek}
          className="group relative w-full h-1.5 md:h-2 bg-black/60 rounded-full overflow-hidden cursor-pointer mb-3"
          title="Seek playback"
        >
          <div
            className="h-full bg-gradient-to-r from-[#9B3D12] via-[#F28C28] to-[#FFD700] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Player Controls Grid */}
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Left: Track Info & Rotating Vinyl */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Spinning Golden Chakra / Disc */}
            <div className="relative shrink-0">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#4a1f0a] via-[#9B3D12] to-[#F28C28] border-2 border-[#F28C28] shadow-md flex items-center justify-center text-[#FFF5E1] font-bold cursor-pointer"
                onClick={togglePlay}
              >
                <Disc className="w-6 h-6 md:w-7 md:h-7 text-[#FFF5E1]" />
              </motion.div>
              {isPlaying && (
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28C28] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F28C28]"></span>
                </span>
              )}
            </div>

            {/* Title, Artist, Lyrics Highlight */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-devanagari font-bold text-[#FFF5E1] truncate tracking-wide">
                  {liveTrackData?.title || currentSong.title}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-black/50 text-[#F28C28] border border-[#F28C28]/30 text-[10px] font-bold shrink-0">
                  {currentSong.tag || 'छठ महापर्व'}
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-[#FFF5E1]/70 truncate font-sans">
                {liveTrackData?.author || currentSong.artist}
              </p>
              {/* Lyrics Snippet on larger screens */}
              {currentSong.lyricsHighlight && (
                <p className="text-[10px] text-[#F28C28]/80 italic truncate hidden lg:block font-folk">
                  "{currentSong.lyricsHighlight}"
                </p>
              )}
            </div>
          </div>

          {/* Center: Audio Reactive Visualizer & Playback Controls */}
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            {/* Audio Wave Visualizer Bars */}
            <div className="hidden sm:flex items-end gap-0.5 h-6 px-2">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [4, 18 + (i % 3) * 6, 8, 22, 6] }
                      : { height: 4 }
                  }
                  transition={{
                    duration: 0.8 + (i % 4) * 0.2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                  className="w-1 bg-gradient-to-t from-[#9B3D12] to-[#F28C28] rounded-full"
                />
              ))}
            </div>

            {/* Repeat Mode Button */}
            <button
              id="music-repeat-btn"
              onClick={cycleRepeatMode}
              className={`p-2 rounded-full transition-all cursor-pointer relative ${
                repeatMode === 'one'
                  ? 'bg-[#E34234]/30 text-[#E34234] border border-[#E34234]'
                  : repeatMode === 'all'
                  ? 'bg-[#F28C28]/25 text-[#F28C28] border border-[#F28C28]/60'
                  : 'text-[#FFF5E1]/50 hover:text-[#FFF5E1] hover:bg-black/30'
              }`}
              title={
                repeatMode === 'one'
                  ? 'Repeat 1 Song (वर्तमान गीत दोहराएं - Active)'
                  : repeatMode === 'all'
                  ? 'Repeat Whole Playlist (पूरी प्लेलिस्ट दोहराएं - Active)'
                  : 'Repeat Off (दोहराव बंद)'
              }
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4 md:w-5 md:h-5 text-[#E34234]" />
              ) : (
                <Repeat className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Prev Track */}
            <button
              id="music-prev-btn"
              onClick={handlePrev}
              className="p-2 rounded-full text-[#FFF5E1] hover:text-[#F28C28] hover:bg-black/30 transition-all cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Play/Pause Main Button */}
            <button
              id="music-play-pause-btn"
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#F28C28] via-[#FFD700] to-[#9B3D12] text-[#2D1B0D] flex items-center justify-center shadow-lg shadow-black/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#FFF5E1]/70"
              title={isPlaying ? 'Pause' : 'Play Sacred Melodies'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              id="music-next-btn"
              onClick={handleNext}
              className="p-2 rounded-full text-[#FFF5E1] hover:text-[#F28C28] hover:bg-black/30 transition-all cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Right: Playlist Toggle & YouTube Video Toggle */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0 font-sans">
            <button
              id="music-playlist-toggle-btn"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                showPlaylist
                  ? 'bg-[#F28C28]/30 border-[#F28C28] text-[#FFF5E1]'
                  : 'bg-black/40 border-[#F28C28]/30 text-[#F28C28] hover:bg-black/60'
              }`}
              title="View all Chhath songs & playlist"
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-xs font-bold hidden md:inline">गीत माला</span>
              {showPlaylist ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};


