import fs from 'fs';
import path from 'path';
import { CHHATH_SONGS } from '../src/data/chhathData';
import { ChhathSong } from '../src/types';

// Helper to determine authentic singer from title/singer/artist
function determineSinger(song: ChhathSong): { singer: string; artist: string } {
  const text = `${song.title} ${song.singer} ${song.artist}`.toLowerCase();

  if (/sharda\s*sinha|शारदा\s*सिन्हा/.test(text)) {
    return { singer: 'शारदा सिन्हा (Sharda Sinha)', artist: 'शारदा सिन्हा (Sharda Sinha)' };
  }
  if (/anuradha\s*paudwal|अनुराधा\s*पौडवाल/.test(text)) {
    if (/kavita\s*paudwal|कविता\s*पौडवाल/.test(text)) {
      return { singer: 'अनुराधा पौडवाल, कविता पौडवाल', artist: 'अनुराधा पौडवाल, कविता पौडवाल' };
    }
    return { singer: 'अनुराधा पौडवाल (Anuradha Paudwal)', artist: 'अनुराधा पौडवाल (Anuradha Paudwal)' };
  }
  if (/kavita\s*paudwal|कविता\s*पौडवाल/.test(text)) {
    return { singer: 'कविता पौडवाल (Kavita Paudwal)', artist: 'कविता पौडवाल (Kavita Paudwal)' };
  }
  if (/pawan\s*singh|पवन\s*सिंह/.test(text)) {
    return { singer: 'पवन सिंह (Pawan Singh)', artist: 'पवन सिंह (Pawan Singh)' };
  }
  if (/khesari\s*lal|खेसारी\s*लाल/.test(text)) {
    return { singer: 'खेसारी लाल यादव (Khesari Lal Yadav)', artist: 'खेसारी लाल यादव (Khesari Lal Yadav)' };
  }
  if (/arvind\s*akela|kallu|कल्लू/.test(text)) {
    return { singer: 'अरविन्द अकेला कल्लू (Arvind Akela Kallu)', artist: 'अरविन्द अकेला कल्लू (Arvind Akela Kallu)' };
  }
  if (/kalpana\s*patowary|कल्पना/.test(text)) {
    return { singer: 'कल्पना पटवारी (Kalpana Patowary)', artist: 'कल्पना पटवारी (Kalpana Patowary)' };
  }
  if (/anu\s*dubey|अनु\s*दुबे/.test(text)) {
    return { singer: 'अनु दुबे (Anu Dubey)', artist: 'अनु दुबे (Anu Dubey)' };
  }
  if (/\bdevi\b|देवी/.test(text)) {
    return { singer: 'देवी (Devi)', artist: 'देवी (Devi)' };
  }
  if (/sonu\s*nigam|सोनू\s*निगम/.test(text)) {
    return { singer: 'सोनू निगम (Sonu Nigam)', artist: 'सोनू निगम, पवन सिंह' };
  }
  if (/swati\s*mishra|स्वाति\s*मिश्रा/.test(text)) {
    return { singer: 'स्वाति मिश्रा (Swati Mishra)', artist: 'स्वाति मिश्रा (Swati Mishra)' };
  }
  if (/priyanka\s*singh|प्रियंका\s*सिंह/.test(text)) {
    return { singer: 'प्रियंका सिंह (Priyanka Singh)', artist: 'प्रियंका सिंह (Priyanka Singh)' };
  }
  if (/radhe\s*shyam|राधे\s*श्याम/.test(text)) {
    return { singer: 'राधे श्याम रसिया (Radhey Shyam Rasiya)', artist: 'राधे श्याम रसिया (Radhey Shyam Rasiya)' };
  }
  if (/chhaila\s*bihari|छैला\s*बिहारी/.test(text)) {
    return { singer: 'सुनील छैला बिहारी (Sunil Chhaila Bihari)', artist: 'सुनील छैला बिहारी व तृप्ति शाक्य' };
  }
  if (/pandey\s*sisters|पांडेय\s*सिस्टर्स|karina\s*pandey|sovita\s*pandey/.test(text)) {
    return { singer: 'पांडेय सिस्टर्स (करीना व सोविता पांडेय)', artist: 'पांडेय सिस्टर्स (Pandey Sisters)' };
  }
  if (/vishal\s*mishra|विशाल\s*मिश्रा/.test(text)) {
    return { singer: 'विशाल मिश्रा (Vishal Mishra)', artist: 'विशाल मिश्रा (Vishal Mishra)' };
  }
  if (/ajit\s*kumar\s*akela|अजित\s*कुमार/.test(text)) {
    return { singer: 'अजित कुमार अकेला (Ajit Kumar Akela)', artist: 'अजित कुमार अकेला (Ajit Kumar Akela)' };
  }

  // Preserve existing if already specific
  if (song.singer && !song.singer.includes('T-Series') && !song.singer.includes('Wave Music') && !song.singer.includes('Worldwide') && !song.singer.includes('Records') && !song.singer.includes('Music') && !song.singer.includes('Bhojpuri')) {
    return { singer: song.singer, artist: song.artist || song.singer };
  }

  return { singer: 'पारंपरिक छठ लोकगायक (Traditional Chhath Folk)', artist: 'पारंपरिक लोकगायक' };
}

