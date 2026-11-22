import * as Icons from 'lucide-react';
import { SERVICES } from '@/data';
import { useReveal } from '@/hooks/useReveal';

export default function Services() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-crimson-50 rounded-full blur-3xl opacity-60" />

      <div ref={ref} className={`relative max-w-7xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand-600 font-bold text-sm tracking-wider mb-3">خدماتنا</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 mb-4">
            حلول رقمية <span className="text-crimson-600">متكاملة</span>
          </h2>
          <p className="text-brand-700/70 text-lg max-w-2xl mx-auto">
            نقدم باقة شاملة من الخدمات الاحترافية لتحقيق أهدافك التجارية ودعم نمو مشروعك
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = (Icons as any)[service.icon] as Icons.LucideIcon;
            return (
              <article
                key={service.title}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group relative bg-white rounded-3xl p-8 border border-brand-100 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-600/10 transition-all duration-300 hover:-translate-y-1.5 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {/* Number badge */}
                <span className="absolute top-6 left-6 text-5xl font-extrabold text-brand-50 group-hover:text-brand-100 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {Icon && <Icon className="w-7 h-7 text-white" />}
                  </div>
                  <h3 className="text-xl font-extrabold text-brand-950 mb-3">{service.title}</h3>
                  <p className="text-brand-700/70 leading-relaxed text-[15px]">{service.desc}</p>

                  <div className="mt-5 h-0.5 w-12 bg-gradient-to-l from-crimson-500 to-brand-500 group-hover:w-full transition-all duration-500" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
