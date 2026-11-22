import { useEffect, useState } from 'react';
import { Menu, X, Phone, LayoutDashboard } from 'lucide-react';
import { COMPANY_NAME, NAV_LINKS, TEL_LINK_1 } from '@/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-brand-900/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-600/30 transition-transform group-hover:scale-105">
            <span className="text-white font-extrabold text-xl">أ</span>
            <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-crimson-600 ring-2 ring-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className={`font-extrabold text-lg ${scrolled ? 'text-brand-900' : 'text-white'}`}>
              {COMPANY_NAME}
            </span>
            <span className={`text-[11px] font-medium ${scrolled ? 'text-brand-500' : 'text-white/70'}`}>
              دعاية • تسويق • برمجة
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  scrolled
                    ? 'text-brand-800 hover:bg-brand-50 hover:text-brand-600'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Portal + Call button + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#portal"
            className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-95 ${
              scrolled
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/30'
                : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            بوابة العملاء
          </a>
          <a
            href={TEL_LINK_1}
            className="hidden sm:flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-crimson-600/30 transition-all hover:shadow-xl hover:scale-[1.03] active:scale-95"
          >
            <Phone className="w-4 h-4" />
            اتصل الآن
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-brand-800 bg-brand-50' : 'text-white bg-white/10'}`}
            aria-label="القائمة"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="bg-white mx-4 mt-3 rounded-2xl shadow-xl p-3 flex flex-col gap-1 border border-brand-100">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-brand-800 font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#portal"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-3 rounded-xl font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              بوابة العملاء
            </a>
          </li>
          <li>
            <a
              href={TEL_LINK_1}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 bg-crimson-600 text-white px-4 py-3 rounded-xl font-bold"
            >
              <Phone className="w-4 h-4" />
              اتصل الآن
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
