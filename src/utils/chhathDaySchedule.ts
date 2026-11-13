export type ChhathFestivalPhase =
  | 'before'
  | 'nahay_khay'
  | 'kharna'
  | 'sandhya_arghya'
  | 'usha_arghya'
  | 'concluded';

export interface ChhathDailyGreetingState {
  phase: ChhathFestivalPhase;
  isFestivalActive: boolean;
  dayNumber: 1 | 2 | 3 | 4 | null;
  dayNameHi: string;
  dayNameEn: string;
  dayTagHi: string;
  dayTagEn: string;
  greetingTitleHi: string;
  greetingTitleEn: string;
  greetingSubtextHi: string;
  greetingSubtextEn: string;
  ritualFocusHi: string;
  ritualFocusEn: string;
  dateDisplayHi: string;
  dateDisplayEn: string;
  nextTransitionLabelHi: string;
  nextTransitionLabelEn: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  istTimeFormatted: string;
  istShortTimeFormatted: string;
  istDateFormatted: string;
  shareGreetingText: string;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Exact 2026 Chhath Puja day boundaries anchored to 00:00:00 IST (UTC+5:30).
 * Day 1 (Nahay-Khay): 13 Nov 2026 00:00:00 IST = 2026-11-12T18:30:00.000Z
 * Day 2 (Kharna):     14 Nov 2026 00:00:00 IST = 2026-11-13T18:30:00.000Z
 * Day 3 (Sandhya):    15 Nov 2026 00:00:00 IST = 2026-11-14T18:30:00.000Z
 * Day 4 (Usha):       16 Nov 2026 00:00:00 IST = 2026-11-15T18:30:00.000Z
 * Concluded:          17 Nov 2026 00:00:00 IST = 2026-11-16T18:30:00.000Z
 */
export const FESTIVAL_BOUNDARIES_IST_MS = {
  nahayKhayStart: Date.UTC(2026, 10, 12, 18, 30, 0, 0),
  kharnaStart: Date.UTC(2026, 10, 13, 18, 30, 0, 0),
  sandhyaStart: Date.UTC(2026, 10, 14, 18, 30, 0, 0),
  ushaStart: Date.UTC(2026, 10, 15, 18, 30, 0, 0),
  festivalEnd: Date.UTC(2026, 10, 16, 18, 30, 0, 0),
};

export function formatISTClock(nowMs: number, includeSeconds = true): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {}),
      hour12: true,
    }).format(new Date(nowMs)) + ' IST';
  } catch {
    const shifted = new Date(nowMs + IST_OFFSET_MS);
    const h24 = shifted.getUTCHours();
    const m = String(shifted.getUTCMinutes()).padStart(2, '0');
    const s = String(shifted.getUTCSeconds()).padStart(2, '0');
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    return includeSeconds ? `${h12}:${m}:${s} ${ampm} IST` : `${h12}:${m} ${ampm} IST`;
  }
}