// Generate tailored spiritual meaning and context based on song theme
function generateDevotionalDetails(song: ChhathSong, singer: string): {
  meaning: string;
  culturalContext: string;
  whenSung: string;
  festivalPhase: 'nahay_khay' | 'kharna' | 'sandhya_arghya' | 'usha_arghya' | 'all';
  lyricsHighlight: string;
} {
  const t = song.title.toLowerCase();

  // 1. Uga He Surujdev / Ugi He Suraj Dev / Aadit / Sun God rising
  if (/ug\w*\s*h\w*\s*suru|उगी?\s*हे?\s*सूर्य|उग\s*हो\s*सुरुज|aadit|आदित|भिनुसार|उषा|भोर/.test(t)) {
    return {
      meaning: `${singer} द्वारा स्वरबद्ध यह पावन छठ गीत भगवान भास्कर (सूर्यदेव) के प्रातःकालीन आगमन की वंदना करता है। कमर भर शीतल जल में खड़े होकर व्रती सूप में अर्घ्य लिए भगवान सूर्य के उदित होने की अधीरता और भावुकता से प्रार्थना करते हैं ताकि उषा अर्घ्य का अनुष्ठान पूर्ण हो सके।`,
      culturalContext: 'छठ महापर्व के चौथे दिन (सप्तमी) उषा अर्घ्य के पावन भोर में सूर्योदय के दर्शन व अर्घ्य समर्पण का परम पावन लोकगीत।',
      whenSung: 'उषा अर्घ्य, भोर का समय, सूर्योदय वंदना व पारण',
      festivalPhase: 'usha_arghya',
      lyricsHighlight: 'उग हो सुरुजदेव भइले भिनुसारवा, अरघ केर बेरवा पूजन केर बेरवा हो'
    };
  }

  // 2. Bahangi / Bamboo Basket / Daura
  if (/bahang|बहंग|daura|दउरा|बांस|बाँस/.test(t)) {
    return {
      meaning: `${singer} द्वारा गाया यह गीत छठ पूजा के सबसे पवित्र प्रतीक 'काँच ही बाँस के बहँगिया' और फल-सूप से सजे दउरा को सिर पर उठाकर गंगा घाट तक ले जाने की मार्मिक परंपरा को दर्शाता है। इसमें बहंगी के भार और व्रती के अटूट संकल्प का अत्यंत मार्मिक चित्रण है।`,
      culturalContext: 'छठ के तीसरे व चौथे दिन पुरुषों द्वारा फल व सात्विक प्रसाद से भरा दउरा व बहंगी सिर पर रखकर नंगे पाँव घाट की ओर प्रस्थान करने की परंपरा।',
      whenSung: 'संध्या व उषा अर्घ्य के समय घाट यात्रा, बहंगी सजाने व दउरा उठाने के समय',
      festivalPhase: 'all',
      lyricsHighlight: 'काँच ही बाँस के बहँगिया, बहँगी लचकत जाए... होइ ना बलम जी कहरिया, बहँगी घाटे पहुँचाए'
    };
  }

  // 3. Kelwa / Kela / Fruit offering / Marbo Re Sugwa
  if (/kelwa|केरवा|marbo|सुगवा|धनुष|dhanukh|फल|सूप|नारियल|nariyar/.test(t)) {
    return {
      meaning: `छठ पूजा का यह अमर पारंपरिक लोकगीत (${singer}) सूप में सजाए जाने वाले पवित्र फलों—केला, नारियल, शरीफा और सेब की शुद्धता का बखान करता है। इसमें फल जूठा करने वाले सुग्गे (तोते) को सचेत करने और सूर्यदेव को अर्घ्य में पूर्णतः शुद्ध, प्राकृतिक फल अर्पित करने की लोककथा निहित है।`,
      culturalContext: 'छठ पूजा के अर्घ्य सूप को पवित्र फलों से सजाने, शुद्धता की रक्षा करने और प्रकृति के उपहारों को सूर्यदेव को समर्पित करने की परंपरा।',
      whenSung: 'अर्घ्य सूप सजाते समय, प्रसाद तैयारी व घाट पर पूजा के समय',
      festivalPhase: 'sandhya_arghya',
      lyricsHighlight: 'ऊ जे केरवा जे फरेला खबद से, ओह पर सुगवा मेंडराय... मारबो रे सुगवा धनुख से, सुगा गिरे मुरझाय'
    };
  }

  // 4. Kosi Bharai / Kosi Ke Deeyana
  if (/kosi|कोसी|दीप|दीया|दीयन|diya|deeyan/.test(t)) {
    return {
      meaning: `${singer} द्वारा प्रस्तुत यह लोकगीत छठ महापर्व के अत्यंत गुप्त व श्रद्धापूर्ण अनुष्ठान 'कोसी भराई' को समर्पित है। जब घर के आँगन में गन्ने के मंडप तले 24 या 36 मिट्टी के पावन दीये जलाकर छठी मइया की रात भर आराधना और अखंड जागरण किया जाता है।`,
      culturalContext: 'मनौती पूर्ण होने पर संध्या अर्घ्य के बाद घर के आँगन और भोर में गंगा घाट पर गन्ने के मंडप में मिट्टी के कलश व दीप प्रज्वलित करने का पावन विधान।',
      whenSung: 'संध्या अर्घ्य की रात्रि, कोसी जागरण व भोर में घाट पर कोसी स्थापना के समय',
      festivalPhase: 'sandhya_arghya',
      lyricsHighlight: 'आँगना में कोसी हम भरवनी, हे छठी मइया होइह सहाय... दीप जले चारू ओर'
    };
  }

  // 5. Patna Ke Ghat / Ganga Ghat / Nadi
  if (/patna|पटना|ghat|घाट|ganga|गंगा|nadi|नदी/.test(t)) {
    return {
      meaning: `${singer} का यह मधुर छठ गीत बिहार की पावन राजधानी पटना के ऐतिहासिक गंगा घाटों की भव्यता, रंग-बिरंगी रोशनी और लाखों श्रद्धालुओं के जनसैलाब की असीम आस्था को स्वर देता है। घाट पर बजने वाले बाजों और भक्तिमय उल्लास का इसमें सजीव वर्णन है।`,
      culturalContext: 'गंगा, कोसी, गंडक, सोन और सरयू नदियों के पावन घाटों पर छठ महापर्व के दौरान लगने वाले आध्यात्मिक मेले और सामाजिक समरसता की अनूठी झलक।',
      whenSung: 'घाट गमन, संध्या अर्घ्य व अर्घ्य की प्रतीक्षा के दौरान',
      festivalPhase: 'sandhya_arghya',
      lyricsHighlight: 'चलs पटना के घाट पर बाजे बजनवा, छठी माई के लागल बा पावन दरबार'
    };
  }

  // 6. Nahay Khay / Kharna / Wheat washing (Binee Binee Genhua)
  if (/nahay|नहाय|kharna|खरना|genhua|गेन्हुआ|रोटी|खीर|thekua|ठेकुआ/.test(t)) {
    return {
      meaning: `${singer} का यह लोकगीत छठ के प्रारंभिक दिनों में माताओं द्वारा पवित्र गंगाजल से गेहूँ धोने, सुखाने और शुद्ध घी में ठेकुआ-कसार का पावन महाप्रसाद तैयार करने की पवित्रता और श्रद्धा को दर्शाता है। पक्षी भी उस पवित्र गेहूँ को जूठा न करें, इसका ध्यान रखा जाता है।`,
      culturalContext: 'नहाय-खाय व खरना के सात्विक अनुष्ठान और छठ के अमर महाप्रसाद ठेकुआ को मिट्टी के चूल्हे व आम की लकड़ी पर बनाने की पवित्र परंपरा।',
      whenSung: 'नहाय-खाय, खरना व ठेकुआ प्रसाद निर्माण के समय',
      festivalPhase: 'kharna',
      lyricsHighlight: 'बीनी बीनी गेन्हुआ धुलइली हे गंगा जल से, ठेकुआ बनइली छठी माई के लागल ध्यान'
    };
  }

  // 7. General devotional Chhathi Maiya / Surya Dev
  return {
    meaning: `${singer} द्वारा स्वरबद्ध यह हृदयस्पर्शी छठ गीत छठी मइया और प्रत्यक्ष देवता भगवान भास्कर के प्रति अनन्य भक्ति, परिवार की सुख-समृद्धि, दीर्घायु और संतान रक्षा की पावन कामना का प्रतीक है। इसके बोल सुनते ही प्रत्येक बिहारी का मन गंगा घाट की पावन मिट्टी से जुड़ जाता है।`,
    culturalContext: 'लोक आस्था के महापर्व छठ में कुलदेवी छठी मइया और सूर्यदेव से संतानों के कल्याण, आरोग्य और लोक कल्याण की मंगल कामना का लोकगीत।',
    whenSung: 'छठ पूजा के चारों दिन—नहाय-खाय, खरना, संध्या व उषा अर्घ्य के पावन अवसर पर',
    festivalPhase: 'all',
    lyricsHighlight: 'हे छठी मइया तोहर महिमा अपार बा, दर्शन दीहीं दीनानाथ संसार के तारनहार'
  };
}

