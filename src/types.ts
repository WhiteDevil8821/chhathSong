export type GhatAtmosphere = 'dawn' | 'dusk';

export type SongCategory = 
  | 'all'
  | 'sharda_sinha'
  | 'morning_arghya'
  | 'evening_arghya'
  | 'traditional'
  | 'bhojpuri_folk'
  | 'nahay_khay_kharna';

export interface ChhathSong {
  id: string;
  title: string;
  artist: string;
  singer?: string;
  era?: string;
  duration: string;
  youtubeId: string;
  lyricsHighlight: string;
  lyricsSnippetHindi?: string;
  lyricsSnippetEnglish?: string;
  lyrics?: string;
  meaning: string;
  tag: string;
  category?: SongCategory;
  culturalContext?: string;
  whenSung?: string;
  relatedSongIds?: string[];
  festivalPhase?: 'nahay_khay' | 'kharna' | 'sandhya_arghya' | 'usha_arghya' | 'all';
}

export interface NostalgicQuote {
  id: string;
  quoteDevanagari: string;
  context: string;
  translation: string;
  authorOrFolk: string;
  emotion: 'devotion' | 'childhood' | 'journey' | 'unity';
}

export interface SacredDay {
  dayNumber: number;
  hindiName: string;
  englishName: string;
  tithi: string;
  date2026: string;
  gregorianDate2026: string;
  ritualSummary: string;
  prasads: string[];
  significance: string;
  memories: string;
  iconType: 'bath' | 'kheer' | 'sunset' | 'sunrise';
  associatedRituals: string[];
  arghyaTimeHint?: string;
}

export interface CulturalArtifact {
  id: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  description: string;
  materials: string;
  symbolism: string;
  childhoodMemory: string;
  badge: string;
}

export interface FloatingDiya {
  id: number;
  x: number; // percentage 0 - 100
  y: number; // percentage in river section
  speed: number;
  lit: boolean;
  wish?: string;
  size: number;
}

export interface ChhathCountdownStatus {
  status: 'before' | 'nahay_khay' | 'kharna' | 'sandhya_arghya' | 'usha_arghya' | 'concluded';
  currentDayNameHindi: string;
  currentDayNameEnglish: string;
  currentDayNumber: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedTimeIST: string;
  nextEventTitle: string;
  nextEventDate: string;
}

