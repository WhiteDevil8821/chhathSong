import fs from 'fs';
import path from 'path';
import { CHHATH_SONGS } from '../src/data/chhathData';
import { LYRICS_DATABASE } from './populate-comprehensive-lyrics';

// Additional 3 songs researched
LYRICS_DATABASE['UfJPSi3fCUc'] = `सूरज के अम्मा उनका पैसे जगावे हो,
सूरज के अम्मा उनका पैसे जगावे हो।
उठा आदित्य बबुआ लहो अरगिया हो,
उठा आदित्य बबुआ लहो अरगिया हो।

निंदिया के मातल देव पलकों ना खोलें हो,
निंदिया के मातल देव पलको ना खोलें हो।

कत देर उगी है सुरुज मतवलवा हो?
कत देर उगी है आदित अलबिलवा हो?
कत देर उगी हैं...

निंदिया के मातल सुरुज खोले नाहीं अंखिया,
निंदिया के मातल सुरुज खोले नाहीं अंखिया।
कोढ़िया नयन ढ़ारे लोर हो,
कोढ़िया नयन ढ़ारे लोर हो।
लंगड़ा के माई रोवे पीटी पीटी छतिया,
लंगड़ा के माई रोवे पीटी पीटी छतिया।
कबले अइब आदित्य भइले भोर हो,
कबले अइब आदित्य भइले भोर हो।

निंदिया के मातल सुरुज खोले नाहीं अंखिया,
निंदिया के मातल सुरुज खोले नाहीं अंखिया।
बांझिनी नयन ढ़ारे लोर हो,
बांझिनी नयन ढ़ारे लोर हो।
अन्हरा के माई रोवे पीटी पीटी छतिया,
अन्हरा के माई रोवे पीटी पीटी छतिया।
कबले अइब आदित्य भइले भोर हो,
कबले अइब आदित्य भइले भोर हो।

निंदिया के मातल सुरुज खोले नाहीं अंखिया,
निंदिया के मातल सुरुज खोले नाहीं अंखिया।
दुखिया नयन ढ़ारे लोर हो,
दुखिया नयन ढ़ारे लोर हो।
बहिरा के माई रोवे पीटी पीटी छतिया,
कबले अइब आदित्य भइले भोर हो।

दोहरी कल सुपल के परती पुकारे हो,
दोहरी कल सुपल के भरती पुकारे हो।
उगना सुरूज देव लहना आरगिया हो,
उगला सूरज देव लहना आरगिया हो।
निंदिया के मातल देव पलको ना खोल हो...`;

LYRICS_DATABASE['aLbXQ9VIxKI'] = `आईल छठी के त्योहार, छके लागल घर द्वार
माई के महिमा अपार, लोगवा बोले जय जयकार

छठी माई के करब बरतिया भोरहरी में चार बजे
छठी माई के करब बरतिया भोरहरी में चार बजे
सईया लेके चलिहें माई के बहंगिया भोरहरी में चार बजे
सईया लेके चलिहें माई के बहंगिया भोरहरी में चार बजे

छठी माई के करब बरतिया भोरहरी में चार बजे
छठी माई के करब बरतिया भोरहरी में चार बजे
देवरू लेके चलिहें सिर पे दउरिया भोरहरी में चार बजे
देवरू लेके चलिहें सिर पे दउरिया भोरहरी में चार बजे

ऐ हो सखी तनी चुनरी लियवा, चुनरी लाके मां के ओढ़वा
मां के ओढ़ाके रूप सजवा, जिंगी आपन सफल बनवा
ऐ हो सखी तनी चुनरी लियवा, चुनरी लाके मां के ओढ़वा
मां के ओढ़ाके रूप सजवा, जिंगी आपन सफल बनवा!

सुना ऐ हमरी सजनीया, तू घर के लक्ष्मी नियानू हो
सुना ऐ हमरी सजनीया, तू घर के लक्ष्मी नियानू हो
छठी मईया के बैठें चरनिया, तऽ करी जा पुजनियानू हो
छठी मईया के बैठें चरनिया, तऽ करी जा पुजनियानू हो

ऐ हो सखी तनी कलशा लेयावा, कलशा गंगा जल से भरवा
काँच कसैली पान चढ़ावा, आवा घी के दीप जरावा
ऐ हो सखी तनी कलशा लेयावा, कलशा गंगा जल से भरवा
काँच कसैली पान चढ़ावा, आवा घी के दीप जरावा!

रची रची करबू आरतीया भोरहरी में चार बजे
रची रची करबू आरतीया भोरहरी में चार बजे...`;

LYRICS_DATABASE['aAnoW6E3M1o'] = `हे छठी मइया तोहर महिमा अपार बा,
दर्शन दीहीं दीनानाथ संसार के तारनहार।
हे छठी मइया तोहर महिमा अपार बा,
दर्शन दीहीं दीनानाथ संसार के तारनहार।

निर्मल मन से जे व्रत करे, ओकर दुःखवा बिसराए,
गोदी भरे बझिनिया के, कोढ़ी के काया सुधराए।
गंगा जी के तीरे-तीरे सजल बा घाट परम पुनीत,
बरतिया ठाढ़ जल बीच गावेली छठी माई के गीत।

हाथ जोरि विनय करीं, अरघिया लेईं स्वीकार,
हे छठी मइया तोहर महिमा अपार बा,
दर्शन दीहीं दीनानाथ संसार के तारनहार!`;

async function main() {
  const filePath = path.resolve(process.cwd(), 'src/data/chhathData.ts');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Preserve the rest of the file from NOSTALGIC_QUOTES
  const quotesIndex = fileContent.indexOf('export const NOSTALGIC_QUOTES: NostalgicQuote[] = [');
  if (quotesIndex === -1) {
    throw new Error('Could not find NOSTALGIC_QUOTES boundary');
  }
  const restOfFile = fileContent.substring(quotesIndex);

  // Update CHHATH_SONGS with lyrics
  let updatedCount = 0;
  const updatedSongs = CHHATH_SONGS.map(song => {
    const customLyrics = LYRICS_DATABASE[song.id];
    if (customLyrics && (!song.lyrics || song.lyrics.trim().length <= 100)) {
      updatedCount++;
      return {
        ...song,
        lyrics: customLyrics
      };
    }
    return song;
  });

  const header = `import { ChhathSong, NostalgicQuote, SacredDay, CulturalArtifact } from '../types';

// The verified sacred folk songs of Chhath Puja with authentic metadata and cultural context
export const CHHATH_SONGS: ChhathSong[] = `;

  const newFileContent = `${header}${JSON.stringify(updatedSongs, null, 2)};\n\n${restOfFile}`;
  fs.writeFileSync(filePath, newFileContent, 'utf8');

  console.log(`Successfully updated lyrics for ${updatedCount} songs!`);
  console.log(`Total songs in collection: ${updatedSongs.length}`);
  const withLyrics = updatedSongs.filter(s => s.lyrics && s.lyrics.trim().length > 100);
  console.log(`Songs with verified multi-stanza lyrics: ${withLyrics.length} / ${updatedSongs.length}`);
}

main().catch(console.error);
