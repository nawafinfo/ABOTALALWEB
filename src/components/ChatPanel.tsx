import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { supabase, Message } from '@/lib/supabase';

interface ChatPanelProps {
  projectId: string;
  myId: string;
  peerId: string;
  peerName: string;
  peerRole: string;
}

export default function ChatPanel({ projectId, myId, peerId, peerName, peerRole }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    setMessages((data as Message[]) || []);
    setLoading(false);

    // Mark received messages as read
    if (data) {
      const unread = (data as Message[]).filter(
        (m) => m.recipient_id === myId && m.read_at === null
      );
      for (const m of unread) {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('id', m.id);
      }
    }
  }, [projectId, myId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Poll for new messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);

    const { data } = await supabase
      .from('messages')
      .insert({
        project_id: projectId,
        sender_id: myId,
        recipient_id: peerId,
        body: input.trim(),
      })
      .select('*')
      .single();

    if (data) {
      setMessages((prev) => [...prev, data as Message]);
      setInput('');
    }
    setSending(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-100 shadow-sm flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-brand-50">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg">
          {peerName.charAt(0)}
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-brand-950">{peerName}</p>
          <p className="text-brand-500 text-xs">{peerRole}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-brand-50/30">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="w-7 h-7 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-brand-700/50 text-sm">لا توجد رسائل بعد. ابدأ المحادثة!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === myId;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    isMine
                      ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-sm'
                      : 'bg-white text-brand-950 border border-brand-100 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                  <p className={`text-[10px] mt-1.5 ${isMine ? 'text-white/60' : 'text-brand-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    {isMine && msg.read_at && ' • مقروء'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-brand-50 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-300 focus:bg-white transition-all text-sm"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          {sending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
