import { PORTFOLIO } from '@/data';
import { useReveal } from '@/hooks/useReveal';
import { ArrowUpLeft } from 'lucide-react';

export default function Portfolio() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div ref={ref} className={`max-w-7xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <span className="inline-block text-brand-600 font-bold text-sm tracking-wider mb-3">أعمالنا</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 mb-4">
            مشاريع <span className="text-crimson-600">تعكس إبداعنا</span>
          </h2>
          <p className="text-brand-700/70 text-lg max-w-2xl mx-auto">
            نماذج من إنجازاتنا في مختلف المجالات التي حققت نجاحاً ملحوظاً لعملائنا
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO.map((item, i) => (
            <article
              key={item.title}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={`group relative overflow-hidden rounded-3xl h-64 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Hover icon */}
              <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <ArrowUpLeft className="w-5 h-5 text-white" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="inline-block text-xs font-bold text-white/90 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                  {item.category}
                </span>
                <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
                <div className="h-0.5 w-0 bg-white/70 group-hover:w-16 transition-all duration-500 mt-3" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
