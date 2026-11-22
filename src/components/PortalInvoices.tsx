import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { supabase, Invoice, InvoiceStatus, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '@/lib/supabase';

export default function PortalInvoices({ clientId }: { clientId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('issued_at', { ascending: false });

    setInvoices((data as Invoice[]) || []);
    setLoading(false);
  };

  const stats = {
    total: invoices.length,
    unpaid: invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    totalDue: invoices
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + (i.amount - i.paid_amount), 0),
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InvoiceStat icon={<FileText className="w-6 h-6" />} label="إجمالي الفواتير" value={stats.total} color="from-brand-500 to-brand-700" />
        <InvoiceStat icon={<Clock className="w-6 h-6" />} label="بانتظار الدفع" value={stats.unpaid} color="from-amber-500 to-amber-700" />
        <InvoiceStat icon={<CheckCircle2 className="w-6 h-6" />} label="مدفوعة" value={stats.paid} color="from-green-500 to-green-700" />
        <InvoiceStat icon={<AlertCircle className="w-6 h-6" />} label="المبلغ المستحق" value={`${stats.totalDue.toLocaleString('ar-EG')} ر.ي`} color="from-crimson-500 to-crimson-700" />
      </div>

      {/* Invoice list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100">
          <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-10 h-10 text-brand-300" />
          </div>
          <h3 className="text-xl font-extrabold text-brand-950 mb-2">لا توجد فواتير بعد</h3>
          <p className="text-brand-700/60">سيتم عرض فواتيرك هنا عند إصدارها من قبل فريق العمل.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvoiceStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
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

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const remaining = invoice.amount - invoice.paid_amount;
  const progress = invoice.amount > 0 ? Math.round((invoice.paid_amount / invoice.amount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-brand-950 mb-1">{invoice.title}</h3>
            <p className="text-brand-500 text-sm font-medium" dir="ltr">#{invoice.invoice_number}</p>
          </div>
        </div>
        <span className={`text-xs font-bold rounded-full px-4 py-2 ${INVOICE_STATUS_COLORS[invoice.status as InvoiceStatus] ?? 'bg-brand-100 text-brand-700'}`}>
          {INVOICE_STATUS_LABELS[invoice.status as InvoiceStatus] ?? invoice.status}
        </span>
      </div>

      {invoice.notes && (
        <p className="text-brand-700/60 text-sm mb-4 bg-brand-50/50 rounded-xl p-3">{invoice.notes}</p>
      )}

      {/* Amount and progress */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-brand-50/50 rounded-xl p-4 text-center">
          <p className="text-brand-500 text-xs font-medium mb-1">المبلغ الإجمالي</p>
          <p className="text-xl font-extrabold text-brand-950">{invoice.amount.toLocaleString('ar-EG')} ر.ي</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-green-600/70 text-xs font-medium mb-1">المدفوع</p>
          <p className="text-xl font-extrabold text-green-700">{invoice.paid_amount.toLocaleString('ar-EG')} ر.ي</p>
        </div>
        <div className="bg-crimson-50 rounded-xl p-4 text-center">
          <p className="text-crimson-600/70 text-xs font-medium mb-1">المتبقي</p>
          <p className="text-xl font-extrabold text-crimson-700">{remaining.toLocaleString('ar-EG')} ر.ي</p>
        </div>
      </div>

      {/* Payment progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-800">نسبة الدفع</span>
          <span className="text-sm font-extrabold text-brand-600">{progress}%</span>
        </div>
        <div className="h-2.5 bg-brand-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-brand-600/60 font-medium pt-3 border-t border-brand-50">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          صدر: {new Date(invoice.issued_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        {invoice.due_date && (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            الاستحقاق: {new Date(invoice.due_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}
