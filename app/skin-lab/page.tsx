'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 💡 替换更符合皮肤科的图标
import { Camera, Scan, Sparkles, RefreshCw, Loader2, Activity, ShieldCheck, HeartPulse, Beaker } from 'lucide-react';

export default function SkinLab() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const startScan = async () => {
    if (!image || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      // 💡 关键：路由改为你网关中的皮肤诊断路由
      const response = await fetch('http://localhost:8005/clinic/skin-diagnosis/user_01', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Diagnosis failed:", error);
      setResult({
        diagnosis: { skin_type: "ERR", severity_score: 0, primary_issues: ["连接失败"], detailed_analysis: "请检查后端 9000/8001/8000 端口服务" },
        expert_advice: "无法获取建议",
        status: "OFFLINE"
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      {/* 头部标题 - 修改为 DERMA_SCAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">DERMA_SCAN <span className="text-cyan-500">.02</span></h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">AI Dermatological Analysis Unit</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
             HYBRID_AI: ACTIVE (QWEN+GEMMA)
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：采样器 (复用你的设计) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900/50 border border-white/10 group shadow-2xl">
            {!image ? (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                  <Camera className="text-slate-500 group-hover:text-cyan-400" size={32} />
                </div>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Awaiting Skin Sample...</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img src={image} alt="Sample" className="w-full h-full object-cover" />
                <AnimatePresence>
                  {scanning && (
                    <motion.div 
                      initial={{ top: '0%' }} animate={{ top: '100%' }} exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_25px_#22d3ee] z-20"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button onClick={() => {setImage(null); setResult(null);}} className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 border border-white/10 text-white hover:bg-red-500/40 transition-all z-30">
                  <RefreshCw size={20} />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <button onClick={startScan} disabled={!image || scanning}
            className={`w-full py-5 rounded-[1.5rem] font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              !image || scanning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
            }`}
          >
            {scanning ? <Loader2 className="animate-spin" size={20} /> : <Scan size={20} />}
            {scanning ? 'Analyzing Epidermis...' : 'Execute Derma Scan'}
          </button>
        </div>

        {/* 右侧：皮肤化验报告 (改为展示 JSON 结构化数据) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl backdrop-blur-xl">
            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Activity size={64} className="opacity-10" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Derma System IDLE</p>
              </div>
            ) : scanning ? (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 text-center">
                        <Loader2 className="mx-auto text-cyan-500 animate-spin" size={40} />
                        <p className="text-cyan-400 font-mono text-xs animate-pulse">EXTRACTING_DERMAL_FEATURES...</p>
                    </div>
                </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                {/* 1. 核心指标卡片 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">Skin Type</p>
                        <p className="text-cyan-400 font-bold">{result.diagnosis.skin_type}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">Severity</p>
                        <p className="text-orange-400 font-bold">{result.diagnosis.severity_score}/10</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">Status</p>
                        <p className="text-green-400 font-bold">ANALYZED</p>
                    </div>
                </div>

                {/* 2. 详细分析 & RAG 建议 */}
                <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Beaker size={14} /> Clinical Analysis
                        </h4>
                        <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl text-slate-300 text-sm leading-relaxed">
                            {result.diagnosis.detailed_analysis}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <HeartPulse size={14} /> RAG Expert Advice (Gemma 3)
                        </h4>
                        <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-3xl text-cyan-50/90 text-sm leading-relaxed italic whitespace-pre-wrap">
                            {result.expert_advice}
                        </div>
                    </section>
                </div>

                {/* 底部免责声明 */}
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-slate-600" />
                    <p className="text-[10px] text-slate-600 leading-tight italic">
                        Web4 Tech Clinic Disclaimer: AI-generated reports are for reference only. 
                        Consult a human dermatologist for medical prescriptions.
                    </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}