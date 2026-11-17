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
 * Exact Chaiti Chhath 2027 day boundaries anchored to 00:00:00 IST (UTC+5:30).
 * Day 1 (Nahay-Khay):     Sat 10 Apr 2027 00:00:00 IST = 2027-04-09T18:30:00.000Z
 * Day 2 (Lohanda/Kharna): Sun 11 Apr 2027 00:00:00 IST = 2027-04-10T18:30:00.000Z
 * Day 3 (Sandhya Arghya): Mon 12 Apr 2027 00:00:00 IST = 2027-04-11T18:30:00.000Z
 * Day 4 (Usha Arghya):    Tue 13 Apr 2027 00:00:00 IST = 2027-04-12T18:30:00.000Z
 * Concluded:              Wed 14 Apr 2027 00:00:00 IST = 2027-04-13T18:30:00.000Z
 */
export const FESTIVAL_BOUNDARIES_IST_MS = {
  nahayKhayStart: Date.UTC(2027, 3, 9, 18, 30, 0, 0),
  kharnaStart: Date.UTC(2027, 3, 10, 18, 30, 0, 0),
  sandhyaStart: Date.UTC(2027, 3, 11, 18, 30, 0, 0),
  ushaStart: Date.UTC(2027, 3, 12, 18, 30, 0, 0),
  festivalEnd: Date.UTC(2027, 3, 13, 18, 30, 0, 0),
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

  // 1. Countdown to Chaiti Chhath 2027
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.nahayKhayStart) {
    return {
      phase: 'before',
      isFestivalActive: false,
      dayNumber: null,
      dayNameHi: 'चैती छठ २०२७ (नहाय-खाय: १० अप्रैल)',
      dayNameEn: 'Chaiti Chhath 2027 (Starts 10 Apr)',
      dayTagHi: 'आगामी महापर्व · चैती छठ २०२७ · १०–१३ अप्रैल',
      dayTagEn: 'Next Mahaparv · Chaiti Chhath 2027 · 10–13 Apr',
      greetingTitleHi: 'चैती छठ महापर्व २०२७ की अग्रिम शुभकामनाएँ!',
      greetingTitleEn: 'Countdown to Chaiti Chhath Mahaparv 2027!',
      greetingSubtextHi: '१० अप्रैल २०२७ (नहाय-खाय) से १३ अप्रैल २०२७ (उषा अर्घ्य व पारण) तक चैती छठ महापर्व मनाया जाएगा। तब तक अमर छठ गीतों व भक्ति में लीन रहें।',
      greetingSubtextEn: 'Chaiti Chhath 2027 begins on 10 April (Nahay-Khay) through 13 April (Usha Arghya & Paran). Immerse yourself in timeless Chhath hymns meanwhile.',
      ritualFocusHi: 'तिथियां: १० अप्रैल नहाय-खाय · ११ अप्रैल खरना · १२ अप्रैल संध्या अर्घ्य · १३ अप्रैल उषा अर्घ्य',
      ritualFocusEn: 'Schedule: 10 Apr Nahay-Khay · 11 Apr Kharna · 12 Apr Sandhya · 13 Apr Usha Arghya',
      dateDisplayHi: '१०–१३ अप्रैल २०२७ · चैत्र शुक्ल पक्ष',
      dateDisplayEn: '10–13 April 2027 · Chaitra Shukla Paksha',
      nextTransitionLabelHi: 'चैती छठ २०२७ (नहाय-खाय) प्रारंभ में शेष',
      nextTransitionLabelEn: 'Chaiti Chhath 2027 (Nahay-Khay) in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.nahayKhayStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 आगामी लोक आस्था के महापर्व "चैती छठ २०२७" (१०–१३ अप्रैल २०२७) की मंगलमय शुभकामनाएँ!\n\nअमर छठ गीत व सम्पूर्ण बोल सुनें:\n${shareUrl}`,
    };
  }

  // 2. Day 1: Nahay Khay (Sat 10 Apr 2027 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.kharnaStart) {
    return {
      phase: 'nahay_khay',
      isFestivalActive: true,
      dayNumber: 1,
      dayNameHi: 'नहाय-खाय',
      dayNameEn: 'Nahay-Khay',
      dayTagHi: 'प्रथम दिवस (Day 1 of 4) · नहाय-खाय · १० अप्रैल २०२७',
      dayTagEn: 'Day 1 of 4 · Nahay-Khay · 10 Apr 2027',
      greetingTitleHi: 'चैती छठ नहाय-खाय की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Nahay-Khay! Blessed Day 1 of Chaiti Chhath 2027',
      greetingSubtextHi: 'पवित्र स्नान, घर की सात्विक शुद्धि और कद्दू-भात प्रसाद के साथ चैती छठ महापर्व के पावन शुभारंभ पर छठी मईया की असीम कृपा बनी रहे।',
      greetingSubtextEn: 'May the sacred river bath and pure Kaddu-Bhaat ritual bring peace, health, and Chhathi Maiya’s divine blessings to your family.',
      ritualFocusHi: 'आज का अनुष्ठान: पवित्र स्नान, सेंधा नमक व शुद्ध घी से निर्मित कद्दू-भात प्रसाद',
      ritualFocusEn: 'Today’s Ritual: Holy Bath & Satvik Kaddu-Bhaat Prasad with Chana Dal',
      dateDisplayHi: 'शनिवार, १० अप्रैल २०२७ · चैत्र शुक्ल चतुर्थी',
      dateDisplayEn: 'Saturday, 10 Apr 2027 · Chaitra Shukla Chaturthi',
      nextTransitionLabelHi: 'द्वितीय दिवस (लोहंडा व खरना) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 2 (Lohanda & Kharna) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.kharnaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 चैती छठ महापर्व के प्रथम दिवस "नहाय-खाय" की हार्दिक शुभकामनाएँ!\n\nछठी मईया आपके परिवार को सुख, शांति और आरोग्य प्रदान करें। पावन छठ गीत व बोल सुनें:\n${shareUrl}`,
    };
  }

  // 3. Day 2: Lohanda & Kharna (Sun 11 Apr 2027 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.sandhyaStart) {
    return {
      phase: 'kharna',
      isFestivalActive: true,
      dayNumber: 2,
      dayNameHi: 'लोहंडा और खरना',
      dayNameEn: 'Lohanda & Kharna',
      dayTagHi: 'द्वितीय दिवस (Day 2 of 4) · लोहंडा व खरना · ११ अप्रैल २०२७',
      dayTagEn: 'Day 2 of 4 · Lohanda & Kharna · 11 Apr 2027',
      greetingTitleHi: 'पावन लोहंडा और खरना की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Lohanda & Kharna! Blessed Day 2 of Chaiti Chhath',
      greetingSubtextHi: 'मिट्टी के चूल्हे पर आम की लकड़ी से बनी गुड़ की रसिया व रोटी के पावन भोग और ३६ घंटे के निर्जला व्रत के शुभारंभ की मंगलकामनाएँ।',
      greetingSubtextEn: 'Wishing every vrati spiritual strength and serenity as sacred jaggery Rasiya-Roti is offered and the 36-hour Nirjala fast begins.',
      ritualFocusHi: 'आज का अनुष्ठान: दिनभर उपवास, संध्या समय मौन पूजन एवं गुड़ की रसिया-रोटी प्रसाद',
      ritualFocusEn: 'Today’s Ritual: Clay-stove Jaggery Rasiya & Roti Offering at Sunset',
      dateDisplayHi: 'रविवार, ११ अप्रैल २०२७ · चैत्र शुक्ल पंचमी',
      dateDisplayEn: 'Sunday, 11 Apr 2027 · Chaitra Shukla Panchami',
      nextTransitionLabelHi: 'तृतीय दिवस (संध्या अर्घ्य) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 3 (Sandhya Arghya) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.sandhyaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 चैती छठ महापर्व के द्वितीय दिवस "पावन लोहंडा और खरना" की हार्दिक शुभकामनाएँ!\n\nमाँ छठी की कृपा से ३६ घंटे का निर्जला व्रत मंगलमय हो। अमर छठ गीत सुनें:\n${shareUrl}`,
    };
  }

  // 4. Day 3: Sandhya Arghya (Mon 12 Apr 2027 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.ushaStart) {
    return {
      phase: 'sandhya_arghya',
      isFestivalActive: true,
      dayNumber: 3,
      dayNameHi: 'संध्या अर्घ्य',
      dayNameEn: 'Sandhya Arghya',
      dayTagHi: 'तृतीय दिवस (Day 3 of 4) · संध्या अर्घ्य · १२ अप्रैल २०२७',
      dayTagEn: 'Day 3 of 4 · Sandhya Arghya · 12 Apr 2027',
      greetingTitleHi: 'चैती छठ संध्या अर्घ्य की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Sandhya Arghya! Blessed Day 3 of Chaiti Chhath',
      greetingSubtextHi: 'अस्ताचलगामी भगवान सूर्यदेव को प्रथम अर्घ्य, बांस के दउरा-सूप पूजन व ठेकुआ महाप्रसाद अर्पण पर आपके जीवन में सुख-समृद्धि का उजियारा फैले।',
      greetingSubtextEn: 'Warmest blessings as families gather at ghats with Daura, Soop, and Thekua to offer the first Arghya to the setting Sun God.',
      ritualFocusHi: 'आज का अनुष्ठान: डूबते सूर्य को संध्या अर्घ्य व कोसी भराई अनुष्ठान',
      ritualFocusEn: 'Today’s Ritual: Dusk Offering to the Setting Sun & Kosi Ritual',
      dateDisplayHi: 'सोमवार, १२ अप्रैल २०२७ · चैत्र शुक्ल षष्ठी',
      dateDisplayEn: 'Monday, 12 Apr 2027 · Chaitra Shukla Shashthi',
      nextTransitionLabelHi: 'चतुर्थ दिवस (उषा अर्घ्य व पारण) 00:00 IST में शेष',
      nextTransitionLabelEn: 'Day 4 (Usha Arghya & Paran) at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.ushaStart, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 चैती छठ महापर्व के तृतीय दिवस "संध्या अर्घ्य" की हार्दिक शुभकामनाएँ!\n\nअस्ताचलगामी भगवान सूर्यदेव व छठी मईया आपके जीवन को सुख-समृद्धि से आलोकित करें:\n${shareUrl}`,
    };
  }

  // 5. Day 4: Usha Arghya & Paran (Tue 13 Apr 2027 00:00 IST - 23:59:59 IST)
  if (nowMs < FESTIVAL_BOUNDARIES_IST_MS.festivalEnd) {
    return {
      phase: 'usha_arghya',
      isFestivalActive: true,
      dayNumber: 4,
      dayNameHi: 'उषा अर्घ्य और पारण',
      dayNameEn: 'Usha Arghya & Paran',
      dayTagHi: 'चतुर्थ दिवस (Day 4 of 4) · उषा अर्घ्य व पारण · १३ अप्रैल २०२७',
      dayTagEn: 'Day 4 of 4 · Usha Arghya & Paran · 13 Apr 2027',
      greetingTitleHi: 'उषा अर्घ्य और पारण की हार्दिक शुभकामनाएँ!',
      greetingTitleEn: 'Happy Usha Arghya & Paran! Blessed Day 4 of Chaiti Chhath',
      greetingSubtextHi: 'उदीयमान भगवान भास्कर को भोर के पावन दुग्ध अर्घ्य एवं पारण के साथ छठी मईया आपकी समस्त मनोकामनाएँ पूर्ण करें और परिवार को दीर्घायु दें।',
      greetingSubtextEn: 'Saluting the rising dawn Sun! May the final morning Arghya and Paran bless your loved ones with health, joy, and fulfillment.',
      ritualFocusHi: 'आज का अनुष्ठान: उगते सूर्य को प्रातः अर्घ्य, पारण व ठेकुआ महाप्रसाद वितरण',
      ritualFocusEn: 'Today’s Ritual: Dawn Milk Arghya, Breaking Fast (Paran) & Prasad',
      dateDisplayHi: 'मंगलवार, १३ अप्रैल २०२७ · चैत्र शुक्ल सप्तमी',
      dateDisplayEn: 'Tuesday, 13 Apr 2027 · Chaitra Shukla Saptami',
      nextTransitionLabelHi: 'चैती छठ २०२७ समापन (00:00 IST) में शेष',
      nextTransitionLabelEn: 'Festival day concludes at 00:00 IST in',
      countdown: getRemainingParts(FESTIVAL_BOUNDARIES_IST_MS.festivalEnd, nowMs),
      istTimeFormatted,
      istShortTimeFormatted,
      istDateFormatted,
      shareGreetingText: `🪔 चैती छठ महापर्व के चतुर्थ दिवस "उषा अर्घ्य और पारण" की हार्दिक शुभकामनाएँ!\n\nउगते सूर्यदेव और छठी मईया सबका कल्याण करें। जय छठी मईया!\n${shareUrl}`,
    };
  }

  // 6. Concluded (14 Apr 2027 onwards)
  return {
    phase: 'concluded',
    isFestivalActive: false,
    dayNumber: null,
    dayNameHi: 'चैती छठ महापर्व २०२७ संपन्न',
    dayNameEn: 'Chaiti Chhath 2027 Blessed',
    dayTagHi: 'लोक आस्था का महापर्व छठ · जय छठी मईया',
    dayTagEn: 'Chhath Mahaparv · Jai Chhathi Maiya',
    greetingTitleHi: 'जय छठी मईया • सूर्य देवाय नमः!',
    greetingTitleEn: 'Jai Chhathi Maiya • Eternal Blessings of Surya Dev!',
    greetingSubtextHi: 'चैती छठ महापर्व २०२७ के पावन अनुष्ठान की मधुर स्मृतियों व अमर लोकगीतों के साथ छठी मईया की कृपा सदैव आपके परिवार पर बनी रहे।',
    greetingSubtextEn: 'May the grace of Chhathi Maiya and Lord Surya continue to illuminate your family all year long.',
    ritualFocusHi: 'सुनें १०६+ अमर छठ गीत, शारदा सिन्हा क्लासिक्स व संपूर्ण बोल',
    ritualFocusEn: 'Explore 106+ timeless Chhath songs, lyrics, and spiritual traditions',
    dateDisplayHi: 'चैती छठ महापर्व २०२७',
    dateDisplayEn: 'Chaiti Chhath Mahaparv 2027',
    nextTransitionLabelHi: 'जय छठी मईया · पावन भजन व स्मृतियाँ',
    nextTransitionLabelEn: 'Jai Chhathi Maiya · Timeless Hymns',
    countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    istTimeFormatted,
    istShortTimeFormatted,
    istDateFormatted,
    shareGreetingText: `🪔 जय छठी मईया! लोक आस्था के महापर्व छठ के १०६+ अमर गीत व सम्पूर्ण बोल सुनें:\n${shareUrl}`,
  };
}
