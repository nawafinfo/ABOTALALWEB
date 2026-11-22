import { useAuth } from '@/context/AuthContext';
import PortalAuth from '@/components/PortalAuth';
import PortalDashboard from '@/components/PortalDashboard';

export default function Portal() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center" dir="rtl">
        <span className="w-10 h-10 border-3 border-brand-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return session ? <PortalDashboard /> : <PortalAuth />;
}
