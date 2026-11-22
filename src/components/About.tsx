import { CheckCircle2, ArrowLeft, MessageCircle } from 'lucide-react';
import { COMPANY_NAME, WHATSAPP_LINK_1, WORK_STEPS } from '@/data';
import { useReveal } from '@/hooks/useReveal';

const FEATURES = [
  'فريق متخصص بخبرة سنوات في المجال',
  'تصاميم إبداعية عصرية تناسب هويتك',
  'متابعة ودعم فني مستمر بعد التسليم',
  'أسعار تنافسية تناسب جميع الميزانيات',
  'التزام كامل بالمواعيد المتفق عليها',
  'حلول مخصصة لكل عميل حسب احتياجه',
];

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-24 bg-brand-50/50 relative overflow-hidden">
      <div ref={ref} className={`max-w-7xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-crimson-600 font-bold text-sm tracking-wider mb-3">من نحن</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 mb-6 leading-tight">
              لماذا تختار شركة <span className="text-brand-600">{COMPANY_NAME}</span>؟
            </h2>
            <p className="text-brand-700/80 text-lg leading-relaxed mb-8">
              نحن فريق متخصص في تقديم حلول رقمية متكاملة تجمع بين الإبداع والاحترافية. نساعد
              الشركات والأفراد على بناء حضور قوي على الإنترنت وتحقيق أهدافهم التسويقية بكفاءة
              عالية. رضا عملائنا هو معيار نجاحنا.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3.5 mb-9">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-crimson-600 flex-shrink-0 mt-0.5" />
                  <span className="text-brand-800 font-medium text-[15px]">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_LINK_1}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-7 py-4 rounded-2xl font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.03] active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              ابدأ مشروعك معنا
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </a>
          </div>

          {/* Work steps */}
          <div className="relative">
            <div className="absolute right-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-brand-300 via-brand-200 to-crimson-200" />
            <div className="space-y-5">
              {WORK_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  style={{ transitionDelay: `${i * 100}ms` }}
                  className={`relative flex gap-5 items-start bg-white rounded-2xl p-5 shadow-lg shadow-brand-900/5 border border-brand-100 hover:border-brand-300 transition-all duration-300 ${
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                  }`}
                >
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-600/30">
                    <span className="text-white font-extrabold text-xl">{step.num}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-extrabold text-brand-950 mb-1">{step.title}</h3>
                    <p className="text-brand-700/70 text-[15px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
