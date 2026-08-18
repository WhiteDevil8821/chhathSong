import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface UpiSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPI_ID = 'ankit.kumar221099-3@okicici';
const PAYEE_NAME = 'Ankit Kumar';

export const UpiSupportModal: React.FC<UpiSupportModalProps> = ({ isOpen, onClose }) => {
  const { isHindi } = useLanguage();
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Standard UPI URI without forced amount so user can pay any amount they wish
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}&cu=INR&tn=${encodeURIComponent('Support Chhath Mahaparv Platform')}`;

  const handleDownloadQr = () => {
    try {
      // Find the canvas rendered inside ref
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (canvas) {
        // Create an elevated export canvas with padding and title for beautiful scan clarity
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 600;
        exportCanvas.height = 700;
        const ctx = exportCanvas.getContext('2d');
        if (ctx) {
          // White background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 600, 700);

          // Top Header
          ctx.fillStyle = '#1C120A';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('छठ महापर्व • Digital Seva & Support', 300, 50);

          ctx.fillStyle = '#666666';
          ctx.font = '16px sans-serif';
          ctx.fillText('Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)', 300, 80);

          // Draw QR image
          ctx.drawImage(canvas, 100, 110, 400, 400);

          // UPI ID text
          ctx.fillStyle = '#1C120A';
          ctx.font = 'bold 18px monospace';
          ctx.fillText(`UPI ID: ${UPI_ID}`, 300, 550);

          ctx.fillStyle = '#D97706';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('Jai Chhathi Maiya • Thank you for your support ❤️', 300, 590);

          const link = document.createElement('a');
          link.download = 'Chhath-Mahaparv-UPI-QR.png';
          link.href = exportCanvas.toDataURL('image/png');
          link.click();

          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          return;
        }
      }

      // Fallback
      const link = document.createElement('a');
      link.href = '/chhath-upi-qr.svg';
      link.download = 'Chhath-Mahaparv-UPI-QR.svg';
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container - Matches Screenshot 2 Exactly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-[440px] bg-[#160B05] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 my-auto text-[#FFF5E1] z-10 text-center font-sans"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF5E1]/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Heart Badge */}
          <div className="flex justify-center pt-1">
            <div className="w-12 h-12 rounded-full bg-[#301507] border border-[#F28C28]/40 flex items-center justify-center text-xl shadow-inner">
              ❤️
            </div>
          </div>

          {/* Title & Description matching Screenshot 2 */}
          <div className="space-y-2.5 px-2">
            <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight leading-snug">
              {isHindi
                ? 'Support the Platform to Stay Free FOREVER'
                : 'Support the Platform to Stay Free FOREVER'}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#FFF5E1]/80 leading-relaxed font-normal">
              {isHindi
                ? 'Daily 1 Lac Viewers are coming here and WebServer costs are high to keep this website smooth - please send any amount you wish. Thank you in advance ❤️'
                : 'Daily 1 Lac Viewers are coming here and WebServer costs are high to keep this website smooth - please send any amount you wish. Thank you in advance ❤️'}
            </p>
          </div>

          {/* QR Code Container - Matches Clean White Inner Card from Screenshot 2 */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col items-center justify-center space-y-2">
            {/* Elegant Outer Border Framing the QR */}
            <div
              ref={qrCanvasRef}
              className="p-3 bg-white rounded-2xl border-2 border-amber-800/30 flex items-center justify-center"
            >
              <QRCodeCanvas
                value={upiIntentUri}
                size={210}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '/gpay-center-logo.svg',
                  x: undefined,
                  y: undefined,
                  height: 42,
                  width: 42,
                  excavate: true
                }}
              />
            </div>
          </div>

          {/* Primary Action: Download QR Code Button */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDownloadQr}
              className="w-full py-3.5 px-6 rounded-full bg-[#F29913] hover:bg-[#E08A0E] active:scale-[0.98] text-[#160B05] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#160B05] stroke-[2.5]" />
              <span>{downloadSuccess ? (isHindi ? 'डाउनलोड हो गया!' : 'Downloaded!') : (isHindi ? 'Download QR Code' : 'Download QR Code')}</span>
            </button>

            <p className="text-[12px] text-[#FFF5E1]/70 font-medium">
              {isHindi ? 'Save it and scan with any UPI app.' : 'Save it and scan with any UPI app.'}
            </p>
          </div>

          {/* Mobile UPI Direct App Trigger & Dismiss Action */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <a
              href={upiIntentUri}
              className="block sm:hidden text-[12px] text-[#F29913] hover:underline font-semibold py-1"
            >
              📱 Tap here to Open directly in UPI App
            </a>

            <div>
              <button
                onClick={onClose}
                className="text-xs text-[#FFF5E1]/60 hover:text-[#FFF5E1] hover:underline transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
