import { STATS as StatsData } from '@/data';

export default function Stats() {
  return (
    <section className="relative py-16 bg-gradient-to-l from-brand-700 via-brand-800 to-brand-950 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -top-20 left-1/3 w-72 h-72 bg-crimson-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {StatsData.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2">{stat.value}</p>
              <p className="text-white/80 font-semibold text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