export function formatISTDate(nowMs: number): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(nowMs));
  } catch {
    const shifted = new Date(nowMs + IST_OFFSET_MS);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${shifted.getUTCDate()} ${months[shifted.getUTCMonth()]} ${shifted.getUTCFullYear()}`;
  }
}

function getRemainingParts(targetMs: number, nowMs: number) {
  const diffMs = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function getChhathDailyGreetingState(nowMs: number = Date.now()): ChhathDailyGreetingState {
  const istTimeFormatted = formatISTClock(nowMs, true);
  const istShortTimeFormatted = formatISTClock(nowMs, false);
  const istDateFormatted = formatISTDate(nowMs);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.chhathsong.in/';

  // 1. Before Chhath Puja 2026 starts
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.nahayKhayStart) {
    return {
      phase: 'before',
      isFestivalActive: false,
      dayNumber: null,
      dayNameHi: 'नहाय-खाय (शीघ्र प्रारंभ)',
      dayNameEn: 'Nahay Khay (Upcoming)',
      dayTagHi: 'कार्तिक छठ महापर्व २०२६ · १३–१६ नवंबर',
      dayTagEn: 'Kartik Chhath Mahaparv 2026 · 13–16 Nov',
      greetingTitleHi: 'छठ महापर्व २०२६ की मंगलमय शुभकामनाएँ!',
      greetingTitleEn: 'Warm Wishes Ahead of Chhath Mahaparv 2026!',
      greetingSubtextHi: '१३ नवंबर से नहाय-खाय के साथ लोक आस्था के चार दिवसीय महापर्व का पावन शुभारंभ होने जा रहा है।',
      greetingSubtextEn: 'The sacred four-day festival of Chhath begins on 13 November with Nahay-Khay. May Surya Dev bless your home.',
      ritualFocusHi: 'प्रथम दिवस नहाय-खाय १३ नवंबर को ०:०० बजे (IST) से प्रारंभ होगा',
      ritualFocusEn: 'Day 1 (Nahay-Khay) begins at 00:00 AM IST on 13 November',
      dateDisplayHi: '१३–१६ नवंबर २०२६',
      dateDisplayEn: '13–16 November 2026',
      nextTransitionLabelHi: 'नहाय-खाय प्रारंभ (00:00 IST) में शेष',
      nextTransitionLabelEn: 'Nahay-Khay begins at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.nahayKhayStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 लोक आस्था के महापर्व छठ पूजा २०२६ की हार्दिक शुभकामनाएँ!\n\nछठ महापर्व के पावन गीत, बोल (Lyrics) और विधि का अनुभव करें:\n${shareUrl}`,
    };
  }

  // 2. Day 1: Nahay Khay (13 Nov 2026 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.kharnaStart) {
    return {
      phase: 'nahay_khay',
      isFestivalActive: true,
      dayNumber: 1,
      dayNameHi: 'नहाय-खाय',
      dayNameEn: 'Nahay-Khay',
      dayTagHi: 'प्रथम दिवस (Day 1 of 4) · नहाय-खाय · १३ नवंबर २०२६',
      dayTagEn: 'Day 1 of 4 · Nahay-Khay · 13 Nov 2026',
      greetingTitleHi: 'नहाय-खाय की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Nahay-Khay! Blessed Day 1 of Chhath Puja',
      greetingSubtextHi: 'पवित्र स्नान, घर की सात्विक शुद्धि और कद्दू-भात प्रसाद के साथ चार दिवसीय छठ महापर्व के पावन शुभारंभ पर छठी मईया की असीम कृपा बनी रहे।',
      greetingSubtextEn: 'May the sacred river bath and pure Kaddu-Bhaat ritual bring peace, health, and Chhathi Maiya’s divine blessings to your family.',
      ritualFocusHi: 'आज का अनुष्ठान: पवित्र स्नान, सेंधा नमक व शुद्ध घी से निर्मित कद्दू-भात प्रसाद',
      ritualFocusEn: 'Today’s Ritual: Holy Bath & Satvik Kaddu-Bhaat Prasad with Chana Dal',
      dateDisplayHi: 'शुक्रवार, १३ नवंबर २०२६ · कार्तिक शुक्ल चतुर्थी',
      dateDisplayEn: 'Friday, 13 Nov 2026 · Kartik Shukla Chaturthi',
      nextTransitionLabelHi: 'द्वितीय दिवस (खरना) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 2 (Kharna) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.kharnaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 छठ महापर्व के प्रथम दिवस "नहाय-खाय" की हार्दिक शुभकामनाएँ!\n\nछठी मईया आपके परिवार को सुख, शांति और आरोग्य प्रदान करें। पावन छठ गीत व बोल सुनें:\n${shareUrl}`,
    };
  }

  // 3. Day 2: Kharna / Lohanda (14 Nov 2026 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.sandhyaStart) {
    return {
      phase: 'kharna',
      isFestivalActive: true,
      dayNumber: 2,
      dayNameHi: 'खरना / लोहंडा',
      dayNameEn: 'Kharna (Lohanda)',
      dayTagHi: 'द्वितीय दिवस (Day 2 of 4) · खरना · १४ नवंबर २०२६',
      dayTagEn: 'Day 2 of 4 · Kharna (Lohanda) · 14 Nov 2026',
      greetingTitleHi: 'पावन खरना (लोहंडा) की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Kharna! Blessed Day 2 of Chhath Puja',
      greetingSubtextHi: 'मिट्टी के चूल्हे पर आम की लकड़ी से बनी गुड़ की रसिया व रोटी के पावन भोग और ३६ घंटे के निर्जला व्रत के शुभारंभ की मंगलकामनाएँ।',
      greetingSubtextEn: 'Wishing every vrati spiritual strength and serenity as sacred jaggery Rasiya-Roti is offered and the 36-hour Nirjala fast begins.',
      ritualFocusHi: 'आज का अनुष्ठान: दिनभर उपवास, संध्या समय मौन पूजन एवं गुड़ की रसिया-रोटी प्रसाद',
      ritualFocusEn: 'Today’s Ritual: Clay-stove Jaggery Rasiya & Roti Offering at Sunset',
      dateDisplayHi: 'शनिवार, १४ नवंबर २०२६ · कार्तिक शुक्ल पंचमी',
      dateDisplayEn: 'Saturday, 14 Nov 2026 · Kartik Shukla Panchami',
      nextTransitionLabelHi: 'तृतीय दिवस (संध्या अर्घ्य) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 3 (Sandhya Arghya) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.sandhyaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 छठ महापर्व के द्वितीय दिवस "पावन खरना (लोहंडा)" की हार्दिक शुभकामनाएँ!\n\nमाँ छठी की कृपा से ३६ घंटे का निर्जला व्रत मंगलमय हो। अमर छठ गीत सुनें:\n${shareUrl}`,
    };
  }

  // 4. Day 3: Sandhya Arghya (15 Nov 2026 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.ushaStart) {
    return {
      phase: 'sandhya_arghya',
      isFestivalActive: true,
      dayNumber: 3,
      dayNameHi: 'संध्या अर्घ्य',
      dayNameEn: 'Sandhya Arghya',
      dayTagHi: 'तृतीय दिवस (Day 3 of 4) · संध्या अर्घ्य · १५ नवंबर २०२६',
      dayTagEn: 'Day 3 of 4 · Sandhya Arghya · 15 Nov 2026',
      greetingTitleHi: 'संध्या अर्घ्य की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Sandhya Arghya! Blessed Day 3 of Chhath Puja',
      greetingSubtextHi: 'अस्ताचलगामी भगवान सूर्यदेव को प्रथम अर्घ्य, बांस के दउरा-सूप पूजन व ठेकुआ महाप्रसाद अर्पण पर आपके जीवन में सुख-समृद्धि का उजियारा फैले।',
      greetingSubtextEn: 'Warmest blessings as families gather at glowing ghats with Daura, Soop, and Thekua to offer the first Arghya to the setting Sun God.',
      ritualFocusHi: 'आज का अनुष्ठान: डूबते सूर्य को संध्या अर्घ्य (लगभग 05:01 PM IST) व कोसी भराई',
      ritualFocusEn: 'Today’s Ritual: Dusk Offering to the Setting Sun (~05:01 PM IST) & Kosi',
      dateDisplayHi: 'रविवार, १५ नवंबर २०२६ · कार्तिक शुक्ल षष्ठी',
      dateDisplayEn: 'Sunday, 15 Nov 2026 · Kartik Shukla Shashthi',
      nextTransitionLabelHi: 'चतुर्थ दिवस (उषा अर्घ्य) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 4 (Usha Arghya) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.ushaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 छठ महापर्व के तृतीय दिवस "संध्या अर्घ्य" की हार्दिक शुभकामनाएँ!\n\nअस्ताचलगामी भगवान सूर्यदेव व छठी मईया आपके जीवन को सुख-समृद्धि से आलोकित करें:\n${shareUrl}`,
    };
  }

  // 5. Day 4: Usha Arghya & Paran (16 Nov 2026 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.festivalEnd) {
    return {
      phase: 'usha_arghya',
      isFestivalActive: true,
      dayNumber: 4,
      dayNameHi: 'उषा अर्घ्य व पारण',
      dayNameEn: 'Usha Arghya & Paran',
      dayTagHi: 'चतुर्थ दिवस (Day 4 of 4) · उषा अर्घ्य व पारण · १६ नवंबर २०२६',
      dayTagEn: 'Day 4 of 4 · Usha Arghya & Paran · 16 Nov 2026',
      greetingTitleHi: 'उषा अर्घ्य व पारण की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Usha Arghya & Paran! Blessed Day 4 of Chhath',
      greetingSubtextHi: 'उदीयमान भगवान भास्कर को भोर के पावन दुग्ध अर्घ्य एवं पारण के साथ छठी मईया आपकी समस्त मनोकामनाएँ पूर्ण करें और परिवार को दीर्घायु दें।',
      greetingSubtextEn: 'Saluting the rising dawn Sun! May the final morning Arghya and Paran bless your loved ones with health, joy, and fulfillment.',
      ritualFocusHi: 'आज का अनुष्ठान: उगते सूर्य को प्रातः अर्घ्य (लगभग 06:12 AM IST), पारण व ठेकुआ प्रसाद वितरण',
      ritualFocusEn: 'Today’s Ritual: Dawn Milk Arghya (~06:12 AM IST), Paran & Prasad',
      dateDisplayHi: 'सोमवार, १६ नवंबर २०२६ · कार्तिक शुक्ल सप्तमी',
      dateDisplayEn: 'Monday, 16 Nov 2026 · Kartik Shukla Saptami',
      nextTransitionLabelHi: 'महापर्व २०२६ समापन (00:00 IST) में शेष',
      nextTransitionLabelEn: 'Festival day concludes at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.festivalEnd, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 छठ महापर्व के चतुर्थ दिवस "उषा अर्घ्य व पारण" की हार्दिक शुभकामनाएँ!\n\nउगते सूर्यदेव और छठी मईया सबका कल्याण करें। जय छठी मईया!\n${shareUrl}`,
    };
  }

  // 6. Concluded (17 Nov 2026 onwards)
  return {
    phase: 'concluded',
    isFestivalActive: false,
    dayNumber: null,
    dayNameHi: 'छठ महापर्व २०२६ संपन्न',
    dayNameEn: 'Chhath Mahaparv 2026 Blessed',
    dayTagHi: 'लोक आस्था का महापर्व छठ · जय छठी मईया',
    dayTagEn: 'Chhath Mahaparv · Jai Chhathi Maiya',
    greetingTitleHi: 'जय छठी मईया • सूर्य देवाय नमः!',
    greetingTitleEn: 'Jai Chhathi Maiya • Eternal Blessings of Surya Dev!',
    greetingSubtextHi: 'छठ महापर्व २०२६ के पावन अनुष्ठान की मधुर स्मृतियों व अमर लोकगीतों के साथ छठी मईया की कृपा सदैव आपके परिवार पर बनी रहे।',
    greetingSubtextEn: 'May the grace of Chhathi Maiya and Lord Surya continue to illuminate your family all year long.',
    ritualFocusHi: 'सुनें १०६+ अमर छठ गीत, शारदा सिन्हा क्लासिक्स व संपूर्ण बोल',
    ritualFocusEn: 'Explore 106+ timeless Chhath songs, lyrics, and spiritual traditions',
    dateDisplayHi: 'छठ महापर्व २०२६',
    dateDisplayEn: 'Chhath Mahaparv 2026',
    nextTransitionLabelHi: 'जय छठी मईया · पावन भजन व स्मृतियाँ',
    nextTransitionLabelEn: 'Jai Chhathi Maiya · Timeless Hymns',
    countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    istTimeFormatted,
    istShortTimeFormatted,
    istDateFormatted,
    shareGreetingText: `🪔 जय छठी मईया! लोक आस्था के महापर्व छठ के १०६+ अमर गीत व सम्पूर्ण बोल सुनें:\n${shareUrl}`,
  };
}
