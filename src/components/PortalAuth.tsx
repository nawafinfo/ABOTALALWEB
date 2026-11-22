import { useState } from 'react';
import { Lock, Mail, ArrowLeft, AlertCircle, Phone, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { COMPANY_NAME } from '@/data';

type Mode = 'login' | 'signup';

export default function PortalAuth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, fullName, phone);
      if (error) {
        setError(error);
      } else {
        setError(null);
        setMode('login');
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-950 px-5 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-800 via-brand-950 to-brand-900" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-500/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-crimson-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Back to site */}
      <a
        href="/"
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للموقع
      </a>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-600/30">
              <span className="text-white font-extrabold text-2xl">أ</span>
              <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-crimson-600 ring-2 ring-brand-950" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            بوابة عملاء {COMPANY_NAME}
          </h1>
          <p className="text-white/60 text-sm mt-2">
            {mode === 'login' ? 'سجّل دخولك لمتابعة مشاريعك' : 'أنشئ حسابك لتتمكن من متابعة مشاريعك'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-crimson-500/15 border border-crimson-400/30 rounded-xl p-3.5">
              <AlertCircle className="w-5 h-5 text-crimson-300 flex-shrink-0 mt-0.5" />
              <p className="text-crimson-100 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full bg-white/10 border border-white/15 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="7XXXXXXXX"
                      dir="ltr"
                      className="w-full bg-white/10 border border-white/15 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all text-right"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="w-full bg-white/10 border border-white/15 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-white/10 border border-white/15 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-brand-300 focus:bg-white/15 transition-all text-right"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-brand-700 px-6 py-4 rounded-2xl font-extrabold shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
                className="text-brand-300 hover:text-brand-200 font-bold transition-colors"
              >
                {mode === 'login' ? 'أنشئ حساب جديد' : 'سجّل دخولك'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
