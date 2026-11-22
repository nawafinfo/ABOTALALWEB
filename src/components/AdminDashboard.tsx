import { useEffect, useState, useCallback } from 'react';
import {
  LogOut, Plus, X, FolderOpen, Users, FileText, MessageSquare, ChevronLeft,
  TrendingUp, Calendar, Clock, CheckCircle2, Save, Send, Search, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  supabase, Project, ProjectUpdate, Profile, Invoice, Message,
  PROJECT_TYPE_OPTIONS, PROJECT_TYPE_LABELS, PROJECT_STATUS_OPTIONS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS,
  INVOICE_STATUS_OPTIONS, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS,
  ProjectType, ProjectStatus, InvoiceStatus,
} from '@/lib/supabase';
import { COMPANY_NAME } from '@/data';
import ChatPanel from '@/components/ChatPanel';

type AdminTab = 'projects' | 'invoices' | 'messages' | 'clients';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>('projects');

  return (
    <div className="min-h-screen bg-brand-50/30" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-crimson-600 to-crimson-800 flex items-center justify-center shadow-lg shadow-crimson-600/30">
              <span className="text-white font-extrabold text-xl">أ</span>
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-brand-500 ring-2 ring-white" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-brand-950 text-lg">لوحة الإدارة</p>
              <p className="text-brand-500 text-xs">{COMPANY_NAME}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-crimson-50 rounded-xl px-4 py-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-crimson-500 to-crimson-700 flex items-center justify-center text-white font-bold text-sm">
                {profile?.full_name?.charAt(0) ?? '؟'}
              </div>
              <div className="leading-tight">
                <p className="font-bold text-brand-950 text-sm">{profile?.full_name ?? 'مدير'}</p>
                <p className="text-crimson-500 text-xs">مدير النظام</p>
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
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1.5 bg-white rounded-2xl border border-brand-100 shadow-sm w-fit overflow-x-auto">
          {([
            { id: 'projects', label: 'المشاريع', icon: <FolderOpen className="w-4 h-4" /> },
            { id: 'invoices', label: 'الفواتير', icon: <FileText className="w-4 h-4" /> },
            { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'clients', label: 'العملاء', icon: <Users className="w-4 h-4" /> },
          ] as { id: AdminTab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-crimson-600 text-white shadow-lg shadow-crimson-600/30'
                  : 'text-brand-700 hover:bg-brand-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'projects' && <AdminProjects />}
        {tab === 'invoices' && <AdminInvoices />}
        {tab === 'messages' && <AdminMessages />}
        {tab === 'clients' && <AdminClients />}
      </main>
    </div>
  );
}

// =========================================================
// Admin Projects: list, create, update progress, post updates
// =========================================================
function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
    supabase.from('profiles').select('*').eq('is_admin', false).then(({ data }) => {
      setClients((data as Profile[]) || []);
    });
  }, [loadProjects]);

  if (selectedProject) {
    return (
      <AdminProjectDetail
        project={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          loadProjects();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 max-w-2xl">
          <AdminStat icon={<FolderOpen className="w-5 h-5" />} label="إجمالي" value={projects.length} color="from-brand-500 to-brand-700" />
          <AdminStat icon={<TrendingUp className="w-5 h-5" />} label="نشطة" value={projects.filter((p) => p.status === 'in_progress' || p.status === 'planning').length} color="from-amber-500 to-amber-700" />
          <AdminStat icon={<Clock className="w-5 h-5" />} label="مراجعة" value={projects.filter((p) => p.status === 'review').length} color="from-purple-500 to-purple-700" />
          <AdminStat icon={<CheckCircle2 className="w-5 h-5" />} label="مكتملة" value={projects.filter((p) => p.status === 'completed').length} color="from-green-500 to-green-700" />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.03] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">مشروع جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <FolderOpen className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <p className="text-brand-700/60">لا توجد مشاريع بعد. ابدأ بإنشاء مشروع جديد.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project) => {
            const client = clients.find((c) => c.id === project.client_id);
            return (
              <div key={project.id} className="bg-white rounded-3xl p-6 border border-brand-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold text-brand-950 mb-1.5">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 rounded-full px-3 py-1">
                        {PROJECT_TYPE_LABELS[project.type] ?? project.type}
                      </span>
                      <span className={`text-xs font-bold rounded-full px-3 py-1 ${PROJECT_STATUS_COLORS[project.status] ?? 'bg-brand-100 text-brand-700'}`}>
                        {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                      </span>
                    </div>
                  </div>
                </div>
                {client && (
                  <p className="text-brand-500 text-sm mb-3 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {client.full_name}
                  </p>
                )}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-brand-800">التقدم</span>
                    <span className="text-sm font-extrabold text-brand-600">{project.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-brand-500 to-brand-700 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full flex items-center justify-center gap-2 text-brand-600 hover:bg-brand-50 rounded-xl py-2.5 text-sm font-bold transition-colors"
                >
                  إدارة المشروع
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateProjectModal
          clients={clients}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadProjects();
          }}
        />
      )}
    </div>
  );
}

