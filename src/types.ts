export type GhatAtmosphere = 'dawn' | 'dusk';

export interface ChhathSong {
  id: string;
  title: string;
  artist: string;
  era: string;
  duration: string;
  youtubeId: string;
  lyricsHighlight: string;
  meaning: string;
  tag: string;
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
  ritualSummary: string;
  prasads: string[];
  significance: string;
  memories: string;
  iconType: 'bath' | 'kheer' | 'sunset' | 'sunrise';
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
