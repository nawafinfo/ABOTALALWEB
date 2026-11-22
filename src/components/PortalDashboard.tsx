import { useEffect, useState } from 'react';
import { LogOut, FolderOpen, Clock, CheckCircle2, TrendingUp, ChevronLeft, Calendar, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, Project, ProjectUpdate, PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/lib/supabase';
import { COMPANY_NAME } from '@/data';
import PortalInvoices from '@/components/PortalInvoices';
import PortalMessages from '@/components/PortalMessages';

type Tab = 'projects' | 'invoices' | 'messages';

export default function PortalDashboard() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  const openProject = async (project: Project) => {
    setSelectedProject(project);
    setUpdatesLoading(true);
    const { data } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });

    setUpdates((data as ProjectUpdate[]) || []);
    setUpdatesLoading(false);
  };

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'in_progress' || p.status === 'planning' || p.status === 'review').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    avgProgress: projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0,
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        updates={updates}
        updatesLoading={updatesLoading}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'projects', label: 'المشاريع', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'invoices', label: 'الفواتير', icon: <FileText className="w-4 h-4" /> },
    { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-50/30" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <span className="text-white font-extrabold text-xl">أ</span>
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-crimson-600 ring-2 ring-white" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-brand-950 text-lg">بوابة العملاء</p>
              <p className="text-brand-500 text-xs">{COMPANY_NAME}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-brand-50 rounded-xl px-4 py-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                {profile?.full_name?.charAt(0) ?? '؟'}
              </div>
              <div className="leading-tight">
                <p className="font-bold text-brand-950 text-sm">{profile?.full_name ?? 'عميل'}</p>
                <p className="text-brand-500 text-xs" dir="ltr">{profile?.phone ?? ''}</p>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
              className="hidden sm:flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              الموقع
            </a>
            <button
              onClick={signOut}
              className="flex items-center gap-2 bg-crimson-50 hover:bg-crimson-100 text-crimson-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 mb-2">
            مرحباً، {profile?.full_name?.split(' ')[0] ?? 'عميلنا العزيز'}
          </h1>
          <p className="text-brand-700/70">تابع تقدم مشاريعك، فواتيرك، وتواصل مع فريق العمل في مكان واحد</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1.5 bg-white rounded-2xl border border-brand-100 shadow-sm w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-brand-700 hover:bg-brand-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'projects' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<FolderOpen className="w-6 h-6" />} label="إجمالي المشاريع" value={stats.total} color="from-brand-500 to-brand-700" />
              <StatCard icon={<Clock className="w-6 h-6" />} label="مشاريع نشطة" value={stats.active} color="from-amber-500 to-amber-700" />
              <StatCard icon={<CheckCircle2 className="w-6 h-6" />} label="مشاريع مكتملة" value={stats.completed} color="from-green-500 to-green-700" />
              <StatCard icon={<TrendingUp className="w-6 h-6" />} label="متوسط التقدم" value={`${stats.avgProgress}%`} color="from-crimson-500 to-crimson-700" />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={() => openProject(project)} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'invoices' && profile && <PortalInvoices clientId={profile.id} />}

        {tab === 'messages' && <PortalMessages />}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-brand-950">{value}</p>
      <p className="text-brand-600/70 text-sm font-medium mt-0.5">{label}</p>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-right bg-white rounded-3xl p-6 border border-brand-100 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-600/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-brand-950 mb-1.5 group-hover:text-brand-600 transition-colors">
            {project.title}
          </h3>
          <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 rounded-full px-3 py-1">
            {PROJECT_TYPE_LABELS[project.type] ?? project.type}
          </span>
        </div>
        <span className={`text-xs font-bold rounded-full px-3 py-1.5 flex-shrink-0 ${PROJECT_STATUS_COLORS[project.status] ?? 'bg-brand-100 text-brand-700'}`}>
          {PROJECT_STATUS_LABELS[project.status] ?? project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-brand-700/70 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-800">نسبة الإنجاز</span>
          <span className="text-sm font-extrabold text-brand-600">{project.progress}%</span>
        </div>
        <div className="h-2.5 bg-brand-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-brand-500 to-brand-700 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-brand-600/60 font-medium pt-3 border-t border-brand-50">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          بدأ: {new Date(project.start_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        {project.deadline && (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            الموعد: {new Date(project.deadline).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-brand-600 text-sm font-bold group-hover:gap-2 transition-all">
        عرض التفاصيل
        <ChevronLeft className="w-4 h-4" />
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
      <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
        <FolderOpen className="w-10 h-10 text-brand-300" />
      </div>
      <h3 className="text-xl font-extrabold text-brand-950 mb-2">لا توجد مشاريع بعد</h3>
      <p className="text-brand-700/60 max-w-md mx-auto">
        سيتم عرض مشاريعك هنا بمجرد أن يبدأ فريق {COMPANY_NAME} العمل على طلبك.
      </p>
    </div>
  );
}

function ProjectDetail({
  project,
  updates,
  updatesLoading,
  onBack,
}: {
  project: Project;
  updates: ProjectUpdate[];
  updatesLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-50/30" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-brand-700 hover:text-brand-600 text-sm font-bold transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
            رجوع للمشاريع
          </button>
          <div className="h-6 w-px bg-brand-100" />
          <p className="font-extrabold text-brand-950 text-lg truncate">{project.title}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="bg-white rounded-3xl p-7 border border-brand-100 shadow-sm mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-brand-950 mb-2">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 rounded-full px-3 py-1">
                  {PROJECT_TYPE_LABELS[project.type] ?? project.type}
                </span>
                <span className={`text-xs font-bold rounded-full px-3 py-1.5 ${PROJECT_STATUS_COLORS[project.status] ?? 'bg-brand-100 text-brand-700'}`}>
                  {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                </span>
              </div>
            </div>
          </div>

          {project.description && (
            <p className="text-brand-700/80 leading-relaxed mb-6">{project.description}</p>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-semibold text-brand-800">نسبة الإنجاز الإجمالية</span>
              <span className="text-2xl font-extrabold text-brand-600">{project.progress}%</span>
            </div>
            <div className="h-3.5 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-brand-500 via-brand-600 to-brand-700 rounded-full transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-brand-50">
            <MetaItem icon={<Calendar className="w-4 h-4" />} label="تاريخ البدء" value={new Date(project.start_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })} />
            <MetaItem icon={<Clock className="w-4 h-4" />} label="الموعد النهائي" value={project.deadline ? new Date(project.deadline).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : 'غير محدد'} />
            {project.budget && <MetaItem icon={<TrendingUp className="w-4 h-4" />} label="الميزانية" value={`${project.budget.toLocaleString('ar-EG')} ريال`} />}
            <MetaItem icon={<CheckCircle2 className="w-4 h-4" />} label="آخر تحديث" value={new Date(project.updated_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-brand-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-950 mb-6">آخر التحديثات</h2>

          {updatesLoading ? (
            <div className="flex justify-center py-12">
              <span className="w-7 h-7 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-7 h-7 text-brand-300" />
              </div>
              <p className="text-brand-700/60">لا توجد تحديثات على هذا المشروع بعد</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-300 via-brand-200 to-transparent" />
              <div className="space-y-6">
                {updates.map((update, i) => (
                  <div
                    key={update.id}
                    style={{ transitionDelay: `${i * 80}ms` }}
                    className="relative flex gap-5 items-start animate-fade-up"
                  >
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md ring-4 ring-white">
                      <span className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="flex-1 bg-brand-50/50 rounded-2xl p-5 border border-brand-100">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-extrabold text-brand-950">{update.title}</h3>
                        <span className="text-xs text-brand-500 font-medium flex-shrink-0">
                          {new Date(update.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-brand-700/80 text-sm leading-relaxed mb-3">{update.body}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {update.progress_value !== null && (
                          <span className="text-xs font-bold text-brand-600 bg-white rounded-full px-3 py-1 border border-brand-100">
                            التقدم: {update.progress_value}%
                          </span>
                        )}
                        {update.status && (
                          <span className={`text-xs font-bold rounded-full px-3 py-1 ${PROJECT_STATUS_COLORS[update.status] ?? 'bg-brand-100 text-brand-700'}`}>
                            {PROJECT_STATUS_LABELS[update.status] ?? update.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-brand-500 text-xs font-medium mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-brand-950 font-bold text-sm">{value}</p>
    </div>
  );
}
