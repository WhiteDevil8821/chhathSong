import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, BookOpen, Sparkles, Sun, Sunrise, Sunset, Utensils, Heart, CheckCircle2, ChevronDown, ChevronUp, Music, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SACRED_DAYS } from '../data/chhathData';
import { useChhathDailyGreeting } from '../hooks/useChhathDailyGreeting';

interface ChhathGuide2026Props {
  onExploreSongs?: () => void;
  onSelectDay?: (dayNumber: number) => void;
}

export const ChhathGuide2026: React.FC<ChhathGuide2026Props> = ({ onExploreSongs, onSelectDay }) => {
  const { isHindi } = useLanguage();
  const greeting = useChhathDailyGreeting();
  const [activeTab, setActiveTab] = useState<'schedule' | 'vidhi' | 'samagri' | 'philosophy' | 'sharda_tribute'>('schedule');

  return (
    <section id="chhath-puja-2026-guide" className="w-full relative rounded-3xl bg-gradient-to-b from-[#180F08] via-[#140D07] to-[#0D0805] border border-[#D4AF37]/35 p-6 md:p-8 shadow-2xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isHindi ? 'छठ महापर्व २०२६ संपूर्ण ज्ञानकोष' : 'Chhath Puja 2026 Official Guide & Knowledge Hub'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'छठ पूजा २०२६: विधि, मुहूर्त, सामग्री व आध्यात्मिक दर्शन' : 'Chhath Puja 2026: Complete Rituals, Muhurat & Traditions'}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md">
          {isHindi
            ? '१३ से १६ नवंबर २०२६ तक चलने वाले महापर्व की प्रामाणिक पंचांग तिथि, अर्घ्य समय, पूजन सामग्री और दार्शनिक महत्व।'
            : 'Authentic festival schedule, Arghya sunset/sunrise timings, sacred samagri checklist, and the Vedic philosophy of Sun worship.'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        {[
          { id: 'schedule', labelHi: '२०२६ पंचांग व मुहूर्त', labelEn: '2026 Schedule & Muhurat' },
          { id: 'vidhi', labelHi: '४ दिवसीय पूजन विधि', labelEn: '4-Day Puja Vidhi' },
          { id: 'samagri', labelHi: 'पवित्र सामग्री सूची', labelEn: 'Sacred Samagri List' },
          { id: 'philosophy', labelHi: 'छठ का दर्शन व विज्ञान', labelEn: 'Spiritual Philosophy' },
          { id: 'sharda_tribute', labelHi: 'शारदा सिन्हा श्रद्धांजलि', labelEn: 'Sharda Sinha Legacy' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#180F08] font-bold shadow-md shadow-[#D4AF37]/20 scale-[1.02]'
                  : 'bg-black/40 text-[#FFF5E1]/75 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-white'
              }`}
            >
              {isHindi ? tab.labelHi : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {/* Tab 1: 2026 Schedule & Muhurat */}
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SACRED_DAYS.map((day) => {
                const isToday = greeting.dayNumber === day.dayNumber;
                return (
                <div
                  key={day.dayNumber}
                  className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                    isToday
                      ? 'bg-[#2A1508]/75 border-[#D4AF37] shadow-lg'
                      : 'bg-black/45 border-[#D4AF37]/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className={`px-2.5 py-0.5 rounded uppercase ${isToday ? 'bg-[#D4AF37] text-[#180F08]' : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35'}`}>
                        {isHindi ? `दिवस ${day.dayNumber}` : `Day ${day.dayNumber}`}
                      </span>
                      {isToday && (
                        <span className="text-[#FFD54F] font-semibold">
                          · {isHindi ? 'आज का दिवस' : 'Today'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#FFF5E1]/80 font-mono">
                      {isHindi ? day.date2026 : day.gregorianDate2026}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#FFF5E1]">
                      {isHindi ? day.hindiName : day.englishName}
                    </h3>
                    <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                      {day.tithi}
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-[#FFF5E1]/80 leading-relaxed">
                    {day.ritualSummary}
                  </p>

                  {day.arghyaTimeHint && (
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-[#FFE5B4]">
                      <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{day.arghyaTimeHint}</span>
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {/* Note on Muhurat */}
            <div className="p-4 rounded-2xl bg-black/35 border border-[#D4AF37]/20 text-xs text-[#FFF5E1]/75 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <p>
                {isHindi
                  ? 'नोट: सूर्योदय एवं सूर्यास्त का सही समय स्थानीय अक्षांश-देशांतर (Latitude/Longitude) के अनुसार कुछ मिनटों का अंतर रख सकता है। उपरोक्त मुहूर्त पटना, बिहार (IST) के आधार पर दिए गए हैं।'
                  : 'Note: Exact sunrise and sunset times vary slightly by city longitude. Timings listed above are centered on Patna/Bihar (India Standard Time).'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab 2: 4-Day Puja Vidhi */}
        {activeTab === 'vidhi' && (
          <motion.div
            key="vidhi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              {SACRED_DAYS.map((day) => (
                <div
                  key={day.dayNumber}
                  className="p-5 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#D4AF37] text-[#180F08] flex items-center justify-center font-bold text-sm font-serif">
                      {day.dayNumber}
                    </span>
                    <div>
                      <h3 className="text-base md:text-lg font-serif font-bold text-[#FFF5E1]">
                        {isHindi ? day.hindiName : day.englishName}
                      </h3>
                      <span className="text-xs text-[#D4AF37] font-medium">
                        {isHindi ? day.date2026 : day.gregorianDate2026}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-[#FFF5E1]/85 leading-relaxed">
                    {day.significance}
                  </p>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                      {isHindi ? 'मुख्य धार्मिक अनुष्ठान (Core Rituals):' : 'Key Ritual Steps:'}
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#FFF5E1]/80">
                      {day.associatedRituals.map((r, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Sacred Samagri List */}
        {activeTab === 'samagri' && (
          <motion.div
            key="samagri"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  categoryHi: 'दउरा व सूप (Sacred Vessels)',
                  categoryEn: 'Baskets & Offering Vessels',
                  items: [
                    'काँच बाँस का दउरा (Raw Bamboo Daura)',
                    'पीतल या बाँस का नया सूप (Brass or Bamboo Soop)',
                    'सूप ढकने हेतु पीला या लाल सूती वस्त्र (Kafani cloth)',
                    'मिट्टी के नए दीये व ढक्कन (Earthen Diyas & Lids)'
                  ]
                },
                {
                  categoryHi: 'महाप्रसाद सामग्री (Thekua & Offerings)',
                  categoryEn: 'Prasad & Cooking Essentials',
                  items: [
                    'दरदरा पिसा नया गेहूँ का आटा (Stone Ground Wheat)',
                    'शुद्ध गन्ने का गुड़ व शक्कर (Pure Cane Jaggery)',
                    'शुद्ध देसी गाय का घी (Pure Cow Desi Ghee)',
                    'हरी इलायची व सौंफ (Cardamom & Fennel Seeds)',
                    'ठेकुआ छापने का पारंपरिक काठ का साँचा (Wooden Mould)'
                  ]
                },
                {
                  categoryHi: 'ऋतु फल व वनस्पति (Sacred Fruits & Crops)',
                  categoryEn: 'Seasonal Harvest & Nature Offerings',
                  items: [
                    'पाँच या सात साबुत गन्ने पत्ते सहित (Whole Sugarcane)',
                    'डाभ नींबू / गागल (Pomelo / Big Citrus)',
                    'सुथनी, शकरकंद व पानी फल सिंघाड़ा (Water Chestnut & Roots)',
                    'हरी पत्तियों सहित कच्ची हल्दी व अदरक (Turmeric & Ginger)',
                    'केले का पूरा घौद / साबुत गुच्छा (Banana Cluster)',
                    'सुपारी, पान के पत्ते व अक्षत (Betel Nut, Leaves, Rice)'
                  ]
                },
                {
                  categoryHi: 'संस्कार व पूजन द्रव्य (Ritual Elements)',
                  categoryEn: 'Sanctification & Vermilion',
                  items: [
                    'पीला / संतरी मटियारे सिंदूर (Pure Orange Sindoor)',
                    'गंगाजल व कच्चा गाय का दूध (Ganga Water & Raw Milk)',
                    'मिट्टी का नया चूल्हा (Earthen Clay Stove)',
                    'आम की सूखी सूखी लकड़ियाँ (Dry Mango Firewood)',
                    'कपूर, रुई की बत्ती व रक्षा सूत्र (Camphor, Wicks & Mauli)'
                  ]
                }
              ].map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-black/45 border border-[#D4AF37]/25 space-y-3">
                  <h3 className="text-base font-serif font-bold text-[#D4AF37]">
                    {isHindi ? sec.categoryHi : sec.categoryEn}
                  </h3>
                  <ul className="space-y-2">
                    {sec.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-[#FFF5E1]/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Spiritual Philosophy */}
        {activeTab === 'philosophy' && (
          <motion.div
            key="philosophy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-black/45 border border-[#D4AF37]/25 space-y-4 text-xs md:text-sm text-[#FFF5E1]/85 leading-relaxed">
              <h3 className="text-xl font-serif font-bold text-[#FFF5E1]">
                {isHindi ? 'छठ महापर्व का दार्शनिक, सामाजिक व पर्यावरणीय संदेश' : 'The Vedic & Ecological Philosophy of Chhath'}
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/20">
                  <h4 className="font-serif font-bold text-[#D4AF37] text-sm mb-1">
                    {isHindi ? '१. डूबते सूर्य को पहला अर्घ्य (Reverence for Both Dawn & Dusk)' : '1. Worship of the Setting Sun'}
                  </h4>
                  <p>
                    {isHindi
                      ? 'दुनिया में हर कोई केवल उगते सूरज को सलाम करता है, लेकिन छठ एकमात्र ऐसा पर्व है जहाँ पहले अस्ताचलगामी (डूबते) सूर्य को अर्घ्य दिया जाता है। यह सनातन संदेश देता है कि जीवन के हर चरण—समाप्ति और शुरुआत—का समान सम्मान होना चाहिए।'
                      : 'While society often only celebrates rising fortunes, Chhath uniquely bows to the setting sun (Sandhya Arghya) before the rising sun. It acknowledges that every sunset holds the seed of a brighter dawn.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/20">
                  <h4 className="font-serif font-bold text-[#D4AF37] text-sm mb-1">
                    {isHindi ? '२. पूर्ण सामाजिक समानता (Egalitarian Purity — No Middlemen)' : '2. Complete Social Equality'}
                  </h4>
                  <p>
                    {isHindi
                      ? 'छठ में किसी पुजारी या बिचौलिए की आवश्यकता नहीं होती। भक्त सीधे प्रकृति और सूर्यदेव से संवाद करता है। समाज के सभी वर्ग—राजा से रंक तक—एक ही घाट पर एक समान बाँस के सूप और मिट्टी के चूल्हे के साथ पूजा करते हैं।'
                      : 'Chhath requires no priestly intermediary. Every devotee communicates directly with the Sun God. People of all social strata stand together in the same holy river waters, sharing identical earthen offerings.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/20">
                  <h4 className="font-serif font-bold text-[#D4AF37] text-sm mb-1">
                    {isHindi ? '३. प्रकृति एवं जल संरक्षण (Ecological Harmony)' : '3. Nature & Water Reverence'}
                  </h4>
                  <p>
                    {isHindi
                      ? 'छठ में प्रयुक्त प्रत्येक वस्तु 100% प्राकृतिक और बायोडिग्रेडेबल होती है—बाँस, मिट्टी, गेहूँ, गुड़, मौसमी फल। पर्व से पूर्व गाँव के सभी रास्तों और जलस्रोतों (नदियों, पोखरों) की सामूहिक सफाई की जाती है।'
                      : 'Every element in Chhath is 100% biodegradable—raw bamboo, river clay, seasonal harvest, and pure cow ghee. The festival inspires spontaneous community-driven cleaning of riverbanks and waterways.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Sharda Sinha Tribute */}
        {activeTab === 'sharda_tribute' && (
          <motion.div
            key="sharda_tribute"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-black/45 border border-[#D4AF37]/30 space-y-4 text-xs md:text-sm text-[#FFF5E1]/85 leading-relaxed"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#D4AF37]/20">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <div>
                <h3 className="text-xl font-serif font-bold text-[#FFF5E1]">
                  {isHindi ? 'बिहार कोकिला पद्म भूषण शारदा सिन्हा को विनम्र श्रद्धांजलि' : 'Tribute to Bihar Kokila Padma Bhushan Sharda Sinha'}
                </h3>
                <span className="text-xs text-[#D4AF37]">
                  {isHindi ? 'छठ गीतों की अमर आवाज़ (1952 – 2024)' : 'The Eternal Voice of Chhath Puja (1952 – 2024)'}
                </span>
              </div>
            </div>

            <p>
              {isHindi
                ? 'शारदा सिन्हा केवल एक गायिका नहीं, बल्कि छठ महापर्व की सांस्कृतिक आत्मा थीं। "काँच ही बाँस के बहंगिया", "हो दीनानाथ", और "केलवा के पात पर" जैसे उनके अमर गीतों के बिना दुनिया के किसी भी कोने में छठ की कल्पना अधूरी है।'
                : 'Padma Bhushan Sharda Sinha was not merely a singer; she was the spiritual heartbeat of Chhath Mahaparv. Her soulful folk renditions like "Kaanch Hi Baans Ke Bahangiya" and "Ho Dinaanaath" resonate across millions of homes every Kartik.'}
            </p>

            <p>
              {isHindi
                ? 'उनके गाए गीतों ने गाँव की पगडंडियों से लेकर लंदन, न्यूयॉर्क और मॉरीशस तक फैले हर प्रवासी बिहारी के हृदय में अपनी मातृभूमि की मिट्टी और संस्कारों को जीवंत रखा।'
                : 'Her music bridged generations and continents, keeping the warmth of Bihar’s sacred soil alive for the global Indian diaspora.'}
            </p>

            {onExploreSongs && (
              <div className="pt-2">
                <button
                  onClick={onExploreSongs}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#180F08] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFE5B4] transition-colors cursor-pointer"
                >
                  <Music className="w-4 h-4" />
                  <span>{isHindi ? 'शारदा सिन्हा के अमर छठ गीत सुनें' : 'Listen to Sharda Sinha Classics'}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
