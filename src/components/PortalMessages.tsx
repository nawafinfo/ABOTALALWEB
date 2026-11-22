import { useEffect, useState } from 'react';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { supabase, Project, Profile } from '@/lib/supabase';
import ChatPanel from '@/components/ChatPanel';
import { useAuth } from '@/context/AuthContext';

export default function PortalMessages() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [adminForProject, setAdminForProject] = useState<Profile | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [projectsRes, adminsRes] = await Promise.all([
      supabase.from('projects').select('*').order('updated_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('is_admin', true),
    ]);

    setProjects((projectsRes.data as Project[]) || []);
    setAdmins((adminsRes.data as Profile[]) || []);
    setLoading(false);
  };

  const openChat = (project: Project) => {
    setSelectedProject(project);
    setAdminForProject(admins[0] ?? null);
  };

  if (!profile) return null;

  if (selectedProject && adminForProject) {
    return (
      <div>
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center gap-2 text-brand-700 hover:text-brand-600 text-sm font-bold mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
          رجوع للمحادثات
        </button>
        <ChatPanel
          projectId={selectedProject.id}
          myId={profile.id}
          peerId={adminForProject.id}
          peerName={adminForProject.full_name}
          peerRole="مدير المشروع"
        />
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-10 h-10 text-brand-300" />
          </div>
          <h3 className="text-xl font-extrabold text-brand-950 mb-2">لا توجد محادثات</h3>
          <p className="text-brand-700/60">ستتمكن من مراسلة فريق العمل بمجرد أن يبدأ مشروعك.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => openChat(project)}
              className="group text-right bg-white rounded-2xl p-5 border border-brand-100 hover:border-brand-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white flex-shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-brand-950 truncate group-hover:text-brand-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-brand-500 text-sm">تواصل مع مدير المشروع</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-brand-400 group-hover:text-brand-600 group-hover:-translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