function CreateProjectModal({ clients, onClose, onCreated }: { clients: Profile[]; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState<ProjectType>('programming');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('يرجى اختيار العميل');
      return;
    }
    setSaving(true);
    setError(null);

    const { error } = await supabase.from('projects').insert({
      title,
      client_id: clientId,
      type,
      status,
      progress: Number(progress),
      deadline: deadline || null,
      budget: budget ? Number(budget) : null,
      description: description || null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-brand-50 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-extrabold text-brand-950">إنشاء مشروع جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-brand-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-crimson-50 text-crimson-700 rounded-xl p-3 text-sm font-medium">{error}</div>
          )}

          {clients.length === 0 ? (
            <div className="bg-amber-50 text-amber-700 rounded-xl p-4 text-sm text-center">
              لا يوجد عملاء مسجلين بعد. يجب أن يسجل العميل أولاً قبل إنشاء مشروع له.
            </div>
          ) : (
            <>
              <Field label="اسم المشروع">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تصميم هوية بصرية"
                  className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                />
              </Field>

              <Field label="العميل">
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                >
                  <option value="">اختر العميل</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="نوع المشروع">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProjectType)}
                    className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                  >
                    {PROJECT_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="الحالة">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                  >
                    {PROJECT_STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={`نسبة التقدم: ${progress}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="الموعد النهائي">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                  />
                </Field>

                <Field label="الميزانية (ريال)">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0"
                    className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                  />
                </Field>
              </div>

              <Field label="وصف المشروع">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="تفاصيل المشروع..."
                  className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 focus:bg-white transition-all resize-none"
                />
              </Field>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ المشروع
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function AdminProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editProgress, setEditProgress] = useState(project.progress);
  const [editStatus, setEditStatus] = useState<ProjectStatus>(project.status);
  const [savingProgress, setSavingProgress] = useState(false);

  // New update form
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');
  const [updateProgressValue, setUpdateProgressValue] = useState<number | ''>('');
  const [updateStatus, setUpdateStatus] = useState<ProjectStatus | ''>('');
  const [postingUpdate, setPostingUpdate] = useState(false);

  const loadUpdates = useCallback(async () => {
    const { data } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });
    setUpdates((data as ProjectUpdate[]) || []);
    setUpdatesLoading(false);
  }, [project.id]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const saveProgress = async () => {
    setSavingProgress(true);
    await supabase
      .from('projects')
      .update({ progress: editProgress, status: editStatus })
      .eq('id', project.id);
    setSavingProgress(false);
  };

  const postUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateBody.trim()) return;
    setPostingUpdate(true);

    const { error } = await supabase.from('project_updates').insert({
      project_id: project.id,
      title: updateTitle.trim(),
      body: updateBody.trim(),
      progress_value: updateProgressValue === '' ? null : Number(updateProgressValue),
      status: updateStatus || null,
    });

    if (!error) {
      // If progress or status was specified in the update, also sync the project
      if (updateProgressValue !== '') {
        await supabase.from('projects').update({ progress: Number(updateProgressValue) }).eq('id', project.id);
        setEditProgress(Number(updateProgressValue));
      }
      if (updateStatus) {
        await supabase.from('projects').update({ status: updateStatus }).eq('id', project.id);
        setEditStatus(updateStatus);
      }

      setUpdateTitle('');
      setUpdateBody('');
      setUpdateProgressValue('');
      setUpdateStatus('');
      setShowUpdateForm(false);
      loadUpdates();
    }
    setPostingUpdate(false);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-brand-700 hover:text-brand-600 text-sm font-bold mb-4 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 rotate-180" />
        رجوع للمشاريع
      </button>

      {/* Project info */}
      <div className="bg-white rounded-3xl p-7 border border-brand-100 shadow-sm mb-6">
        <h1 className="text-2xl font-extrabold text-brand-950 mb-2">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold text-brand-600 bg-brand-50 rounded-full px-3 py-1">
            {PROJECT_TYPE_LABELS[project.type] ?? project.type}
          </span>
        </div>
        {project.description && <p className="text-brand-700/80 leading-relaxed mb-5">{project.description}</p>}

        {/* Progress + status editor */}
        <div className="bg-brand-50/50 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-brand-950 text-sm">تعديل سريع</h3>
          <div>
            <label className="block text-brand-800 text-sm font-semibold mb-2">{`نسبة التقدم: ${editProgress}%`}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={editProgress}
              onChange={(e) => setEditProgress(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </div>
          <div>
            <label className="block text-brand-800 text-sm font-semibold mb-2">الحالة</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
              className="w-full bg-white border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 transition-all"
            >
              {PROJECT_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={saveProgress}
            disabled={savingProgress}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {savingProgress ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>

      {/* Post update */}
      <div className="bg-white rounded-3xl p-7 border border-brand-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-brand-950">التحديثات</h2>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            تحديث جديد
          </button>
        </div>

        {showUpdateForm && (
          <form onSubmit={postUpdate} className="bg-brand-50/50 rounded-2xl p-5 space-y-4 mb-6">
            <Field label="عنوان التحديث">
              <input
                type="text"
                required
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="مثال: اكتمال مرحلة التصميم"
                className="w-full bg-white border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 transition-all"
              />
            </Field>
            <Field label="تفاصيل التحديث">
              <textarea
                required
                rows={3}
                value={updateBody}
                onChange={(e) => setUpdateBody(e.target.value)}
                placeholder="اكتب تفاصيل التحديث..."
                className="w-full bg-white border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 transition-all resize-none"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="تحديث نسبة التقدم (اختياري)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={updateProgressValue}
                  onChange={(e) => setUpdateProgressValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0-100"
                  className="w-full bg-white border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 transition-all"
                />
              </Field>
              <Field label="تحديث الحالة (اختياري)">
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as ProjectStatus | '')}
                  className="w-full bg-white border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 transition-all"
                >
                  <option value="">بدون تغيير</option>
                  {PROJECT_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </div>
            <button
              type="submit"
              disabled={postingUpdate}
              className="w-full flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {postingUpdate ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  نشر التحديث
                </>
              )}
            </button>
          </form>
        )}

        {updatesLoading ? (
          <div className="flex justify-center py-8">
            <span className="w-7 h-7 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : updates.length === 0 ? (
          <p className="text-brand-700/50 text-center py-8 text-sm">لا توجد تحديثات بعد</p>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="bg-brand-50/50 rounded-2xl p-4 border border-brand-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-extrabold text-brand-950 text-sm">{update.title}</h3>
                  <span className="text-xs text-brand-500 font-medium flex-shrink-0">
                    {new Date(update.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-brand-700/80 text-sm leading-relaxed mb-2">{update.body}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {update.progress_value !== null && (
                    <span className="text-xs font-bold text-brand-600 bg-white rounded-full px-3 py-0.5 border border-brand-100">
                      التقدم: {update.progress_value}%
                    </span>
                  )}
                  {update.status && (
                    <span className={`text-xs font-bold rounded-full px-3 py-0.5 ${PROJECT_STATUS_COLORS[update.status] ?? 'bg-brand-100 text-brand-700'}`}>
                      {PROJECT_STATUS_LABELS[update.status] ?? update.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// Admin Invoices
// =========================================================
function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const loadInvoices = useCallback(async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('issued_at', { ascending: false });
    setInvoices((data as Invoice[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInvoices();
    supabase.from('projects').select('*').then(({ data }) => setProjects((data as Project[]) || []));
    supabase.from('profiles').select('*').eq('is_admin', false).then(({ data }) => setClients((data as Profile[]) || []));
  }, [loadInvoices]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-brand-950">إدارة الفواتير</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.03] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">فاتورة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <FileText className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <p className="text-brand-700/60">لا توجد فواتير بعد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => {
            const project = projects.find((p) => p.id === inv.project_id);
            const client = clients.find((c) => c.id === inv.client_id);
            return (
              <div key={inv.id} className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-extrabold text-brand-950">{inv.title}</h3>
                    <p className="text-brand-500 text-sm" dir="ltr">#{inv.invoice_number}</p>
                  </div>
                  <span className={`text-xs font-bold rounded-full px-3 py-1.5 ${INVOICE_STATUS_COLORS[inv.status as InvoiceStatus] ?? 'bg-brand-100 text-brand-700'}`}>
                    {INVOICE_STATUS_LABELS[inv.status as InvoiceStatus] ?? inv.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-700/70 mb-3">
                  <span><strong className="text-brand-950">{inv.amount.toLocaleString('ar-EG')} ر.ي</strong></span>
                  <span>مدفوع: <strong className="text-green-700">{inv.paid_amount.toLocaleString('ar-EG')} ر.ي</strong></span>
                  {project && <span className="text-brand-500">| {project.title}</span>}
                  {client && <span className="text-brand-500">| {client.full_name}</span>}
                </div>
                <button
                  onClick={() => setEditingInvoice(inv)}
                  className="text-brand-600 hover:bg-brand-50 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
                >
                  تعديل / تحديث الدفع
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateInvoiceModal
          projects={projects}
          clients={clients}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); loadInvoices(); }}
        />
      )}

      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onUpdated={() => { setEditingInvoice(null); loadInvoices(); }}
        />
      )}
    </div>
  );
}

function CreateInvoiceModal({ projects, clients, onClose, onCreated }: { projects: Project[]; clients: Profile[]; onClose: () => void; onCreated: () => void }) {
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);
    if (!project) { setError('اختر المشروع'); return; }
    setSaving(true);
    setError(null);

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const { error } = await supabase.from('invoices').insert({
      project_id: projectId,
      client_id: project.client_id,
      invoice_number: invoiceNumber,
      title,
      amount: Number(amount),
      due_date: dueDate || null,
      notes: notes || null,
      status: 'unpaid',
      paid_amount: 0,
    });

    if (error) { setError(error.message); setSaving(false); return; }
    setSaving(false);
    onCreated();
  };

  return (
    <Modal title="إنشاء فاتورة جديدة" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-crimson-50 text-crimson-700 rounded-xl p-3 text-sm font-medium">{error}</div>}

        {projects.length === 0 ? (
          <div className="bg-amber-50 text-amber-700 rounded-xl p-4 text-sm text-center">لا توجد مشاريع. أنشئ مشروعاً أولاً.</div>
        ) : (
          <>
            <Field label="المشروع">
              <select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 focus:outline-none focus:border-brand-300 transition-all">
                <option value="">اختر المشروع</option>
                {projects.map((p) => {
                  const client = clients.find((c) => c.id === p.client_id);
                  return <option key={p.id} value={p.id}>{p.title} — {client?.full_name ?? ''}</option>;
                })}
              </select>
            </Field>

            <Field label="عنوان الفاتورة">
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: دفعة أولى - تصميم" className="input-base" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="المبلغ (ريال)">
                <input type="number" required min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="input-base" />
              </Field>
              <Field label="تاريخ الاستحقاق">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-base" />
              </Field>
            </div>

            <Field label="ملاحظات">
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." className="input-base resize-none" />
            </Field>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> إنشاء الفاتورة</>}
            </button>
          </>
        )}
      </form>
    </Modal>
  );
}

function EditInvoiceModal({ invoice, onClose, onUpdated }: { invoice: Invoice; onClose: () => void; onUpdated: () => void }) {
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status as InvoiceStatus);
  const [paidAmount, setPaidAmount] = useState(String(invoice.paid_amount));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('invoices')
      .update({ status, paid_amount: Number(paidAmount) })
      .eq('id', invoice.id);

    if (error) { setError(error.message); setSaving(false); return; }
    setSaving(false);
    onUpdated();
  };

  return (
    <Modal title={`تعديل فاتورة #${invoice.invoice_number}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-crimson-50 text-crimson-700 rounded-xl p-3 text-sm font-medium">{error}</div>}

        <div className="bg-brand-50/50 rounded-xl p-4 text-sm">
          <p className="text-brand-700"><strong className="text-brand-950">{invoice.title}</strong></p>
          <p className="text-brand-500">المبلغ الإجمالي: {invoice.amount.toLocaleString('ar-EG')} ر.ي</p>
        </div>

        <Field label="حالة الفاتورة">
          <select value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)} className="input-base">
            {INVOICE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="المبلغ المدفوع (ريال)">
          <input type="number" min={0} step="0.01" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="input-base" />
        </Field>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
        </button>
      </form>
    </Modal>
  );
}

// =========================================================
// Admin Messages
// =========================================================
function AdminMessages() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    supabase.from('projects').select('*').order('updated_at', { ascending: false }).then(({ data }) => {
      setProjects((data as Project[]) || []);
      setLoading(false);
    });
    supabase.from('profiles').select('*').eq('is_admin', false).then(({ data }) => {
      setClients((data as Profile[]) || []);
    });
  }, []);

  if (!profile) return null;

  if (selectedClient && selectedProject) {
    return (
      <div>
        <button
          onClick={() => { setSelectedClient(null); setSelectedProject(null); }}
          className="flex items-center gap-2 text-brand-700 hover:text-brand-600 text-sm font-bold mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
          رجوع للعملاء
        </button>
        <div className="max-w-2xl">
          <ChatPanel
            projectId={selectedProject.id}
            myId={profile.id}
            peerId={selectedClient.id}
            peerName={selectedClient.full_name}
            peerRole="العميل"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-brand-950 mb-6">رسائل العملاء</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <MessageSquare className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <p className="text-brand-700/60">لا يوجد عملاء مسجلون بعد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => {
            const clientProjects = projects.filter((p) => p.client_id === client.id);
            if (clientProjects.length === 0) return null;
            return (
              <div key={client.id} className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg">
                    {client.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-950">{client.full_name}</h3>
                    <p className="text-brand-500 text-sm" dir="ltr">{client.phone ?? ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {clientProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => { setSelectedClient(client); setSelectedProject(project); }}
                      className="flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================
// Admin Clients list
// =========================================================
function AdminClients() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').eq('is_admin', false).order('created_at', { ascending: false }).then(({ data }) => {
      setClients((data as Profile[]) || []);
      setLoading(false);
    });
    supabase.from('projects').select('*').then(({ data }) => setProjects((data as Project[]) || []));
  }, []);

  const filtered = clients.filter((c) =>
    c.full_name.includes(search) || (c.phone ?? '').includes(search)
  );

  return (
    <div>
      <h2 className="text-xl font-extrabold text-brand-950 mb-6">العملاء</h2>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          className="w-full bg-white border border-brand-100 rounded-xl pr-11 pl-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <Users className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <p className="text-brand-700/60">لا يوجد عملاء مسجلون.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((client) => {
            const clientProjects = projects.filter((p) => p.client_id === client.id);
            return (
              <div key={client.id} className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg">
                    {client.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-brand-950">{client.full_name}</h3>
                    {client.phone && <p className="text-brand-500 text-sm" dir="ltr">{client.phone}</p>}
                    {client.company && <p className="text-brand-400 text-xs">{client.company}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-700/70 pt-3 border-t border-brand-50">
                  <FolderOpen className="w-4 h-4" />
                  <span>{clientProjects.length} مشروع</span>
                  {clientProjects.length > 0 && (
                    <span className="text-brand-500">| {clientProjects.filter((p) => p.status !== 'completed').length} نشط</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================
// Shared UI helpers
// =========================================================
function AdminStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-brand-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md mb-2`}>
        {icon}
      </div>
      <p className="text-xl font-extrabold text-brand-950">{value}</p>
      <p className="text-brand-600/70 text-xs font-medium">{label}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-brand-800 text-sm font-semibold mb-2">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-brand-50 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-extrabold text-brand-950">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-brand-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
