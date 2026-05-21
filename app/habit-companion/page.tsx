'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, BrainCircuit, ShieldCheck, Trash2, PlusCircle, Calendar } from 'lucide-react';

export default function HabitCompanion() {
  const [habits, setHabits] = useState<any[]>([]); 
  const [activeHabit, setActiveHabit] = useState<any>(null); 
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ 统一连接 8005 网关，严禁直连 8002
  const GATEWAY_URL = "http://localhost:8005";
  const userId = "user_01";

  // 1. 初始化：通过网关获取列表
  const fetchHabits = async () => {
    try {
      // 💡 指向网关转发路径
      const res = await fetch(`${GATEWAY_URL}/clinic/habit-list/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHabits(Array.isArray(data) ? data : []);
      }
    } catch (e) { 
      console.error("同步失败，请检查 8005 网关状态"); 
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  // 2. 自动滚动聊天
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory]);

  // 3. 核心：登记新习惯 (通过网关转发)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const habitName = formData.get('habit') as string;
    if (!habitName) return;
    setLoading(true);

    try {
      // 💡 指向网关登记路径
      const res = await fetch(`${GATEWAY_URL}/clinic/habit-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          bad_habit: habitName,
          cost_per_time: 20,
          calories_per_time: 500
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        await fetchHabits(); 
        setActiveHabit(data.new_habit); 
        setChatHistory([{ role: 'ai', text: data.new_habit.ai_analysis }]); 
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("网关响应异常，登记失败");
    } finally { setLoading(false); }
  };

  // 4. 核心：删除习惯 (✅ 已修改为通过 8005 网关转发)
  const handleDelete = async (habitId: string) => {
    if (!confirm("确定要终止这项 21 天重塑协议吗？")) return;
    try {
      // 💡 关键：通过网关删除，不再直连 8002
      const res = await fetch(`${GATEWAY_URL}/clinic/habit-remove/${userId}/${habitId}`, { 
        method: 'DELETE' 
      });
      
      if (res.ok) {
        if (activeHabit?.habit_id === habitId) {
          setActiveHabit(null);
          setChatHistory([]);
        }
        fetchHabits();
      }
    } catch (e) { 
      console.error("删除请求未能送达网关"); 
    }
  };

  // 5. 核心：导师聊天 (通过网关转发)
  const handleSendMessage = async () => {
    if (!input.trim() || !activeHabit) return;
    const userMsg = input;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    try {
      // 💡 指向网关导师咨询路径
      const res = await fetch(`${GATEWAY_URL}/clinic/mentor-advice/${userId}/${activeHabit.habit_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.reply || "导师正在思考中..." }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "网关连接超时，请检查后端模型。" }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- 左侧面板 --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-purple-400" /> 21天自律协议
            </h2>
            
            <form onSubmit={handleRegister} className="flex gap-2 mb-8">
              <input 
                name="habit"
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-all"
                placeholder={loading ? "深度扫描心理机制中..." : "例如：熬夜、过量摄糖..."}
                required
                disabled={loading}
              />
              <button disabled={loading} className="p-3 bg-purple-600 rounded-xl hover:bg-purple-500 shadow-lg shadow-purple-900/40 transition-transform active:scale-90 disabled:bg-slate-700">
                <PlusCircle size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </form>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {habits.length === 0 && <p className="text-center text-slate-500 text-sm py-10">尚无启动协议</p>}
              {habits.map((h) => (
                <div 
                  key={h.habit_id}
                  onClick={() => {
                    setActiveHabit(h);
                    setChatHistory([{ role: 'ai', text: h.ai_analysis }]);
                  }}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border group relative ${
                    activeHabit?.habit_id === h.habit_id ? 'bg-purple-600/20 border-purple-500 shadow-inner' : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white tracking-tight italic">戒掉 {h.habit}</h3>
                    <button 
                      onClick={(e) => {e.stopPropagation(); handleDelete(h.habit_id)}} 
                      className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>进度 {h.days_streak} / 21</span>
                      <span className="text-purple-400">{Math.round((h.days_streak / 21) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                        style={{ width: `${Math.min((h.days_streak / 21) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 右侧对话框 --- */}
        <div className="lg:col-span-8 flex flex-col h-[750px] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {activeHabit ? (
            <>
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="font-bold text-sm tracking-wide text-white">Gemma 3 导师：{activeHabit.habit}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                   代币资产: <span className="text-yellow-500 font-bold">${activeHabit.balance} HC</span>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {chatHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-[15px] leading-relaxed shadow-lg ${
                      chat.role === 'ai' 
                      ? 'bg-slate-900/80 border border-white/10 text-slate-200 backdrop-blur-sm' 
                      : 'bg-purple-600 text-white rounded-tr-none font-medium'
                    }`} style={{ whiteSpace: 'pre-wrap' }}>
                      {chat.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5">
                <div className="relative flex gap-3">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="分享诱惑或挑战，导师会通过 CBT 疗法引导你..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  />
                  <button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl transition-all shadow-xl shadow-purple-900/20 active:scale-95">
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 p-10 text-center">
              <div className="p-8 bg-purple-500/5 rounded-full mb-6 border border-purple-500/10">
                <BrainCircuit size={80} className="opacity-20 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">21天，重塑大脑</h3>
              <p className="max-w-sm text-slate-500 leading-relaxed text-sm">
                习惯的本质是神经元连接。通过 21 天的强力干预，你的 $HC 代币不仅是数字奖励，更是意志力的数字资产。
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}