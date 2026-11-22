import { useEffect, useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import { WHATSAPP_LINK_1, WHATSAPP_LINK_2, TEL_LINK_1, TEL_LINK_2, PHONE_1, PHONE_2 } from '@/data';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-l from-brand-600 to-brand-800 p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-extrabold">تواصل معنا الآن</p>
            <p className="text-white/70 text-xs">نحن هنا لمساعدتك</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 space-y-2 w-64">
          <a
            href={WHATSAPP_LINK_1}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/10 group-hover:bg-green-500 flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-xs text-brand-600 font-semibold">واتساب</p>
              <p className="font-bold text-brand-950 text-sm" dir="ltr">{PHONE_1}</p>
            </div>
          </a>
          <a
            href={WHATSAPP_LINK_2}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/10 group-hover:bg-green-500 flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-xs text-brand-600 font-semibold">واتساب</p>
              <p className="font-bold text-brand-950 text-sm" dir="ltr">{PHONE_2}</p>
            </div>
          </a>
          <a
            href={TEL_LINK_1}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-crimson-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-crimson-500/10 group-hover:bg-crimson-600 flex items-center justify-center transition-colors">
              <Phone className="w-5 h-5 text-crimson-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-xs text-crimson-600 font-semibold">اتصال</p>
              <p className="font-bold text-brand-950 text-sm" dir="ltr">{PHONE_1}</p>
            </div>
          </a>
          <a
            href={TEL_LINK_2}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-crimson-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-crimson-500/10 group-hover:bg-crimson-600 flex items-center justify-center transition-colors">
              <Phone className="w-5 h-5 text-crimson-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-xs text-crimson-600 font-semibold">اتصال</p>
              <p className="font-bold text-brand-950 text-sm" dir="ltr">{PHONE_2}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl shadow-green-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="تواصل معنا"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring" />
        )}
        {open ? <X className="w-7 h-7 relative z-10" /> : <MessageCircle className="w-8 h-8 relative z-10" />}
      </button>
    </div>
  );
}
