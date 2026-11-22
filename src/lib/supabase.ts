import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type ProjectType = 'advertising' | 'marketing' | 'programming' | 'design' | 'mobile' | 'seo';
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
export type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  company: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  progress: number;
  start_date: string;
  deadline: string | null;
  budget: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  body: string;
  progress_value: number | null;
  status: ProjectStatus | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  client_id: string;
  invoice_number: string;
  title: string;
  amount: number;
  status: InvoiceStatus;
  paid_amount: number;
  due_date: string | null;
  issued_at: string;
  notes: string | null;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  advertising: 'دعاية وإعلان',
  marketing: 'تسويق إلكتروني',
  programming: 'برمجة وتطوير',
  design: 'تصميم جرافيكي',
  mobile: 'تطبيقات جوال',
  seo: 'تحسين محركات البحث',
};

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: 'advertising', label: 'دعاية وإعلان' },
  { value: 'marketing', label: 'تسويق إلكتروني' },
  { value: 'programming', label: 'برمجة وتطوير' },
  { value: 'design', label: 'تصميم جرافيكي' },
  { value: 'mobile', label: 'تطبيقات جوال' },
  { value: 'seo', label: 'تحسين محركات البحث' },
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'قيد التخطيط',
  in_progress: 'قيد التنفيذ',
  review: 'قيد المراجعة',
  completed: 'مكتمل',
  on_hold: 'متوقف مؤقتاً',
};

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'قيد التخطيط' },
  { value: 'in_progress', label: 'قيد التنفيذ' },
  { value: 'review', label: 'قيد المراجعة' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'on_hold', label: 'متوقف مؤقتاً' },
];

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-brand-100 text-brand-700',
  review: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-crimson-100 text-crimson-700',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  unpaid: 'غير مدفوع',
  partial: 'مدفوع جزئياً',
  paid: 'مدفوع',
  overdue: 'متأخر',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  unpaid: 'bg-amber-100 text-amber-700',
  partial: 'bg-brand-100 text-brand-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-crimson-100 text-crimson-700',
};

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'unpaid', label: 'غير مدفوع' },
  { value: 'partial', label: 'مدفوع جزئياً' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'overdue', label: 'متأخر' },
];
