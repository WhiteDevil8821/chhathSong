import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, Heart, Smartphone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const UPI_ID = 'ankit.kumar221099-3@okicici';
const PAYEE_NAME = 'Ankit Kumar';

export const UpiSupportCard: React.FC = () => {
  const { isHindi } = useLanguage();
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}&cu=INR&tn=${encodeURIComponent('Support Chhath Mahaparv Platform')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleDownloadQr = () => {
    try {
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (canvas) {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 600;
        exportCanvas.height = 700;
        const ctx = exportCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 600, 700);

          ctx.fillStyle = '#1C120A';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('छठ महापर्व • Digital Seva & Support', 300, 50);

          ctx.fillStyle = '#666666';
          ctx.font = '16px sans-serif';
          ctx.fillText('Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)', 300, 80);

          ctx.drawImage(canvas, 100, 110, 400, 400);

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

  return (
    <div
      id="seva-support-section"
      className="relative rounded-3xl bg-[#160B05] border border-[#D4AF37]/30 p-6 sm:p-10 shadow-2xl text-[#FFF5E1] space-y-6 text-center max-w-xl mx-auto overflow-hidden font-sans"
    >
      {/* Background Subtle Warm Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Heart Badge */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-[#301507] border border-[#F28C28]/40 flex items-center justify-center text-xl shadow-inner">
          ❤️
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2.5 max-w-md mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
          Support the Platform to Stay Free FOREVER
        </h3>
        <p className="text-xs sm:text-sm text-[#FFF5E1]/80 leading-relaxed font-normal">
          Daily 1 Lac Viewers are coming here and WebServer costs are high to keep this website smooth - please send any amount you wish. Thank you in advance ❤️
        </p>
      </div>

      {/* QR Code Container matching Screenshot 2 */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto">
        <div
          ref={qrCanvasRef}
          className="p-3 bg-white rounded-2xl border-2 border-amber-800/30 flex items-center justify-center"
        >
          <QRCodeCanvas
            value={upiIntentUri}
            size={220}
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
      <div className="space-y-2 max-w-xs mx-auto">
        <button
          onClick={handleDownloadQr}
          className="w-full py-3.5 px-6 rounded-full bg-[#F29913] hover:bg-[#E08A0E] active:scale-[0.98] text-[#160B05] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#160B05] stroke-[2.5]" />
          <span>{downloadSuccess ? 'Downloaded Successfully!' : 'Download QR Code'}</span>
        </button>

        <p className="text-xs text-[#FFF5E1]/70 font-medium">
          Save it and scan with any UPI app.
        </p>
      </div>

      {/* Instant Mobile Actions */}
      <div className="pt-2 border-t border-white/10 max-w-sm mx-auto space-y-2">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/20 text-xs">
          <div className="flex items-center gap-1.5 truncate text-left">
            <span className="text-[11px] text-[#D4AF37] font-semibold">UPI ID:</span>
            <span className="font-mono text-[11px] text-[#FFF5E1] select-all truncate">{UPI_ID}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#FFF5E1] text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#D4AF37]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile UPI Direct App Trigger */}
        <a
          href={upiIntentUri}
          className="block sm:hidden text-xs text-[#F29913] hover:underline font-semibold py-1"
        >
          📱 Open in UPI App (GPay / PhonePe / Paytm)
        </a>
      </div>
    </div>
  );
};