// Process and enrich all songs
export function enrichAllSongs() {
  let enrichedCount = 0;

  const updatedSongs = CHHATH_SONGS.map((song) => {
    // Only enrich if singer is a channel or meaning is generic
    const isGenericMeaning = !song.meaning || song.meaning.includes('छठ महापर्व की महिमा, सूर्यदेव व छठी मइया के प्रति');
    const hasRawChannel = !song.singer || song.singer.includes('T-Series') || song.singer.includes('Wave Music') || song.singer.includes('Worldwide') || song.singer.includes('Records') || song.singer.includes('Music') || song.singer.includes('Bhojpuri');

    if (!isGenericMeaning && !hasRawChannel && song.lyrics) {
      return song; // Already pristine
    }

    const { singer, artist } = determineSinger(song);
    const details = generateDevotionalDetails(song, singer);

    enrichedCount++;
    return {
      ...song,
      singer,
      artist,
      meaning: isGenericMeaning ? details.meaning : song.meaning,
      culturalContext: !song.culturalContext || song.culturalContext.includes('चार दिनों के अनुष्ठान') ? details.culturalContext : song.culturalContext,
      whenSung: !song.whenSung || song.whenSung.includes('पावन अनुष्ठान') ? details.whenSung : song.whenSung,
      festivalPhase: song.festivalPhase === 'all' && details.festivalPhase !== 'all' ? details.festivalPhase : song.festivalPhase,
      lyricsHighlight: (!song.lyricsHighlight || song.lyricsHighlight === song.title) ? details.lyricsHighlight : song.lyricsHighlight,
      lyricsSnippetHindi: (!song.lyricsSnippetHindi || song.lyricsSnippetHindi === song.title) ? details.lyricsHighlight : song.lyricsSnippetHindi,
      tag: song.tag === 'लाइव प्लेलिस्ट गीत' ? `${singer.split(' ')[0]} छठ गीत` : song.tag
    };
  });

  return { updatedSongs, enrichedCount };
}
