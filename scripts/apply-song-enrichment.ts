import fs from 'fs';
import path from 'path';
import { enrichAllSongs } from './enrich-chhath-metadata';
import { NOSTALGIC_QUOTES, SACRED_DAYS, CULTURAL_ARTIFACTS, EXCLUDED_SONG_IDS } from '../src/data/chhathData';

const { updatedSongs, enrichedCount } = enrichAllSongs();

const targetPath = path.join(process.cwd(), 'src', 'data', 'chhathData.ts');

const fileHeader = `import { ChhathSong, NostalgicQuote, SacredDay, CulturalArtifact } from '../types';

// The verified sacred folk songs of Chhath Puja with authentic metadata and cultural context
export const CHHATH_SONGS: ChhathSong[] = `;

const songsJson = JSON.stringify(updatedSongs, null, 2);

const fileFooter = `;

export const NOSTALGIC_QUOTES: NostalgicQuote[] = ${JSON.stringify(NOSTALGIC_QUOTES, null, 2)};

export const SACRED_DAYS: SacredDay[] = ${JSON.stringify(SACRED_DAYS, null, 2)};

export const CULTURAL_ARTIFACTS: CulturalArtifact[] = ${JSON.stringify(CULTURAL_ARTIFACTS, null, 2)};

export const EXCLUDED_SONG_IDS = new Set<string>([
  'MyidNZdmxKQ' // Piya More Banale Khevaiya [Full Song] Kosi Ke Deeyana- Chhath Geet
]);
`;

fs.writeFileSync(targetPath, fileHeader + songsJson + fileFooter, 'utf-8');

console.log(`Successfully updated src/data/chhathData.ts! Enriched ${enrichedCount} songs.`);
