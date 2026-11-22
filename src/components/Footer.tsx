import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COMPANY_NAME, NAV_LINKS, PHONE_1, PHONE_2, WHATSAPP_LINK_1, TEL_LINK_1 } from '@/data';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative bg-brand-950 text-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="absolute -top-24 left-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl" />

      {/* Top wave */}
      <div className="absolute top-0 inset-x-0 leading-none rotate-180">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px]">
          <path fill="#ffffff" d="M0,40 C360,70 1080,10 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 pt-20 pb-8">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-xl">أ</span>
                <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-crimson-600 ring-2 ring-brand-950" />
              </div>
              <div>
                <p className="font-extrabold text-xl">{COMPANY_NAME}</p>
                <p className="text-white/50 text-xs">دعاية • تسويق • برمجة</p>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed text-sm max-w-xs">
              شركة متخصصة في الدعاية والإعلان والتسويق الإلكتروني والبرمجة وتطوير التطبيقات.
              نصنع النجاح الرقمي لعملائنا.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-extrabold text-lg mb-5">روابط سريعة</h4>
            <ul className="grid grid-cols-2 gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-500" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-lg mb-5">تواصل معنا</h4>
            <div className="space-y-3">
              <a href={WHATSAPP_LINK_1} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-crimson-600 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold" dir="ltr">{PHONE_1}</span>
              </a>
              <a href={TEL_LINK_1} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-brand-600 flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-semibold" dir="ltr">{PHONE_2}</span>
              </a>
            </div>

            <div className="flex gap-3 mt-6">
              <a href={WHATSAPP_LINK_1} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white/10 hover:bg-crimson-600 flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={TEL_LINK_1} className="w-11 h-11 rounded-xl bg-white/10 hover:bg-brand-600 flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center">
            © {new Date().getFullYear()} شركة {COMPANY_NAME}. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/40 text-xs">صُمم بكل احترافية وإبداع</p>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
