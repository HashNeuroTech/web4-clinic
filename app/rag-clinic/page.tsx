'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, Bot, User, Loader2, BookOpen, Activity } from 'lucide-react';

export default function RagClinic() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好，我是 Web4 科技诊所的 RAG 健康助手。我已经接入了您的去中心化健康档案及最新的医学指南，请问有什么可以帮您？' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);


 // 自动滚动逻辑：只在有新消息时触发，且滚动到合适的位置
useEffect(() => {
  if (messages.length > 1) { // 初始欢迎语不触发
    chatEndRef.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "nearest" // 💡 关键：使用 nearest 避免过度滚动到底部
    });
  }
}, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8005/clinic/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: input }), // 严格匹配后端字段
      });

      if (!response.ok) throw new Error('控制中心未响应');

      const data = await response.json();
      const botResponse = data.answer || data.result || "检索结果：未找到相关文献支持。";
      
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '🚨 连接失败：请检查后端 9000 端口服务是否启动。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] p-6 max-w-7xl mx-auto">
      {/* 左侧：医学文献状态栏 */}
      <aside className="lg:w-1/4 space-y-4">
        <div className="clinic-card p-6 h-full flex flex-col bg-slate-900/40 border border-white/10 rounded-[2rem] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6 text-cyan-400">
            <BookOpen size={20} />
            <h2 className="font-bold uppercase tracking-widest text-sm">Knowledge Base</h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {['Clinical_Nutrition_2026.pdf', 'Hypertension.pdf', 'Social_Graph_Health.pdf'].map((doc, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl text-[11px] text-slate-400 flex items-center gap-2 hover:bg-white/10 transition-colors">
                <FileText size={14} className="text-cyan-500/50" /> {doc}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-mono text-green-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
                ENCRYPTION_ACTIVE
              </span>
              <Activity size={12} />
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧：主诊疗对话区 */}
      <section className="lg:w-3/4 flex flex-col bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl relative">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                    msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-800 border border-cyan-500/30'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-cyan-400" />}
                  </div>
                  <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white/5 border border-white/10 text-slate-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-3 items-center text-cyan-500 text-xs font-mono pl-14">
              <Loader2 className="animate-spin" size={14} /> 
              RAG_ENGINE_QUERYING_DOCUMENTS...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 输入控制台 */}
        <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-md">
          <div className="flex gap-4 items-center bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-cyan-500/50 transition-all shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入健康疑问，AI 将结合医学健康数据进行RAG医学指南数据库检索..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:outline-none text-white placeholder:text-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Send size={18} />
              <span className="hidden sm:inline">发送</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}