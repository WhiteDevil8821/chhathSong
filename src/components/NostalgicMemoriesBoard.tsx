import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Train, Sparkles, Heart, Flame, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NostalgicMemoriesBoard: React.FC = () => {
  const { isHindi } = useLanguage();
  const [activeMemoryIdx, setActiveMemoryIdx] = useState(0);

  const memories = [
    {
      id: 'train',
      icon: <Train className="w-5 h-5 text-amber-400" />,
      tag: isHindi ? 'घर वापसी (The Journey Home)' : 'The Journey Home (Ghar Wapsi)',
      title: isHindi ? 'ट्रेन की सीट और गाँव की पुकार' : 'Packed Trains & the Call of Home',
      hindiDesc: isHindi
        ? 'बिहार संपर्क क्रांति, मगध, या विक्रमशिला एक्सप्रेस का वो खचाखच डिब्बा... 3 महीने पहले से टिकट की जद्दोजहद, क्योंकि माँ ने कहा था — "बबुआ, छठ में घर जरूर अईह!"'
        : 'The packed compartments of Vikramshila or Sampark Kranti, waiting list tickets booked months in advance, because a mother whispered: "Babu, do come home for Chhath!"',
      subText: 'No matter where in the world a person from Bihar is, during Chhath, the soul yearns only for the village river ghat.',
      badge: 'Bihari Diaspora'
    },
    {
      id: 'cleaning',
      icon: <Sparkles className="w-5 h-5 text-yellow-300" />,
      tag: isHindi ? 'सामूहिकता (Community Service)' : 'Sacred Seva & Cleanliness',
      title: isHindi ? 'गाँव की सड़कों की पावन सफाई' : 'Barefoot Cleansing of Streets',
      hindiDesc: isHindi
        ? 'भोर के ३ बजे से ही टोली बनाकर सड़कों पर झाड़ू लगाना, पानी छिड़कना और रंग-बिरंगे चूने से अल्पना बनाना, ताकि व्रती के नंगे पाँव में एक कंकर भी न चुभे।'
        : 'Waking up at 3 AM to sweep roads, sprinkle fresh water, and draw holy lime patterns so not a single pebble hurts the bare feet of the fasting Vrati.',
      subText: 'Youth cleaning every alleyway barefoot with devotion, converting the entire town into a sanctified path.',
      badge: 'Unconditional Purity'
    },
    {
      id: 'daura-walk',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      tag: isHindi ? 'माथे पर दउरा (The Sacred Walk)' : 'Balancing the Daura on Head',
      title: isHindi ? 'माथे पर भारी दउरा और नंगे पाँव घाट' : 'The Sacred March to the River',
      hindiDesc: isHindi
        ? 'सिर पर लाल कपड़े से ढका भारी बाँस का दउरा, हाथ में अगरबत्ती, और मुँह पर "जय छठी मईया" का जयकारा। पैर में छाले भी पड़ जाएँ, तो भी चेहरे पर सिर्फ दिव्य तेज होता है।'
        : 'Balancing the sacred bamboo Daura on the head covered with red silk, chanting Jai Chhathi Maiya, walking miles barefoot with an unyielding smile of devotion.',
      subText: 'Balancing the entire family offerings on the head without resting it down until reaching the riverbank.',
      badge: 'Sacred Pride'
    },
    {
      id: 'equality',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      tag: isHindi ? 'समानता व प्रकृति (True Equality)' : 'Radical Social Equality',
      title: isHindi ? 'बिना पंडित, बिना भेदभाव — पूर्ण समानता' : 'Direct Nature Worship & Equality',
      hindiDesc: isHindi
        ? 'छठ में न कोई राजा, न कोई रंक। एक ही नदी के शीतल जल में सब एक साथ खड़े होकर प्रत्यक्ष देवता सूर्य को नमन करते हैं। कुम्हार का दीया, डोम का दउरा, और किसान की ईख — सबके बिना यह पर्व अधूरा है।'
        : 'No priests, no caste barriers, no hierarchies. Standing chest-deep in the cold water together, honoring the direct visible deity Sun. A complete community harmony.',
      subText: 'The only festival worshipping nature directly with absolute social unity and no intermediaries.',
      badge: 'Egalitarian Spirit'
    }
  ];

  return (
    <div id="nostalgic-memories-section" className="relative rounded-3xl bg-[#1C120B]/90 p-6 md:p-8 border border-[#D4AF37]/30 overflow-hidden shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-sans font-bold tracking-widest uppercase mb-1">
            <Heart className="w-3.5 h-3.5 text-[#E34234] fill-[#E34234]" />
            <span>{isHindi ? 'भावनात्मक धरोहर • The Emotional Soul of Bihar' : 'Emotional Soul & Community Bonds'}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#FFF5E1]">
            {isHindi ? 'छठ से जुड़ी अमिट यादें और भावनाएं' : 'Timeless Memories & Nostalgia of Chhath'}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md font-sans">
          {isHindi
            ? 'छठ सिर्फ एक अनुष्ठान नहीं, बल्कि हर बिहारी के दिल की धड़कन, बचपन की खुशबू और मिट्टी का मान है।'
            : 'Chhath is not merely a ritual; it is the heartbeat of every Bihari, the aroma of childhood, and pride of the soil.'}
        </p>
      </div>

      {/* Grid of 4 Core Memory Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((m, idx) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -3 }}
            onClick={() => {
              setActiveMemoryIdx(idx);
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between font-sans ${
              activeMemoryIdx === idx
                ? 'bg-black/55 border-[#D4AF37] shadow-xl shadow-black/70 scale-[1.01]'
                : 'bg-black/25 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-black/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-black/50 border border-[#D4AF37]/30">
                    {m.icon}
                  </div>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {m.tag}
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/60 text-[#D4AF37] border border-[#D4AF37]/20 font-bold uppercase tracking-wider">
                  {m.badge}
                </span>
              </div>

              <h4 className="text-lg font-serif font-bold text-[#FFF5E1] mb-2">
                {m.title}
              </h4>
              <p className="text-xs md:text-sm text-[#FFF5E1]/85 leading-relaxed font-normal">
                {m.hindiDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D4AF37]/15">
              <p className="text-[11px] md:text-xs text-[#FFF5E1]/70 italic font-serif">
                “{m.subText}”
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
