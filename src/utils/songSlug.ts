import { CHHATH_SONGS } from '../data/chhathData';
import { ChhathSong } from '../types';

/**
 * Normalizes text to a clean, URL-safe slug.
 * Supports Devanagari and Latin characters while stripping emojis, punctuation, and duplicate hyphens.
 */
export function slugifyTitle(text: string): string {
  return text
    .normalize('NFC')
    // Remove emojis & special pictographic symbols
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Replace non-alphanumeric punctuation, pipes, brackets, quotes, hashtags with space
    .replace(/[#|•\-_:\/\(\)\[\]!,?."\x27\u2018\u2019\u201C\u201D\u0964\u0965@+*&%~^=<>`]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Returns a stable, deterministic slug for any ChhathSong.
 */
export function getSongSlug(song: Pick<ChhathSong, 'id' | 'title'>): string {
  const base = slugifyTitle(song.title);
  if (!base || base.length < 2) {
    return `chhath-geet-${song.id}`;
  }
  return base;
}

/**
 * Returns the canonical path for a song (/songs/<slug>).
 */
export function getSongPath(song: Pick<ChhathSong, 'id' | 'title'>): string {
  return `/songs/${getSongSlug(song)}`;
}

/**
 * Returns the absolute canonical URL for a song.
 */
export function getSongCanonicalUrl(song: Pick<ChhathSong, 'id' | 'title'>): string {
  return `https://www.chhathsong.in/songs/${getSongSlug(song)}`;
}

// Build precomputed lookups for instant, O(1) slug and ID resolution
const slugToSongMap = new Map<string, ChhathSong>();
const idToSongMap = new Map<string, ChhathSong>();

CHHATH_SONGS.forEach((song) => {
  const slug = getSongSlug(song);
  slugToSongMap.set(slug, song);
  slugToSongMap.set(encodeURIComponent(slug), song);
  slugToSongMap.set(decodeURIComponent(slug), song);
  idToSongMap.set(song.id, song);
  if (song.youtubeId) {
    idToSongMap.set(song.youtubeId, song);
  }
});

/**
 * Finds a song by slug or ID with fallback to custom song lists.
 */
export function findSongBySlug(slugOrId: string, customList?: ChhathSong[]): ChhathSong | undefined {
  if (!slugOrId) return undefined;

  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();

  // 1. Direct match in static lookup map
  if (slugToSongMap.has(decoded)) {
    return slugToSongMap.get(decoded);
  }

  // 2. Direct match by ID
  if (idToSongMap.has(slugOrId)) {
    return idToSongMap.get(slugOrId);
  }

  // 3. Search in custom song list if provided
  const list = customList || CHHATH_SONGS;
  const match = list.find((s) => {
    const sSlug = getSongSlug(s).toLowerCase();
    return sSlug === decoded || s.id === slugOrId || s.youtubeId === slugOrId;
  });

  return match;
}

/**
 * Returns all stable slugs for the 107 songs.
 */
export function getAllSongSlugs(): Array<{ song: ChhathSong; slug: string }> {
  return CHHATH_SONGS.map((song) => ({
    song,
    slug: getSongSlug(song),
  }));
}
