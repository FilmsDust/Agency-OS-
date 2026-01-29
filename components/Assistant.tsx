
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Transaction, Invoice } from '../types';

interface AssistantProps {
  transactions: Transaction[];
  invoices: Invoice[];
}

const Assistant: React.FC<AssistantProps> = ({ transactions, invoices }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello, I am your Financial Intelligence Assistant. Ask me anything about your cash flow or revenue.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const response = await chatWithAssistant(userMsg, transactions, invoices);
    // Note: The geminiService.ts should ideally be updated to use the system prompt logic, 
    // but here we ensure the UI handles it correctly in sentence case as requested.
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-white rounded-2xl shadow-sm border border-[#dadce0] overflow-hidden google-shadow animate-in slide-in-from-bottom-5">
      <div className="p-4 md:p-6 border-b border-[#f1f3f4] flex items-center justify-between bg-[#f8f9fa]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#4285F4] rounded-full animate-pulse"></div>
          <h3 className="text-[10px] md:text-[11px] font-semibold text-[#202124] uppercase tracking-widest">Financial Intelligence</h3>
        </div>
        <button onClick={() => setMessages([{ role: 'ai', text: 'Chat ready. How can I help today?' }])} className="text-[8px] md:text-[9px] font-semibold text-[#5f6368] hover:text-[#202124] uppercase tracking-widest transition-colors">Reset</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-[11px] md:text-xs leading-relaxed font-normal tracking-wide ${
              m.role === 'user' 
                ? 'bg-[#e8f0fe] text-[#1967d2] rounded-tr-none' 
                : 'bg-[#f1f3f4] text-[#3c4043] rounded-tl-none border border-[#dadce0]'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f1f3f4] px-4 py-2.5 rounded-2xl flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 border-t border-[#f1f3f4] bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 md:gap-4">
          <input 
            className="flex-1 outline-none text-[11px] md:text-xs tracking-wide font-normal p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl focus:border-[#4285F4] transition-all"
            placeholder="e.g. Which invoices are unpaid?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="bg-[#4285F4] text-white px-4 md:px-6 py-3 rounded-xl font-semibold text-[10px] md:text-xs uppercase tracking-widest shadow-md hover:bg-[#1967d2] disabled:opacity-50 transition-all active:scale-95"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
