import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data';
import { useReveal } from '@/hooks/useReveal';

export default function Testimonials() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="testimonials" className="py-24 bg-brand-50/50 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-100/60 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-crimson-100/50 rounded-full blur-3xl" />

      <div ref={ref} className={`relative max-w-7xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <span className="inline-block text-brand-600 font-bold text-sm tracking-wider mb-3">آراء العملاء</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 mb-4">
            ماذا يقول <span className="text-crimson-600">عملاؤنا</span>
          </h2>
          <p className="text-brand-700/70 text-lg max-w-2xl mx-auto">
            ثقة عملائنا هي أغلى ما نملك، وهذه بعض من تجاربهم معنا
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`relative bg-white rounded-3xl p-7 shadow-lg shadow-brand-900/5 border border-brand-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Quote className="w-10 h-10 text-brand-200 mb-4 rotate-180" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-crimson-500 text-crimson-500" />
                ))}
              </div>

              <p className="text-brand-800/80 leading-relaxed mb-6 text-[15px]">"{t.text}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-brand-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-extrabold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-brand-950">{t.name}</p>
                  <p className="text-brand-600/70 text-sm">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
