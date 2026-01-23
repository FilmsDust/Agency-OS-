
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Transaction, Invoice } from '../types';

interface AssistantProps {
  transactions: Transaction[];
  invoices: Invoice[];
}

const Assistant: React.FC<AssistantProps> = ({ transactions, invoices }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'HELLO I AM READY TO HELP YOU WITH YOUR FINANCE QUESTIONS' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg.toUpperCase() }]);
    setLoading(true);
    const response = await chatWithAssistant(userMsg, transactions, invoices);
    setMessages(prev => [...prev, { role: 'ai', text: response.toUpperCase() }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
      <div className="p-12 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-[10px] font-medium text-slate-900 uppercase tracking-[0.3em]">AI SUPPORT</h3>
        <button onClick={() => setMessages([{ role: 'ai', text: 'CHAT READY' }])} className="text-[9px] text-slate-300 uppercase tracking-widest">RESET</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] text-[10px] font-light leading-relaxed tracking-widest uppercase ${
              m.role === 'user' ? 'text-blue-500' : 'text-slate-600'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 border-t border-slate-50">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-8">
          <input 
            className="flex-1 outline-none text-[10px] uppercase tracking-widest font-light"
            placeholder="TYPE QUESTION HERE"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="text-[10px] font-medium uppercase text-blue-500">SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
