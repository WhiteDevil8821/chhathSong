import React from 'react';

interface VisualProps {
  className?: string;
  size?: number;
}

// 1. Authentic Sacred Copper/Brass Kalash Lota for Arghya Offering (Replacing generic diya in Arghya button)
export const ArghyaLotaVisual: React.FC<VisualProps & { isPouring?: boolean }> = ({
  className = '',
  size = 64,
  isPouring = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_4px_12px_rgba(242,140,40,0.5)] ${className}`}
    >
      <defs>
        <linearGradient id="brassGoldGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="copperLotaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC09F" />
          <stop offset="25%" stopColor="#F28C28" />
          <stop offset="60%" stopColor="#C85A17" />
          <stop offset="100%" stopColor="#5C240E" />
        </linearGradient>
        <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id="sunAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiant Sun Glow behind Lota */}
      <circle cx="50" cy="50" r="42" fill="url(#sunAura)" />

      {/* Mango Leaves (आम्रपल्लव) on top */}
      <path d="M50 26 C42 12 32 18 36 28 Z" fill="#15803D" stroke="#166534" strokeWidth="1" />
      <path d="M50 26 C58 12 68 18 64 28 Z" fill="#16A34A" stroke="#166534" strokeWidth="1" />
      <path d="M50 24 C50 8 46 8 50 2 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />

      {/* Lota Lip / Rim */}
      <ellipse cx="50" cy="27" rx="20" ry="5.5" fill="url(#brassGoldGrad)" stroke="#B45309" strokeWidth="1.5" />
      <ellipse cx="50" cy="27" rx="16" ry="3.5" fill="#B45309" />

      {/* Lota Neck */}
      <path d="M34 27 C34 35 32 38 25 45 C18 53 18 68 25 76 C32 84 68 84 75 76 C82 68 82 53 75 45 C68 38 66 35 66 27 Z" fill="url(#copperLotaGrad)" stroke="#FFD700" strokeWidth="1.5" />

      {/* Decorative Traditional Etching Bands */}
      <path d="M30 48 Q50 56 70 48" stroke="#FFD700" strokeWidth="2" strokeDasharray="3 2" fill="none" />
      <path d="M22 62 Q50 72 78 62" stroke="#FFD700" strokeWidth="2.5" fill="none" opacity="0.9" />

      {/* Vermilion Sacred Sindoor Swastika / Tilak on Center */}
      <circle cx="50" cy="62" r="3.5" fill="#DC2626" />
      <circle cx="43" cy="62" r="1.5" fill="#DC2626" />
      <circle cx="57" cy="62" r="1.5" fill="#DC2626" />
      <circle cx="50" cy="55" r="1.5" fill="#DC2626" />
      <circle cx="50" cy="69" r="1.5" fill="#DC2626" />

      {/* Base Footing */}
      <ellipse cx="50" cy="80" rx="16" ry="4" fill="url(#brassGoldGrad)" stroke="#B45309" strokeWidth="1" />

      {/* Flowing Water Stream for Arghya */}
      {isPouring && (
        <path
          d="M34 28 C28 35 15 45 10 70 C8 80 12 95 18 100"
          stroke="url(#waterFlowGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          className="animate-pulse"
        />
      )}
    </svg>
  );
};

// 2. Authentic Sacred Chhath Soop with Fruits & Prasad (Replacing Diya in Soop card)
export const SacredSoopVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_4px_10px_rgba(242,140,40,0.4)] ${className}`}
    >
      <defs>
        <linearGradient id="soopBambooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="80%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="brassSoopRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#854D0E" />
        </linearGradient>
        <radialGradient id="diyaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main Winnowing Bamboo Soop Shape */}
      <path
        d="M15 25 L85 25 L78 82 C76 88 68 92 50 92 C32 92 24 88 22 82 Z"
        fill="url(#soopBambooGrad)"
        stroke="#78350F"
        strokeWidth="2"
      />

      {/* Woven Bamboo Texture Lines */}
      <path d="M22 35 L78 35 M23 46 L77 46 M24 57 L76 57 M25 68 L75 68 M28 78 L72 78" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 2" />
      <path d="M35 26 L32 85 M50 26 L50 90 M65 26 L68 85" stroke="#78350F" strokeWidth="1" strokeOpacity="0.3" />

      {/* Golden Brass Reinforced Rim */}
      <path d="M13 25 L87 25" stroke="url(#brassSoopRim)" strokeWidth="4" strokeLinecap="round" />
      <path d="M15 25 L22 82 C24 88 32 92 50 92 C68 92 76 88 78 82 L85 25" stroke="url(#brassSoopRim)" strokeWidth="2.5" fill="none" />

      {/* Vermilion Aipan Sacred Stripes (लाल सिंदूर व पिठार) */}
      <path d="M20 50 Q50 60 80 50" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="55" r="3.5" fill="#DC2626" />
      <circle cx="40" cy="54" r="2" fill="#DC2626" />
      <circle cx="60" cy="54" r="2" fill="#DC2626" />

      {/* Sacred Offerings Inside Soop */}
      {/* 1. Green Coconut (नारियल / डाभ) */}
      <circle cx="36" cy="42" r="10" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
      <path d="M36 32 Q40 37 36 42" stroke="#4ADE80" strokeWidth="1.5" fill="none" />

      {/* 2. Bananas Cluster (केला) */}
      <path d="M52 35 C58 36 66 42 63 50 C58 48 53 42 52 35 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
      <path d="M57 32 C64 34 71 40 68 47 C63 45 58 39 57 32 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />

      {/* 3. Golden Thekua Prasad (ठेकुआ) */}
      <ellipse cx="64" cy="62" rx="9" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
      <path d="M58 62 L70 62" stroke="#FDE68A" strokeWidth="1" />

      {/* 4. Sugarcane Piece (गन्ना) */}
      <rect x="42" y="28" width="5" height="24" rx="2" fill="#4ADE80" stroke="#15803D" strokeWidth="1" transform="rotate(-15 42 28)" />

      {/* 5. Sacred Burning Diya at the Front of Soop */}
      <circle cx="50" cy="74" r="14" fill="url(#diyaGlow)" />
      <ellipse cx="50" cy="78" rx="8" ry="3.5" fill="#78350F" stroke="#F97316" strokeWidth="1" />
      <path d="M50 75 C47 72 47 67 50 63 C53 67 53 72 50 75 Z" fill="#FDE047" stroke="#EA580C" strokeWidth="0.8" />
    </svg>
  );
};

