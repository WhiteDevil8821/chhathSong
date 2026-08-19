import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Check,
  Copy,
  Heart,
  Shield,
  BookOpen,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

// Custom SVG Icons for Social Platforms
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export type ActiveModal = 'about' | 'privacy' | 'contact' | 'share' | 'terms' | 'disclaimer' | null;

interface InfoModalsProps {
  activeModal: ActiveModal;
  onClose: () => void;
  contactEmail?: string;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal,
  onClose,
  contactEmail = 'ankit.kumar221099@gmail.com'
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackSenderEmail, setFeedbackSenderEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmitting(true);
    try {
      // Send form data to FormSubmit AJAX endpoint (delivers directly to user's email)
      const res = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: feedbackName || 'Chhath Puja Devotee',
          email: feedbackSenderEmail || 'Not Provided',
          message: feedbackMessage,
          _subject: `New Devotional Feedback: ${feedbackName || 'Chhath Puja App'}`,
          _captcha: 'false'
        })
      });

      if (res.ok) {
        setFeedbackSent(true);
      } else {
        // Fallback: trigger user's native email client
        window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
          `Chhath Puja App Feedback from ${feedbackName || 'Visitor'}`
        )}&body=${encodeURIComponent(feedbackMessage + (feedbackSenderEmail ? `\n\nFrom: ${feedbackSenderEmail}` : ''))}`;
        setFeedbackSent(true);
      }
    } catch (err) {
      // Network or sandbox fallback
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Chhath Puja App Feedback from ${feedbackName || 'Visitor'}`
      )}&body=${encodeURIComponent(feedbackMessage + (feedbackSenderEmail ? `\n\nFrom: ${feedbackSenderEmail}` : ''))}`;
      setFeedbackSent(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFeedbackName('');
        setFeedbackSenderEmail('');
        setFeedbackMessage('');
        setFeedbackSent(false);
        onClose();
      }, 3500);
    }
  };

  const shareText = `🪔 लोक आस्था के महापर्व छठ की हार्दिक शुभकामनाएँ! \n\nछठ महापर्व के पावन घाट, अमर लोकगीत, और सांस्कृतिक विरासत का अनुभव करें:\n${typeof window !== 'undefined' ? window.location.href : ''}`;

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#2D1B0D] border border-[#F28C28]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 my-auto text-[#FFF5E1] font-sans"
        >
          {/* Top Glow Accent */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#F28C28]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#E34234]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-[#FFF5E1]/80 hover:text-white border border-[#F28C28]/30 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ABOUT MODAL */}
          {activeModal === 'about' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    About <span className="italic font-normal text-[#F28C28]">Chhath Mahaparv</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    लोक आस्था, प्रकृति पूजा और सांस्कृतिक समरसता का महापर्व
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#FFF5E1]/85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  <strong>छठ पूजा (Chhath Puja)</strong> केवल एक पर्व नहीं, बल्कि बिहार, झारखंड, पूर्वांचल और
                  दुनिया भर में फैले बिहारी समुदाय की आत्मा और पहचान है। यह सनातन परंपरा का वह अनूठा
                  महोत्सव है जो सीधे प्रत्यक्ष देवता—<strong>भगवान सूर्य (Sun God)</strong> और उनकी मानस बहन
                  <strong> षष्ठी देवी (छठी मईया)</strong> को समर्पित है।
                </p>

                <div className="p-4 rounded-2xl bg-black/30 border border-[#F28C28]/25 space-y-2">
                  <h4 className="text-sm font-bold text-[#F28C28] font-devanagari">
                    🌟 महापर्व की अद्वितीय विशेषताएं:
                  </h4>
                  <ul className="list-disc list-inside text-xs space-y-1.5 text-[#FFF5E1]/80">
                    <li>
                      <strong>उगते और डूबते दोनों सूर्यों को नमन:</strong> दुनिया में छठ ही एकमात्र ऐसा पर्व है
                      जहाँ पहले अस्ताचलगामी (डूबते) सूर्य को और अगले दिन उदीयमान (उगते) सूर्य को अर्घ्य दिया
                      जाता है।
                    </li>
                    <li>
                      <strong>समानता और समरसता:</strong> इस पूजा में किसी पुरोहित या मध्यस्थ की आवश्यकता नहीं
                      होती। समाज के हर वर्ग के लोग एक साथ पवित्र नदियों के घाट पर खड़े होकर अर्घ्य देते हैं।
                    </li>
                    <li>
                      <strong>पर्यावरण व प्रकृति संरक्षण:</strong> मिट्टी के चूल्हे, बांस के सूप-दउरा, आम की
                      लकड़ी, शुद्ध गंगाजल और मौसमी फल-अनाज—यह प्रकृति के प्रति पूर्ण समर्पण है।
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-[#FFF5E1]/75">
                  इस डिजिटल अनुभव का उद्देश्य छठ महापर्व की पवित्रता, लोकगीतों के माधुर्य और बिहारी माटी के
                  अतुल्य गौरव को वैश्विक स्तर पर जीवंत रखना है।
                </p>
              </div>

              <div className="pt-3 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} Chhath: The Pride of Bihar • All Rights Reserved.
              </div>
            </div>
          )}

          {/* CONTACT MODAL */}
          {activeModal === 'contact' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    Contact & <span className="italic font-normal text-[#F28C28]">Feedback</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    संदेश सीधे {contactEmail} पर प्राप्त होगा
                  </p>
                </div>
              </div>

              {/* Direct Email Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#F28C28]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F28C28]/20 flex items-center justify-center text-[#F28C28]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#FFF5E1]/60">Official Admin Email</div>
                    <div className="text-sm font-mono font-bold text-[#FFF5E1] select-all">
                      {contactEmail}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-black/50 hover:bg-[#F28C28]/20 text-xs font-semibold text-[#FFF5E1] border border-[#F28C28]/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${contactEmail}?subject=Chhath%20Puja%20Web%20App%20Feedback`}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#F28C28] hover:bg-[#FFD700] text-[#2D1B0D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Mail Us</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Social Media Profiles */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-[#F28C28]/25 space-y-2">
                <div className="text-xs font-semibold text-[#F28C28] flex items-center justify-between">
                  <span>Connect with the Creator / सोशल मीडिया</span>
                  <span className="text-[10px] text-[#FFF5E1]/50 font-mono">@_ek__bihari__</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="https://www.instagram.com/_ek__bihari__/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F56040]/20 hover:from-[#833AB4]/40 hover:to-[#F56040]/40 border border-[#E1306C]/40 text-[#FFF5E1] flex items-center justify-center gap-1.5 text-xs font-semibold transition-all group"
                  >
                    <InstagramIcon className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://www.facebook.com/DarkPheonix8831/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-[#FFF5E1] flex items-center justify-center gap-1.5 text-xs font-semibold transition-all group"
                  >
                    <FacebookIcon className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/ankitsingh2210/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-[#FFF5E1] flex items-center justify-center gap-1.5 text-xs font-semibold transition-all group"
                  >
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Feedback / Devotional Message Form */}
              <form onSubmit={handleSendFeedback} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#FFF5E1]/80">
                      Your Name / आपका नाम
                    </label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={e => setFeedbackName(e.target.value)}
                      placeholder="e.g., Ankit Kumar"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#F28C28]/30 focus:border-[#F28C28] outline-none text-xs sm:text-sm text-[#FFF5E1]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#FFF5E1]/80">
                      Your Email / आपका ईमेल (Optional)
                    </label>
                    <input
                      type="email"
                      value={feedbackSenderEmail}
                      onChange={e => setFeedbackSenderEmail(e.target.value)}
                      placeholder="reply-to@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#F28C28]/30 focus:border-[#F28C28] outline-none text-xs sm:text-sm text-[#FFF5E1]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFF5E1]/80">
                    Message, Memories or Feedback / संदेश या सुझाव *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackMessage}
                    onChange={e => setFeedbackMessage(e.target.value)}
                    placeholder="छठ महापर्व से जुड़ी अपनी यादें या इस वेबसाइट के लिए अपने विचार साझा करें..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-[#F28C28]/30 focus:border-[#F28C28] outline-none text-xs sm:text-sm text-[#FFF5E1] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || feedbackSent}
                  className="w-full py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#9B3D12] via-[#F28C28] to-[#FFD700] text-[#2D1B0D] font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>ईमेल भेजा जा रहा है... (Sending...)</span>
                  ) : feedbackSent ? (
                    <>
                      <Sparkles className="w-4 h-4 text-[#2D1B0D]" />
                      <span>धन्यवाद! संदेश सफलता से भेज दिया गया (Delivered!)</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#2D1B0D]" />
                      <span>संदेश भेजें (Send to {contactEmail})</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} Chhath: The Pride of Bihar • All Rights Reserved.
              </div>
            </div>
          )}

          {/* PRIVACY & TERMS MODAL */}
          {activeModal === 'privacy' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    Privacy Policy & <span className="italic font-normal text-[#F28C28]">Terms of Service</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    गोपनीयता नीति, YouTube API नियम एवं मुद्रीकरण (Monetization) शर्तें
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#FFF5E1]/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-black/40 border border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/90">
                  Last Updated: {currentYear} • Effective for all global visitors, advertisers & monetized partners.
                </div>

                <p>
                  <strong>1. Cultural Purpose & Heritage Tribute:</strong> This platform is designed as an educational,
                  cultural, and devotional tribute to the heritage of Chhath Puja, celebrating the spiritual legacy of
                  folk artists including Padma Bhushan Sharda Sinha.
                </p>

                <p>
                  <strong>2. YouTube API Services & Third-Party Content:</strong> This website utilizes the official
                  <strong> YouTube API Services / YouTube Embed Player</strong> to stream audio and video content.
                  By using this site, users agree to be bound by the{' '}
                  <a
                    href="https://www.youtube.com/t/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F28C28] underline hover:text-[#FFD700]"
                  >
                    YouTube Terms of Service
                  </a>{' '}
                  and the{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F28C28] underline hover:text-[#FFD700]"
                  >
                    Google Privacy Policy
                  </a>.
                  All music streams, video play counts, and advertising revenues embedded within the YouTube streams
                  remain directly credited to the respective copyright owners and verified music publishers.
                </p>

                <p>
                  <strong>3. Advertising & Cookies (Google AdSense Compliance):</strong> We may partner with third-party
                  advertising networks, including Google AdSense, to display ads when you visit our website. These
                  companies may use cookies and web beacons (such as the DoubleClick DART cookie) to serve ads based on
                  a user's prior visits to this website or other websites on the Internet. Users may opt out of
                  personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F28C28] underline hover:text-[#FFD700]"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F28C28] underline hover:text-[#FFD700]"
                  >
                    AboutAds.info
                  </a>.
                </p>

                <p>
                  <strong>4. Data Collection & Local Storage:</strong> We respect your privacy. We do not sell or trade
                  personal identifying information. Standard non-identifiable client-side storage (localStorage) is
                  used purely to preserve user preferences (such as audio volume, Arghya count, and light theme settings).
                </p>

                <p>
                  <strong>5. DMCA & Copyright Inquiries:</strong> If you are a copyright owner or licensing agent and
                  believe any content infringes upon your rights, please contact the administrator directly at{' '}
                  <strong>{contactEmail}</strong> for prompt resolution or removal.
                </p>

                <p>
                  <strong>6. Contact Information:</strong> For inquiries regarding this Privacy Policy or advertising
                  opportunities, email <strong>{contactEmail}</strong>.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} Chhath: The Pride of Bihar • All Rights Reserved.
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE MODAL */}
          {activeModal === 'terms' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    Terms of <span className="italic font-normal text-[#F28C28]">Service</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    उपयोग की शर्तें एवं नियम (Terms & Conditions)
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#FFF5E1]/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-black/40 border border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/90">
                  Effective Date: January 1, {currentYear} • ChhathSong.in
                </div>

                <p>
                  <strong>1. Acceptance of Terms:</strong> By accessing and using <strong>ChhathSong.in</strong> (the "Website"),
                  you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
                </p>

                <p>
                  <strong>2. Nature of Platform:</strong> ChhathSong.in is an educational, cultural, and spiritual archive dedicated to the folk traditions, sacred geet (songs), rituals, and heritage of Chhath Puja. All information, lyrics, panchang data, and cultural analysis are provided in good faith for non-commercial devotional enrichment.
                </p>

                <p>
                  <strong>3. Intellectual Property & YouTube API Compliance:</strong> Audio and video content on this platform are streamed using the official YouTube IFrame Embed Player API. We do not host, store, or redistribute copyrighted audio/video files on our servers. All copyrights, advertising earnings, views, and brand ownership remain solely with the original creators and music labels.
                </p>

                <p>
                  <strong>4. User Conduct:</strong> Visitors agree not to misuse the live presence, Arghya offering interactions, feedback mechanisms, or any features of the website for unlawful, abusive, or spam purposes.
                </p>

                <p>
                  <strong>5. Limitation of Liability:</strong> While we endeavor to ensure all festival dates, panchang timings, and lyrics are authentic, festival timings may vary across different geographical longitudes. ChhathSong.in is not liable for minor variations in local temple schedules.
                </p>

                <p>
                  <strong>6. Contact & Disputes:</strong> Any questions regarding these terms should be addressed to <strong>{contactEmail}</strong>.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} ChhathSong.in • Preserving Folk Heritage
              </div>
            </div>
          )}

          {/* DISCLAIMER & COPYRIGHT POLICY MODAL */}
          {activeModal === 'disclaimer' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    Disclaimer & <span className="italic font-normal text-[#F28C28]">Copyright Policy</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    कॉपीराइट नीति, DMCA अनुपालन एवं श्रेय (Attribution)
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#FFF5E1]/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-black/40 border border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/90">
                  DMCA Compliance & Fair Use Cultural Disclaimer • {currentYear}
                </div>

                <p>
                  <strong>1. Fair Use & Cultural Heritage Tribute:</strong> This website is an independent non-profit cultural initiative celebrating the sacred folk music of Chhath Puja, including legendary renditions by Padma Bhushan Sharda Sinha, Anuradha Paudwal, and Bhojpuri folk artists.
                </p>

                <p>
                  <strong>2. Attribution & Streaming Mechanics:</strong> We do not claim ownership of any embedded music, song compositions, or video recordings. All media playback is handled via YouTube's official developer API. Views and advertising revenue are attributed directly to the official channels and record labels (T-Series, Wave Music, Ganga Music, etc.).
                </p>

                <p>
                  <strong>3. DMCA Takedown Notice:</strong> If you are a copyright owner, artist, or authorized representative and wish for any embedded link or reference to be modified or removed, please notify us with the relevant details at:
                  <br />
                  <span className="font-mono font-bold text-[#F28C28] block mt-1">{contactEmail}</span>
                  We will promptly review and take appropriate action within 24–48 hours.
                </p>

                <p>
                  <strong>4. Astronomical & Muhurat Disclaimer:</strong> The sunrise and sunset Arghya timings provided for Chhath Puja 2026 are calculated based on India Standard Time (IST, UTC+5:30) and standard Vedic panchang references. Devotees are encouraged to also check local horizon visibility at their respective river ghats.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} ChhathSong.in • Jai Chhathi Maiya
              </div>
            </div>
          )}

          {/* SHARE MODAL */}
          {activeModal === 'share' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F28C28]/20 border border-[#F28C28]/40 text-[#F28C28]">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light text-[#FFF5E1]">
                    Share <span className="italic font-normal text-[#F28C28]">Blessings</span>
                  </h3>
                  <p className="text-xs font-devanagari text-[#F28C28] font-semibold">
                    अपनों के साथ छठ महापर्व की शुभकामनाएँ साझा करें
                  </p>
                </div>
              </div>

              {/* Direct Share Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white flex items-center justify-center gap-2.5 font-semibold text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp पर भेजें</span>
                </a>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-3.5 rounded-2xl bg-[#F28C28]/20 hover:bg-[#F28C28]/30 border border-[#F28C28]/40 text-[#FFF5E1] flex items-center justify-center gap-2.5 font-semibold text-sm transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">लिंक कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#F28C28]" />
                      <span>वेबसाइट लिंक कॉपी करें</span>
                    </>
                  )}
                </button>
              </div>

              {/* Devotional Note */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#F28C28]/25 text-center text-xs text-[#FFF5E1]/70 font-devanagari">
                "काँच ही बाँस के बहंगिया, बहंगी लचकत जाए... <br />
                उग हे सुरुज देव, अरघ के बेर भेल!"
              </div>

              <div className="pt-2 border-t border-[#F28C28]/20 text-[11px] text-[#FFF5E1]/60 font-mono text-center">
                © {currentYear} Chhath: The Pride of Bihar • All Rights Reserved.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
