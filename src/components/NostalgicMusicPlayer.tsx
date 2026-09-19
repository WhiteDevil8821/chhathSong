import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  RotateCcw,
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
import { CHHATH_SONGS, EXCLUDED_SONG_IDS } from '../data/chhathData';
import { useLanguage } from '../context/LanguageContext';

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
  onPlayPauseToggle: (forceState?: boolean) => void;
  onSongsLoaded?: (songs: any[]) => void;
}

export const NostalgicMusicPlayer: React.FC<NostalgicMusicPlayerProps> = ({
  currentTrackIndex,
  onTrackChange,
  isPlaying,
  onPlayPauseToggle,
  onSongsLoaded
}) => {
  const { isHindi } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [progress, setProgress] = useState(0);
  const [liveTrackData, setLiveTrackData] = useState<{ title?: string; author?: string } | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<any[]>(CHHATH_SONGS);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Live');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

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

  // Track switching guard to prevent race conditions during track transitions
  const isSwitchingTrackRef = useRef<boolean>(false);
  const switchingTimeoutRef = useRef<any>(null);

  // The exact YouTube Playlist ID requested by user
  const playlistId = 'PLenw-C64yBCo';
  const playlistUrl = `https://youtube.com/playlist?list=${playlistId}`;

  const currentSong = playlistSongs[currentTrackIndex] || playlistSongs[0] || CHHATH_SONGS[0];

  // Helper to play a song by its video ID or playlist index
  const executePlayTrack = (trackIndex: number, autoPlay: boolean = true) => {
    const songs = playlistSongsRef.current;
    const song = songs[trackIndex] || songs[0] || CHHATH_SONGS[0];
    const videoId = song.youtubeId || song.videoId || song.id;

    if (switchingTimeoutRef.current) clearTimeout(switchingTimeoutRef.current);
    isSwitchingTrackRef.current = true;
    switchingTimeoutRef.current = setTimeout(() => {
      isSwitchingTrackRef.current = false;
    }, 1500);

    if (playerRef.current) {
      try {
        if (videoId && typeof playerRef.current.loadVideoById === 'function') {
          if (autoPlay) {
            playerRef.current.loadVideoById(videoId);
            if (typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          } else {
            playerRef.current.cueVideoById(videoId);
          }
        } else if (typeof playerRef.current.playVideoAt === 'function') {
          playerRef.current.playVideoAt(trackIndex);
        }
      } catch (e) {
        console.warn('Execute play track error:', e);
      }
    }
  };

  // Eagerly initialize YouTube Iframe API on mount so player is ready before user touches play
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || !playerContainerRef.current || playerRef.current) return;
      try {
        const firstSong = CHHATH_SONGS[0];
        const firstVideoId = firstSong?.youtubeId || firstSong?.id || '0fZt65tj6L8';

        playerRef.current = new window.YT.Player('yt-hidden-player', {
          height: '200',
          width: '200',
          videoId: firstVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            playsinline: 1,
            rel: 0
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              if (isMuted) event.target.mute();
              syncLiveTrackInfo(event.target);
              if (isPlayingRef.current) {
                executePlayTrack(currentTrackIndexRef.current, true);
              }
            },
            onStateChange: (event: any) => {
              syncLiveTrackInfo(event.target);
              // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
              if (event.data === 1) {
                isSwitchingTrackRef.current = false;
                if (!isPlayingRef.current) {
                  onPlayPauseToggle(true);
                }
              } else if (event.data === 2) {
                // Only register pause if we're not actively transitioning tracks
                if (!isSwitchingTrackRef.current && isPlayingRef.current) {
                  onPlayPauseToggle(false);
                }
              } else if (event.data === 0) {
                handleTrackEnded();
              }
            }
          }
        });
      } catch (err) {
        console.warn('YT Player init error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
      const existingCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof existingCallback === 'function') existingCallback();
        initPlayer();
      };
    }

    return () => {
      if (switchingTimeoutRef.current) clearTimeout(switchingTimeoutRef.current);
    };
  }, []);

  // Fetch live playlist tracks dynamically from backend API
  const fetchLivePlaylist = async () => {
    setIsLoadingSongs(true);
    let success = false;

    // Tier 1: Try full-stack Express API route
    try {
      const res = await fetch(`/api/playlist?list=${playlistId}&t=${Date.now()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && Array.isArray(data.songs) && data.songs.length > 0) {
          const seedSongMap = new Map(CHHATH_SONGS.map((s) => [s.id, s]));
          const baseSongs = CHHATH_SONGS.filter(
            (s) =>
              !EXCLUDED_SONG_IDS.has(s.id) &&
              !EXCLUDED_SONG_IDS.has(s.youtubeId || '') &&
              !s.title?.toLowerCase().includes('piya more banale khevaiya')
          );

          const filteredSongs = data.songs
            .filter(
              (s: any) =>
                !EXCLUDED_SONG_IDS.has(s.id) &&
                !EXCLUDED_SONG_IDS.has(s.videoId) &&
                !EXCLUDED_SONG_IDS.has(s.youtubeId) &&
                !s.title?.toLowerCase().includes('piya more banale khevaiya')
            )
            .map((s: any) => {
              const seed = seedSongMap.get(s.id) || seedSongMap.get(s.videoId) || seedSongMap.get(s.youtubeId);
              if (seed) {
                return {
                  ...s,
                  ...seed,
                  lyrics: seed.lyrics || s.lyrics,
                  lyricsHighlight: seed.lyricsHighlight || s.lyricsHighlight,
                  lyricsSnippetHindi: seed.lyricsSnippetHindi || s.lyricsSnippetHindi,
                  meaning: seed.meaning || s.meaning,
                  culturalContext: seed.culturalContext || s.culturalContext
                };
              }
              return s;
            });

          // Always ensure all 106 curated songs are retained!
          const liveIds = new Set(filteredSongs.map((s: any) => s.id || s.videoId || s.youtubeId));
          const missingBase = baseSongs.filter((s) => !liveIds.has(s.id) && !liveIds.has(s.youtubeId));
          const completePlaylist = [...filteredSongs, ...missingBase];

          setPlaylistSongs(completePlaylist);
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          if (onSongsLoaded) onSongsLoaded(completePlaylist);
          success = true;
        }
      }
    } catch (e) {
      console.warn('Backend API playlist fetch skipped, trying client fallback:', e);
    }

    // Tier 2: Direct public RSS2JSON syndication fallback
    if (!success) {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&t=${Date.now()}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
            const mappedSongs = data.items.map((item: any) => {
              const rawId = item.guid || item.link || '';
              const match = rawId.match(/video:([a-zA-Z0-9_-]+)/) || rawId.match(/[?&]v=([a-zA-Z0-9_-]+)/);
              const videoId = match ? match[1] : rawId.replace('yt:video:', '');
              return {
                id: videoId,
                videoId: videoId,
                youtubeId: videoId,
                title: item.title || 'छठ महापर्व गीत',
                artist: item.author || 'छठ महापर्व लोकगायक',
                tag: 'लाइव प्लेलिस्ट गीत',
                duration: 'Chhath Folk'
              };
            }).filter(
              (s: any) =>
                s.id &&
                s.title &&
                !EXCLUDED_SONG_IDS.has(s.id) &&
                !EXCLUDED_SONG_IDS.has(s.videoId) &&
                !s.title?.toLowerCase().includes('piya more banale khevaiya')
            );

            if (mappedSongs.length > 0) {
              const existingIds = new Set(mappedSongs.map((s: any) => s.id));
              const missingSeedSongs = CHHATH_SONGS.filter((s: any) => !existingIds.has(s.id));
              const fullPlaylist = [...mappedSongs, ...missingSeedSongs].filter(
                (s: any) =>
                  !EXCLUDED_SONG_IDS.has(s.id) &&
                  !EXCLUDED_SONG_IDS.has(s.videoId) &&
                  !s.title?.toLowerCase().includes('piya more banale khevaiya')
              );
              setPlaylistSongs(fullPlaylist);
              setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              if (onSongsLoaded) onSongsLoaded(fullPlaylist);
              success = true;
            }
          }
        }
      } catch (e) {
        console.warn('Client-side RSS2JSON fallback failed:', e);
      }
    }

    setIsLoadingSongs(false);
  };

  useEffect(() => {
    fetchLivePlaylist();
  }, []);

  // Synchronize track change in YouTube Player when currentTrackIndex changes externally
  const prevTrackIndexRef = useRef<number>(currentTrackIndex);
  useEffect(() => {
    if (prevTrackIndexRef.current !== currentTrackIndex) {
      prevTrackIndexRef.current = currentTrackIndex;
      if (isPlaying) {
        executePlayTrack(currentTrackIndex, true);
      }
    }
  }, [currentTrackIndex, isPlaying]);

  // Helper to extract live track information and update progress
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

  // Interval for updating progress and info when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current) {
          syncLiveTrackInfo(playerRef.current);
        }
      }, 500);
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
      handleReplay();
    } else if (currentMode === 'all') {
      // Repeat whole playlist / go to next
      handleNext();
    } else {
      // Repeat off: advance unless last song
      const total = playlistSongsRef.current.length || 1;
      if (currentTrackIndexRef.current < total - 1) {
        handleNext();
      } else {
        onPlayPauseToggle(false);
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

  // Replay current song from 0:00
  const handleReplay = () => {
    setProgress(0);
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0, true);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.warn('Replay error:', e);
      }
    }
    if (!isPlaying) {
      onPlayPauseToggle(true);
    }
  };

  // Direct 1-press Play / Pause toggle
  const togglePlay = () => {
    const nextPlayState = !isPlaying;
    if (playerRef.current) {
      try {
        if (nextPlayState) {
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          } else {
            executePlayTrack(currentTrackIndex, true);
          }
        } else {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        }
      } catch (e) {
        console.warn('YT player toggle error:', e);
      }
    } else {
      executePlayTrack(currentTrackIndex, true);
    }
    onPlayPauseToggle(nextPlayState);
  };

  // Next track with instant responsive playback
  const handleNext = () => {
    const total = playlistSongs.length || 1;
    const nextIndex = (currentTrackIndex + 1) % total;
    onTrackChange(nextIndex);
    setProgress(0);
    executePlayTrack(nextIndex, true);
    if (!isPlaying) onPlayPauseToggle(true);
  };

  // Previous track with instant responsive playback
  const handlePrev = () => {
    const total = playlistSongs.length || 1;
    const prevIndex = (currentTrackIndex - 1 + total) % total;
    onTrackChange(prevIndex);
    setProgress(0);
    executePlayTrack(prevIndex, true);
    if (!isPlaying) onPlayPauseToggle(true);
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
    executePlayTrack(idx, true);
    if (!isPlaying) onPlayPauseToggle(true);
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
                <h4 className="text-sm font-bold text-[#FFF5E1]">
                  {isHindi ? 'छठ महापर्व के अमर लोकगीत (Live YouTube Playlist)' : 'Immortal Chhath Hymns & Folk Melodies (Live Playlist)'}
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
                  <span>{isLoadingSongs ? (isHindi ? 'सिंक हो रहा है...' : 'Syncing...') : (isHindi ? 'लाइव रिफ्रेश' : 'Live Sync')}</span>
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
                      <span>{isHindi ? 'गीत दोहराएं (Repeat 1)' : 'Repeat 1 Song'}</span>
                    </>
                  ) : repeatMode === 'all' ? (
                    <>
                      <Repeat className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>{isHindi ? 'पूरी प्लेलिस्ट (Repeat All)' : 'Repeat All Songs'}</span>
                    </>
                  ) : (
                    <>
                      <Repeat className="w-3.5 h-3.5 opacity-50" />
                      <span>{isHindi ? 'लूप बंद (Repeat Off)' : 'Repeat Off'}</span>
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
                  <span>{showVideoEmbed ? (isHindi ? 'वीडियो छुपाएं' : 'Hide Video') : (isHindi ? 'YouTube वीडियो देखें' : 'Show Video')}</span>
                </button>

                {/* Direct External Link */}
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#E34234]/80 hover:bg-[#E34234] text-[11px] text-white flex items-center gap-1 font-bold shadow-sm transition-all"
                >
                  <span>{isHindi ? 'YouTube पर खोलें' : 'Open on YouTube'}</span>
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

      {/* Hidden YouTube Iframe for Background Playback - placed safely inside DOM viewport to prevent mobile power-saving throttling */}
      <div
        ref={playerContainerRef}
        className="fixed bottom-0 right-0 w-[2px] h-[2px] opacity-[0.01] pointer-events-none overflow-hidden z-[-1]"
        aria-hidden="true"
      >
        <div id="yt-hidden-player" />
      </div>

      {/* Main Glassmorphism Player Bar */}
      <div className="glass-player rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 border border-[#F28C28]/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Glow backdrop based on play state */}
        <div
          className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
            isPlaying ? 'bg-[#F28C28]/25 opacity-100' : 'bg-[#F28C28]/5 opacity-40'
          }`}
        />

        {/* Top Mini Progress Bar (Seekable) */}
        <div
          onClick={handleSeek}
          className="group relative w-full h-1.5 md:h-2 bg-black/60 rounded-full overflow-hidden cursor-pointer mb-2.5 sm:mb-3"
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
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-6">
          {/* Left: Track Info & Rotating Vinyl */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Spinning Golden Chakra / Disc */}
            <div className="relative shrink-0">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#4a1f0a] via-[#9B3D12] to-[#F28C28] border-2 border-[#F28C28] shadow-md flex items-center justify-center text-[#FFF5E1] font-bold cursor-pointer active:scale-90 transition-transform"
                onClick={togglePlay}
              >
                <Disc className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FFF5E1]" />
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
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-devanagari font-bold text-[#FFF5E1] truncate tracking-wide">
                  {liveTrackData?.title || currentSong.title}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-black/50 text-[#F28C28] border border-[#F28C28]/30 text-[10px] font-bold shrink-0">
                  {currentSong.tag || 'छठ महापर्व'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] md:text-xs text-[#FFF5E1]/70 truncate font-sans">
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
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5 shrink-0">
            {/* Audio Wave Visualizer Bars */}
            <div className="hidden lg:flex items-end gap-0.5 h-6 px-1.5">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [4, 16 + (i % 3) * 5, 6, 20, 4] }
                      : { height: 4 }
                  }
                  transition={{
                    duration: 0.8 + (i % 3) * 0.2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'easeInOut'
                  }}
                  className="w-1 bg-gradient-to-t from-[#9B3D12] to-[#F28C28] rounded-full"
                />
              ))}
            </div>

            {/* Replay / Restart Current Track from 0:00 */}
            <button
              id="music-replay-btn"
              onClick={handleReplay}
              className="p-2 sm:p-2.5 rounded-full text-[#FFF5E1]/70 hover:text-[#FFF5E1] hover:bg-black/30 active:scale-90 active:bg-[#F28C28]/20 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title={isHindi ? 'वर्तमान गीत शुरू से बजाएं (Replay from start)' : 'Replay from 0:00'}
            >
              <RotateCcw className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {/* Repeat Mode Button (Repeat 1 / Repeat All / Off) */}
            <button
              id="music-repeat-btn"
              onClick={cycleRepeatMode}
              className={`p-2 sm:p-2.5 rounded-full transition-all cursor-pointer relative min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-90 ${
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
                <Repeat1 className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#E34234]" />
              ) : (
                <Repeat className="w-4 h-4 md:w-4.5 md:h-4.5" />
              )}
            </button>

            {/* Prev Track */}
            <button
              id="music-prev-btn"
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-full text-[#FFF5E1] hover:text-[#F28C28] hover:bg-black/30 active:scale-90 active:bg-[#F28C28]/20 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title={isHindi ? 'पिछला गीत (Previous Track)' : 'Previous Track'}
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Play/Pause Main Button - Large 1-Tap Touch Target */}
            <button
              id="music-play-pause-btn"
              onClick={togglePlay}
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-gradient-to-tr from-[#F28C28] via-[#FFD700] to-[#9B3D12] text-[#2D1B0D] flex items-center justify-center shadow-lg shadow-black/60 hover:scale-105 active:scale-90 transition-all cursor-pointer border-2 border-[#FFF5E1]/80 shrink-0"
              title={isPlaying ? (isHindi ? 'रोकें (Pause)' : 'Pause') : (isHindi ? 'चलाएं (Play Sacred Melodies)' : 'Play')}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              id="music-next-btn"
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-full text-[#FFF5E1] hover:text-[#F28C28] hover:bg-black/30 active:scale-90 active:bg-[#F28C28]/20 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title={isHindi ? 'अगला गीत (Next Track)' : 'Next Track'}
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
          </div>

          {/* Right: Playlist Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 font-sans">
            <button
              id="music-playlist-toggle-btn"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 active:scale-90 min-h-[38px] ${
                showPlaylist
                  ? 'bg-[#F28C28]/30 border-[#F28C28] text-[#FFF5E1]'
                  : 'bg-black/40 border-[#F28C28]/30 text-[#F28C28] hover:bg-black/60'
              }`}
              title="View all Chhath songs & playlist"
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">{isHindi ? 'गीत माला' : 'Playlist'}</span>
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


