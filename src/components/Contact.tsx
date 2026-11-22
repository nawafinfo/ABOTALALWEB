import { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import {
  COMPANY_NAME,
  PHONE_1,
  PHONE_2,
  TEL_LINK_1,
  TEL_LINK_2,
  WHATSAPP_LINK_1,
  WHATSAPP_LINK_2,
} from '@/data';
import { useReveal } from '@/hooks/useReveal';

export default function Contact() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Compose a WhatsApp message with the form contents
    const text = `مرحباً شركة ${COMPANY_NAME}%0A%0Aالاسم: ${form.name}%0Aرقم التواصل: ${form.phone}%0A%0A${form.message}`;
    setTimeout(() => {
      setStatus('sent');
      window.open(`https://wa.me/967${PHONE_1}?text=${text}`, '_blank');
      setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', phone: '', message: '' });
      }, 3000);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl" />

      <div ref={ref} className={`relative max-w-7xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-bold text-sm tracking-wider mb-3">تواصل معنا</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 mb-4">
            جاهزون لـ <span className="text-crimson-600">إطلاق مشروعك</span>
          </h2>
          <p className="text-brand-700/70 text-lg max-w-2xl mx-auto">
            تواصل معنا الآن واحصل على استشارة مجانية لتحويل فكرتك إلى واقع ناجح
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href={WHATSAPP_LINK_1}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg shadow-brand-600/20 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold">واتساب</p>
                <p className="font-extrabold text-lg" dir="ltr">{PHONE_1}</p>
              </div>
            </a>

            <a
              href={WHATSAPP_LINK_2}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-brand-100 hover:border-brand-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-brand-600" />
              </div>
              <div>
                <p className="text-brand-600/70 text-sm font-semibold">واتساب</p>
                <p className="font-extrabold text-lg text-brand-950" dir="ltr">{PHONE_2}</p>
              </div>
            </a>

            <a
              href={TEL_LINK_1}
              className="group flex items-center gap-4 bg-gradient-to-br from-crimson-600 to-crimson-800 rounded-2xl p-6 text-white shadow-lg shadow-crimson-600/20 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold">اتصال مباشر</p>
                <p className="font-extrabold text-lg" dir="ltr">{PHONE_1}</p>
              </div>
            </a>

            <a
              href={TEL_LINK_2}
              className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-crimson-100 hover:border-crimson-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-crimson-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-crimson-600" />
              </div>
              <div>
                <p className="text-crimson-600/70 text-sm font-semibold">اتصال مباشر</p>
                <p className="font-extrabold text-lg text-brand-950" dir="ltr">{PHONE_2}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-brand-50 rounded-2xl p-6 border border-brand-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-brand-600" />
              </div>
              <div>
                <p className="text-brand-600/70 text-sm font-semibold">نخدمكم في كل مكان</p>
                <p className="font-extrabold text-lg text-brand-950">اليمن - جميع المحافظات</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-gradient-to-br from-brand-950 to-brand-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-crimson-600/20 rounded-full blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl font-extrabold text-white mb-2">أرسل لنا رسالة</h3>
              <p className="text-white/60 mb-7">سنقوم بالرد عليك في أقرب وقت ممكن</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">رقم التواصل</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="7XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all text-right"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">تفاصيل المشروع</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="أخبرنا عن مشروعك واحتياجاتك..."
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full flex items-center justify-center gap-2 bg-white text-brand-700 px-6 py-4 rounded-2xl font-extrabold shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {status === 'idle' && (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال عبر واتساب
                    </>
                  )}
                  {status === 'sending' && (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  )}
                  {status === 'sent' && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-crimson-600" />
                      تم الإرسال بنجاح
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
