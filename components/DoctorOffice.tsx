'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Globe, Sparkles, Activity, Upload, 
  ExternalLink, FileText, Zap, X, Send, MessageSquare, BrainCircuit, Bot, Notebook
} from 'lucide-react';

interface MedicalPaper {
  id: string;
  title: string;
  journal: string;
  date: string;
  scrapeDate: string;
  url: string;
  abstract?: string;
}

export default function DoctorOffice() {
  // --- 1. 文献知识库状态 ---
  const [scrapeQuery, setScrapeQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [localPapers, setLocalPapers] = useState<MedicalPaper[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 2. 核心：自主解读/临床询问 (qwen2.5vl:7b) ---
  const [doctorQuery, setDoctorQuery] = useState(''); 
  const [clinicalResponse, setClinicalResponse] = useState(''); 
  const [isClinicalProcessing, setIsClinicalProcessing] = useState(false);
  const [selectedContext, setSelectedContext] = useState<MedicalPaper | null>(null);

  // --- 3. 综述生成功能 (qwen2.5vl:7b) ---
  const [reviewCommand, setReviewCommand] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [isReviewGenerating, setIsReviewGenerating] = useState(false);

  // 初始化加载
  useEffect(() => { 
    fetchLocalData(); 
  }, []);

  // 刷新文献列表
  const fetchLocalData = async () => {
    try {
      const res = await fetch('http://localhost:9005/doctor/local-papers');
      if (res.ok) {
        const data = await res.json();
        setLocalPapers(data);
      }
    } catch (e) { 
      console.error("后端连接失败，请检查 9005 端口是否启动"); 
    }
  };

  // 抓取最新文献
  const handleScrape = async () => {
    if (!scrapeQuery) return;
    setIsScraping(true);
    setClinicalResponse(`正在同步关于 "${scrapeQuery}" 的最新高分文献...`);
    
    try {
      const res = await fetch('http://localhost:9005/doctor/scrape-latest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: scrapeQuery, count: 5 })
      });
      
      if (res.ok) {
        // 关键：抓取成功后立即重新请求列表以同步 UI
        await fetchLocalData();
        setClinicalResponse("文献同步成功！已存入本地 Repository。");
        setScrapeQuery(''); 
      }
    } catch (e) {
      setClinicalResponse("同步失败，请检查网络或后端 PubMed 接口。");
    } finally {
      setIsScraping(false);
    }
  };

  // 临床实验室解读 (BioMistral)
  const handleClinicalAsk = async () => {
    if (!doctorQuery && !selectedContext) return;
    setIsClinicalProcessing(true);
    
    // 构造发送给后端的 Payload
    const payload = {
      title: selectedContext?.title || null, // 传标题，后端去 DB 查摘要
      question: doctorQuery || "请对该文献进行深度临床解读。"
    };

    try {
      const res = await fetch('http://localhost:9005/doctor/analyze-biomedical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setClinicalResponse(data.analysis);
    } catch (e) {
      setClinicalResponse("解读引擎连接超时，请检查后端运行状态。");
    } finally {
      setIsClinicalProcessing(false);
    }
  };

  // 生成综述报告
  const handleGenerateReview = async () => {
    if (!reviewCommand) return;
    setIsReviewGenerating(true);
    try {
      const res = await fetch('http://localhost:9005/doctor/generate-clinical-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: reviewCommand, lang: 'zh' })
      });
      const data = await res.json();
      setReviewResult(data.answer);
    } catch (e) {
      setReviewResult("综述生成失败。");
    } finally {
      setIsReviewGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] text-slate-300 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="max-w-[1600px] mx-auto flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-3">
            CLINIC_NODE <span className="text-emerald-500 text-[10px] font-mono not-italic bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">BIO_AGENT_V1.4</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <input type="file" ref={fileInputRef} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-2">
            <Upload size={14}/> 导入私有 PDF
          </button>
        </div>
      </header>

      {/* 三栏主布局 */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[82vh]">
        
        {/* 左栏：PubMed 实时同步与本地库 (1/4) */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <section className="bg-slate-900/40 border border-purple-500/10 rounded-3xl p-5 shrink-0 shadow-lg">
            <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Globe size={12} className={isScraping ? "animate-spin" : ""}/> PubMed Intelligence
            </h2>
            <div className="flex gap-2">
              <input 
                value={scrapeQuery} 
                onChange={(e) => setScrapeQuery(e.target.value)} 
                placeholder="输入病种/药物关键词..." 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-purple-500 outline-none transition-all"
              />
              <button onClick={handleScrape} disabled={isScraping} className="bg-purple-600 hover:bg-purple-500 p-2 rounded-xl text-white transition-colors">
                <Activity size={14}/>
              </button>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex-1 flex flex-col overflow-hidden shadow-inner">
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database size={12}/> Repository ({localPapers.length})
            </h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {localPapers.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={item.id || i}
                    onClick={() => setSelectedContext(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
                      selectedContext?.title === item.title 
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    <h3 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-relaxed">{item.title}</h3>
                    <div className="flex justify-between mt-2 items-center">
                      <span className="text-[8px] text-slate-500 font-mono uppercase italic">{item.journal}</span>
                      <span className="text-[8px] text-emerald-500/50">{item.date}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* 中栏：临床思维实验室 (核心解读区 2/4) */}
        <div className="lg:col-span-5 flex flex-col overflow-hidden">
          <section className="bg-gradient-to-br from-[#0d1117] to-black border border-emerald-500/20 rounded-[2.5rem] p-7 flex flex-col h-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="flex items-center justify-between mb-6 z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                  <BrainCircuit size={22}/>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">临床思维实验室</h2>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">BioMistral-7B Expert Engine</p>
                </div>
              </div>
              {selectedContext && (
                <button 
                  onClick={() => setSelectedContext(null)} 
                  className="group text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <span className="max-w-[120px] truncate">针对: {selectedContext.title}</span>
                  <X size={10} className="group-hover:rotate-90 transition-transform"/>
                </button>
              )}
            </div>

            {/* 回复展示区 */}
            <div className="flex-1 bg-black/40 border border-white/5 rounded-[2rem] p-6 mb-6 overflow-y-auto custom-scrollbar text-sm leading-relaxed text-slate-300 shadow-inner backdrop-blur-sm">
              {isClinicalProcessing ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-3 bg-white/5 w-full rounded-full"/>
                  <div className="h-3 bg-white/5 w-[92%] rounded-full"/>
                  <div className="h-3 bg-white/5 w-[85%] rounded-full"/>
                  <div className="h-3 bg-white/5 w-[40%] rounded-full"/>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {clinicalResponse || "实验室就绪。您可以输入临床疑问，或选中左侧文献进行精准数据提取（P值、样本量、HR值等）。"}
                </div>
              )}
            </div>

            {/* 常驻专业输入框 */}
            <div className="relative group z-10">
              <textarea 
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleClinicalAsk())}
                placeholder={selectedContext ? "针对该文献，您想了解具体的哪些指标或建议？" : "输入临床想法、药理询问或同步关键词..."}
                className="w-full h-36 bg-white/[0.02] border border-white/10 rounded-3xl px-6 py-5 text-xs focus:border-emerald-500/50 focus:bg-white/[0.04] outline-none transition-all resize-none shadow-lg placeholder:text-slate-600"
              />
              <button 
                onClick={handleClinicalAsk}
                disabled={isClinicalProcessing || (!doctorQuery && !selectedContext)}
                className="absolute bottom-5 right-5 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all disabled:opacity-20 disabled:grayscale shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isClinicalProcessing ? <Activity size={18} className="animate-spin"/> : <Send size={18}/>}
              </button>
            </div>
          </section>
        </div>

        {/* 右栏：全库综述引擎 (1/4) */}
        <div className="lg:col-span-4 flex flex-col overflow-hidden">
          <section className="bg-slate-900/40 border border-cyan-500/10 rounded-[2.5rem] p-7 flex flex-col h-full shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <Notebook size={22}/>
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">综述合成报告</h2>
            </div>
            
            <div className="space-y-4 mb-6 shrink-0">
              <textarea 
                value={reviewCommand}
                onChange={(e) => setReviewCommand(e.target.value)}
                placeholder="输入学术课题（如：生物制剂在克罗恩病中的应用进展）"
                className="w-full h-28 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-xs focus:border-cyan-500 outline-none resize-none transition-all"
              />
              <button 
                onClick={handleGenerateReview}
                disabled={isReviewGenerating}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98]"
              >
                {isReviewGenerating ? "正在进行全库语义聚合..." : "开始生成深度综述"}
              </button>
            </div>

            <div className="flex-1 bg-black/20 border border-white/5 rounded-3xl p-5 overflow-y-auto custom-scrollbar text-[11px] leading-relaxed text-slate-400 font-serif italic">
              {reviewResult || "综述结果将根据 Repository 中的所有相关文献自动合成..."}
            </div>
          </section>
        </div>
      </main>

      {/* 底部状态条 */}
      <footer className="max-w-[1600px] mx-auto mt-6 flex justify-between items-center px-2">
        <div className="flex gap-6 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Engine: BioMistral-7B</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Source: PubMed API</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Database: SQLite Active</span>
        </div>
        <div className="text-[9px] text-slate-700 italic">ClinicNode Decentralized Medical Laboratory © 2026</div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}