// 3. Authentic Sacred Woven Bamboo Daura (Replacing generic laundry basket in Daura card)
export const SacredDauraVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_4px_10px_rgba(242,140,40,0.4)] ${className}`}
    >
      <defs>
        <linearGradient id="dauraBamboo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="redChunri" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <radialGradient id="dauraDiyaLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main Deep Round Daura Basket */}
      <path
        d="M12 40 C12 36 28 32 50 32 C72 32 88 36 88 40 L80 80 C78 88 66 93 50 93 C34 93 22 88 20 80 Z"
        fill="url(#dauraBamboo)"
        stroke="#78350F"
        strokeWidth="2"
      />

      {/* Intricate Handwoven Bamboo Cross-Hatch Lattice */}
      <path d="M16 48 Q50 56 84 48 M18 60 Q50 68 82 60 M20 72 Q50 80 80 72" stroke="#78350F" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
      <path d="M30 40 L26 80 M42 35 L40 88 M58 35 L60 88 M70 40 L74 80" stroke="#78350F" strokeWidth="1" strokeOpacity="0.5" />

      {/* Thick Bamboo Rim */}
      <ellipse cx="50" cy="40" rx="38" ry="9" fill="#B45309" stroke="#FDE68A" strokeWidth="2" />

      {/* Auspicious Red & Gold Cloth (कफ़नी / लाल वस्त्र) covering holy prasad */}
      <path
        d="M18 40 C22 30 35 24 50 24 C65 24 78 30 82 40 C75 48 62 52 50 52 C38 52 25 48 18 40 Z"
        fill="url(#redChunri)"
        stroke="#FDE047"
        strokeWidth="1.5"
      />

      {/* Golden Zari Border on Cloth */}
      <path d="M22 38 Q50 48 78 38" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 2" fill="none" />

      {/* Top Sacred Offerings Peeking Out: Coconut & Sugarcane */}
      <circle cx="38" cy="24" r="8" fill="#15803D" stroke="#166534" strokeWidth="1.2" />
      <rect x="58" y="14" width="6" height="18" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1" transform="rotate(20 58 14)" />

      {/* Sacred Top Burning Earthen Lamp (अखंड दीप) */}
      <circle cx="50" cy="18" r="16" fill="url(#dauraDiyaLight)" />
      <ellipse cx="50" cy="22" rx="9" ry="4" fill="#78350F" stroke="#EA580C" strokeWidth="1" />
      <path d="M50 19 C46 16 46 10 50 5 C54 10 54 16 50 19 Z" fill="#FDE047" stroke="#EA580C" strokeWidth="1" />
      <circle cx="50" cy="12" r="2.5" fill="#FFFBEB" />
    </svg>
  );
};

// 4. Authentic Pure Ghee Thekua Visual
export const ThekuaVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="thekuaBrown" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="80%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#451A03" />
        </radialGradient>
      </defs>
      {/* Golden Crispy Ghee Fried Thekua with Traditional Leaf Mould Pattern */}
      <path d="M50 12 C75 12 88 35 88 55 C88 78 70 88 50 88 C30 88 12 78 12 55 C12 35 25 12 50 12 Z" fill="url(#thekuaBrown)" stroke="#F59E0B" strokeWidth="2" />
      {/* Wooden Saancha Leaf Veins */}
      <path d="M50 22 L50 78" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 32 Q65 26 76 34 M50 32 Q35 26 24 34" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50 48 Q68 42 78 50 M50 48 Q32 42 22 50" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50 64 Q65 58 74 66 M50 64 Q35 58 26 66" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Fennel & Cardamom specks */}
      <circle cx="42" cy="40" r="1.5" fill="#4ADE80" />
      <circle cx="58" cy="56" r="1.5" fill="#4ADE80" />
      <circle cx="45" cy="70" r="1.5" fill="#FEF08A" />
    </svg>
  );
};

// 5. Sugarcane Canopy (Kosi Mandap) Visual
export const GannaMandapVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="caneGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="50%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
      </defs>
      {/* 5 Sugarcane Stalks forming a Canopy */}
      <path d="M50 15 L20 90" stroke="url(#caneGreen)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 15 L80 90" stroke="url(#caneGreen)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 15 L35 92" stroke="url(#caneGreen)" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 15 L65 92" stroke="url(#caneGreen)" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 15 L50 94" stroke="url(#caneGreen)" strokeWidth="4" strokeLinecap="round" />
      {/* Sugarcane Nodes */}
      <line x1="26" y1="72" x2="32" y2="74" stroke="#FDE68A" strokeWidth="2" />
      <line x1="68" y1="72" x2="74" y2="74" stroke="#FDE68A" strokeWidth="2" />
      {/* Red Sacred Thread (Mauli / Kalawa) tying the top */}
      <ellipse cx="50" cy="18" rx="8" ry="4" fill="#DC2626" stroke="#FBBF24" strokeWidth="1.5" />
      {/* Top Green Leaves Fan */}
      <path d="M50 15 Q30 5 15 12" stroke="#22C55E" strokeWidth="2.5" fill="none" />
      <path d="M50 15 Q70 5 85 12" stroke="#22C55E" strokeWidth="2.5" fill="none" />
      <path d="M50 15 Q50 0 45 -2" stroke="#4ADE80" strokeWidth="2" fill="none" />
      {/* Glowing Earthen Diya inside Canopy */}
      <ellipse cx="50" cy="85" rx="10" ry="4" fill="#78350F" />
      <circle cx="50" cy="78" r="4" fill="#F59E0B" className="animate-pulse" />
    </svg>
  );
};

// 6. Sacred Orange Matiyare Sindoor Visual (माँग से नाक तक पीला-नारंगी सिंदूर)
export const SacredSindoorVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_4px_10px_rgba(249,115,22,0.45)] ${className}`}
    >
      <defs>
        <radialGradient id="sindoorAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#F97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orangeSindoor" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="35%" stopColor="#FF7A00" />
          <stop offset="70%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="brassSindoorDani" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="80%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="sareeRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="70%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>
      </defs>

      {/* Divine Radiant Aura */}
      <circle cx="50" cy="48" r="46" fill="url(#sindoorAura)" />

      {/* Traditional Bihari Vratin Woman Silhouette in Red Saree */}
      <path
        d="M20 92 C20 74 28 60 40 54 C34 50 30 42 30 32 C30 18 40 8 52 8 C62 8 70 15 72 26 C75 28 78 32 78 38 C78 46 72 52 64 55 C74 62 80 75 80 92 Z"
        fill="url(#sareeRed)"
        stroke="#FBBF24"
        strokeWidth="1.2"
      />

      {/* Saree Golden Zari Border (गोटा किनारी) */}
      <path
        d="M24 88 C32 68 44 58 54 58 C66 58 74 70 76 88"
        stroke="#FDE047"
        strokeWidth="2.5"
        strokeDasharray="2 1.5"
        fill="none"
      />

      {/* Face & Forehead Profile */}
      <path
        d="M40 32 C40 22 46 16 52 16 C58 16 64 22 64 32 C64 42 58 48 52 48 C46 48 40 42 40 32 Z"
        fill="#FDE68A"
        stroke="#D97706"
        strokeWidth="1"
      />

      {/* Parted Hair (माँग) & Forehead Line */}
      <path d="M42 22 C48 15 56 15 62 22 C62 28 60 30 52 28 C44 30 42 28 42 22 Z" fill="#1C1917" />

      {/* THE ICONIC SACRED ORANGE MATIYARE SINDOOR (नाक के नोक से माँग तक) */}
      {/* 1. Broad unbroken sacred saffron-orange stroke extending from nose tip through forehead to hair parting */}
      <path
        d="M52 43 L52 14"
        stroke="url(#orangeSindoor)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* 2. Textured powder glow highlights */}
      <path
        d="M52 41 L52 15"
        stroke="#FEF08A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* 3. Auspicious orange sindoor spread at bridge of nose */}
      <ellipse cx="52" cy="42" rx="4.5" ry="3" fill="#EA580C" />
      <circle cx="52" cy="42" r="2.2" fill="#FACC15" />

      {/* Auspicious Round Red Bindi on Forehead */}
      <circle cx="52" cy="30" r="2.8" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />

      {/* Traditional Golden Maang-Tikka (माँग टीका) */}
      <path d="M52 15 L52 24" stroke="#FDE047" strokeWidth="1" />
      <circle cx="52" cy="24" r="2" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.6" />

      {/* Traditional Bihari Golden Nath (नथुनी / Nose Ring) */}
      <circle cx="47" cy="40" r="3.5" stroke="#FDE047" strokeWidth="1.2" fill="none" />
      <circle cx="45" cy="40" r="1" fill="#EF4444" />

      {/* Brass Sindoor Dani (सेंदुरदानी) with Spilling Saffron Powder at the Base */}
      <g transform="translate(62, 60)">
        {/* Brass Pot Base */}
        <ellipse cx="14" cy="24" rx="14" ry="7" fill="url(#brassSindoorDani)" stroke="#FDE047" strokeWidth="1.2" />
        <path d="M4 22 C4 14 8 10 14 10 C20 10 24 14 24 22 Z" fill="url(#brassSindoorDani)" stroke="#FDE047" strokeWidth="1.2" />
        {/* Pot Lid Peak */}
        <path d="M14 4 L11 10 L17 10 Z" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="14" cy="3" r="1.5" fill="#FEF08A" />
        {/* Spilling Radiant Orange Powder Heap */}
        <path d="M0 24 Q6 16 14 16 Q22 16 28 24 Z" fill="url(#orangeSindoor)" />
        <circle cx="8" cy="22" r="1.5" fill="#FEF08A" />
        <circle cx="14" cy="20" r="2" fill="#FEF08A" />
        <circle cx="20" cy="22" r="1.5" fill="#FEF08A" />
      </g>

      {/* Marigold Petals around base */}
      <circle cx="26" cy="84" r="3.5" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
      <circle cx="34" cy="88" r="3" fill="#EA580C" stroke="#B45309" strokeWidth="0.8" />
    </svg>
  );
};

// 7. Mitti Ka Chulha Visual
export const MittiChulhaVisual: React.FC<VisualProps> = ({ className = '', size = 56 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>
      {/* Traditional U-shaped Sacred Mud Stove */}
      <path d="M15 85 C15 50 25 35 50 35 C75 35 85 50 85 85 L70 85 C70 58 65 50 50 50 C35 50 30 58 30 85 Z" fill="url(#clayGrad)" stroke="#CA8A04" strokeWidth="2" />
      {/* Dry Mango Wood Sticks inside */}
      <rect x="25" y="75" width="25" height="6" rx="2" fill="#573010" stroke="#2D1705" strokeWidth="1" transform="rotate(15 25 75)" />
      <rect x="52" y="80" width="25" height="6" rx="2" fill="#573010" stroke="#2D1705" strokeWidth="1" transform="rotate(-15 52 80)" />
      {/* Sacred Golden Fire Flame */}
      <path d="M50 78 C42 70 40 55 50 42 C60 55 58 70 50 78 Z" fill="#FBBF24" stroke="#EA580C" strokeWidth="1.5" className="animate-pulse" />
      <path d="M50 75 C45 70 45 60 50 50 C55 60 55 70 50 75 Z" fill="#FFFBEB" />
    </svg>
  );
};
