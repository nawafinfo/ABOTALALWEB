import { ArrowLeft, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { COMPANY_NAME, TEL_LINK_1, WHATSAPP_LINK_1, PHONE_1 } from '@/data';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-brand-950">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-800 via-brand-950 to-brand-900" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-crimson-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="text-center lg:text-right animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-crimson-400" />
              <span className="text-white/90 text-sm font-semibold">شريكك المثالي للنجاح الرقمي</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6">
              شركة <span className="gradient-text">{COMPANY_NAME}</span>
              <br />
              للدعاية والإعلان والتسويق
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0">
              نحوّل أفكارك إلى واقع رقمي مبهر. خدمات متكاملة في الدعاية والإعلان والتسويق
              الإلكتروني والبرمجة وتطوير التطبيقات بأعلى معايير الاحترافية والإبداع.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={WHATSAPP_LINK_1}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-7 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-crimson-600" />
                تواصل عبر واتساب
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </a>
              <a
                href={TEL_LINK_1}
                className="inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-7 py-4 rounded-2xl font-bold shadow-xl shadow-crimson-600/30 transition-all hover:scale-[1.03] active:scale-95"
              >
                <Phone className="w-5 h-5" />
                اتصل بنا
              </a>
            </div>

            {/* Quick phone display */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-white/70">
              <span className="text-sm">أرقام التواصل:</span>
              <span className="font-bold text-white tracking-wide" dir="ltr">{PHONE_1}</span>
              <span className="font-bold text-white tracking-wide" dir="ltr">700897775</span>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-crimson-500/40 to-brand-400/40 blur-2xl scale-110" />

              {/* Card stack */}
              <div className="relative grid grid-cols-2 gap-4 w-[440px]">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 col-span-2 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-extrabold text-lg">أ</div>
                    <span className="text-white/60 text-sm font-semibold">إبداع • تميز</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-3/4 rounded-full bg-white/30" />
                    <div className="h-2.5 w-full rounded-full bg-white/20" />
                    <div className="h-2.5 w-1/2 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-xl h-32 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-crimson-500/80" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-white/30" />
                    <div className="h-2 w-2/3 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-xl h-32 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-lg bg-brand-400/80" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-white/30" />
                    <div className="h-2 w-3/4 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-crimson-600 to-crimson-800 rounded-3xl p-5 shadow-xl col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-semibold">معدل رضا العملاء</p>
                    <p className="text-white text-3xl font-extrabold mt-1">98%</p>
                  </div>
                  <div className="flex -space-x-2 space-x-reverse">
                    {['bg-brand-300', 'bg-brand-500', 'bg-white/60', 'bg-crimson-400'].map((c, i) => (
                      <div key={i} className={`w-9 h-9 rounded-full ${c} ring-2 ring-crimson-700`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 inset-x-0 leading-none">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[90px]">
          <path fill="#ffffff" d="M0,60 C360,100 1080,20 1440,60 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
