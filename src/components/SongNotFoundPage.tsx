import React, { useEffect } from 'react';
import { Music2, ArrowLeft, Home, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { updateCanonicalUrl } from '../utils/analytics';

interface SongNotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const SongNotFoundPage: React.FC<SongNotFoundPageProps> = ({ onNavigate }) => {
  const { isHindi } = useLanguage();

  useEffect(() => {
    document.title = isHindi
      ? '404 — छठ गीत नहीं मिला (Page Not Found) | ChhathSong.in'
      : '404 — Chhath Song Not Found | ChhathSong.in';
    updateCanonicalUrl('https://www.chhathsong.in/songs');
  }, [isHindi]);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-6 text-center space-y-6 rounded-3xl bg-[#180F08]/90 border border-[#D4AF37]/30 shadow-2xl font-sans my-8">
      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
        <Music2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">404 — Song Not Found</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF5E1]">
          {isHindi ? 'यह छठ गीत उपलब्ध नहीं है' : 'Requested Chhath Song Not Found'}
        </h1>
        <p className="text-sm text-[#FFF5E1]/70 max-w-md mx-auto leading-relaxed">
          {isHindi
            ? 'आप जिस छठ गीत के लिंक पर आए हैं, वह मौजूद नहीं है या उसका पता बदल गया है। कृपया हमारे संपूर्ण १०७ गीत संग्रह में खोजें।'
            : 'The song you are looking for does not exist in the collection or the link has changed. Please explore our complete sacred song directory.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
        <a
          href="/songs"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/songs');
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D4AF37] text-[#180F08] font-bold text-sm hover:opacity-95 transition-all shadow-lg cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>{isHindi ? 'संपूर्ण छठ गीत संग्रह देखें' : 'Explore All Songs Directory'}</span>
        </a>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/40 border border-[#D4AF37]/30 text-[#FFF5E1] font-semibold text-sm hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <span>{isHindi ? 'मुख्य पृष्ठ' : 'Go to Home'}</span>
        </a>
      </div>
    </div>
  );
};
