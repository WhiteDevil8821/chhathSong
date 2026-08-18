import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Train, Sparkles, Heart, Compass, Volume2, ShieldCheck, Flame, Users } from 'lucide-react';
import { soundSynth } from '../utils/soundSynthesizer';

export const NostalgicMemoriesBoard: React.FC = () => {
  const [activeMemoryIdx, setActiveMemoryIdx] = useState(0);

  const memories = [
    {
      id: 'train',
      icon: <Train className="w-5 h-5 text-amber-400" />,
      tag: 'घर वापसी (The Journey Home)',
      title: 'ट्रेन की सीट और गाँव की पुकार',
      hindiDesc: 'बिहार संपर्क क्रांति, मगध, या विक्रमशिला एक्सप्रेस का वो खचाखच डिब्बा... 3 महीने पहले से टिकट की जद्दोजहद, क्योंकि माँ ने कहा था — "बबुआ, छठ में घर जरूर अईह!"',
      subText: 'No matter where in the world a person from Bihar is, during Chhath, the soul yearns only for the village river ghat.',
      badge: 'Bihari Diaspora'
    },
    {
      id: 'cleaning',
      icon: <Sparkles className="w-5 h-5 text-yellow-300" />,
      tag: 'सामूहिकता (Community Service)',
      title: 'गाँव की सड़कों की पावन सफाई',
      hindiDesc: 'भोर के ३ बजे से ही टोली बनाकर सड़कों पर झाड़ू लगाना, पानी छिड़कना और रंग-बिरंगे चूने से अल्पना बनाना, ताकि व्रती के नंगे पाँव में एक कंकर भी न चुभे।',
      subText: 'Youth cleaning every alleyway barefoot with devotion, converting the entire town into a sanctified path.',
      badge: 'Unconditional Purity'
    },
    {
      id: 'daura-walk',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      tag: 'माथे पर दउरा (The Sacred Walk)',
      title: 'माथे पर भारी दउरा और नंगे पाँव घाट',
      hindiDesc: 'सिर पर लाल कपड़े से ढका भारी बाँस का दउरा, हाथ में अगरबत्ती, और मुँह पर "जय छठी मईया" का जयकारा। पैर में छाले भी पड़ जाएँ, तो भी चेहरे पर सिर्फ दिव्य तेज होता है।',
      subText: 'Balancing the entire family\'s offerings on the head without resting it down until reaching the riverbank.',
      badge: 'Sacred Pride'
    },
    {
      id: 'equality',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      tag: 'समानता व प्रकृति (True Equality)',
      title: 'बिना पंडित, बिना भेदभाव — पूर्ण समानता',
      hindiDesc: 'छठ में न कोई राजा, न कोई रंक। एक ही नदी के शीतल जल में सब एक साथ खड़े होकर प्रत्यक्ष देवता सूर्य को नमन करते हैं। कुम्हार का दीया, डोम का दउरा, और किसान की ईख — सबके बिना यह पर्व अधूरा है।',
      subText: 'The only festival worshipping nature directly with absolute social unity and no intermediaries.',
      badge: 'Egalitarian Spirit'
    }
  ];

  return (
    <div id="nostalgic-memories-section" className="relative glass-card rounded-3xl p-6 md:p-8 border border-[#F28C28]/35 overflow-hidden shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#F28C28]/25">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#F28C28]/40 text-[#F28C28] text-xs font-sans font-bold tracking-widest uppercase mb-1">
            <Heart className="w-3.5 h-3.5 text-[#E34234] fill-[#E34234]" />
            <span>भावनात्मक धरोहर • The Emotional Soul of Bihar</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-devanagari font-bold text-[#FFF5E1]">
            छठ से जुड़ी अमिट यादें और भावनाएं
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#FFF5E1]/70 max-w-md font-sans">
          छठ सिर्फ एक अनुष्ठान नहीं, बल्कि हर बिहारी के दिल की धड़कन, बचपन की खुशबू और मिट्टी का मान है।
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
              soundSynth.playTempleBell();
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between font-sans ${
              activeMemoryIdx === idx
                ? 'bg-black/55 border-[#F28C28] shadow-xl shadow-black/70 scale-[1.01]'
                : 'bg-black/25 border-[#F28C28]/20 hover:border-[#F28C28]/40 hover:bg-black/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-black/50 border border-[#F28C28]/30">
                    {m.icon}
                  </div>
                  <span className="text-xs font-bold text-[#F28C28]">
                    {m.tag}
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/60 text-[#F28C28] border border-[#F28C28]/20 font-bold uppercase tracking-wider">
                  {m.badge}
                </span>
              </div>

              <h4 className="text-lg font-devanagari font-bold text-[#FFF5E1] mb-2">
                {m.title}
              </h4>
              <p className="text-xs md:text-sm text-[#FFF5E1]/85 leading-relaxed font-normal">
                {m.hindiDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F28C28]/20">
              <p className="text-[11px] md:text-xs text-[#FFF5E1]/70 italic font-garamond text-base">
                “{m.subText}”
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
