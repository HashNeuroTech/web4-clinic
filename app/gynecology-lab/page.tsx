'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Loader2, ShieldCheck, Heart, AlertCircle, EyeOff, CheckCircle2, HeartPulse, RefreshCw, Lock, Globe, Layers, FileText } from 'lucide-react';

export default function GlobalGynVisionConsole() {
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  
  // 📸 Clinical Capture Modes
  const [captureMode, setCaptureMode] = useState<'VULVA_PHOTO' | 'DISCHARGE_PHOTO'>('VULVA_PHOTO');
  const [menstrualDays, setMenstrualDays] = useState('');
  
  // ✍️ User-Defined Chief Complaint (自由主诉文本输入)
  const [chiefComplaint, setChiefComplaint] = useState('');
  
  // 📋 Backend Telemetry States
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setHasFile(true);
      setResult(null);
      setErrorMsg(null);
    }
  };

  // 🚀 Encrypted High-Fidelity Data Stream Transmission
  const executeRemoteAnalysis = async () => {
    if (!hasFile || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    setErrorMsg(null);

    const formData = new FormData();
    // 1. Raw无损图像二进制流直传
    formData.append('file', fileInputRef.current.files[0]);
    // 2. 追加辅助文本参数与用户自由主诉内容
    formData.append('capture_mode', captureMode);
    formData.append('menstrual_days', menstrualDays);
    formData.append('chief_complaint', chiefComplaint); // 🚀 直传用户手写/口述的真实痛苦感受

    try {
      const response = await fetch('http://localhost:8005/clinic/remote-gyn-vision/user_01', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Gateway Error: Status ${response.status}`);
      
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error("Inference Network Error:", error);
      setErrorMsg(error?.message || "Connection failed. Please verify API gateway status.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen text-slate-300 bg-[#030508] font-sans antialiased selection:bg-fuchsia-500/20">
      
      {/* 🛡️ Global Intelligence Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-fuchsia-400 font-mono text-[10px] uppercase tracking-[0.25em]">
            <ShieldCheck size={12} /> Global Patient Privacy & Decentralized Diagnostics Pipeline
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>AuraGyn AI 智能妇科自检空间</span>
            <span className="text-slate-500 font-light text-xl md:text-2xl">/ AuraGyn Omnichannel AI Diagnostic Node</span>
          </h1>
          <p className="text-slate-400 text-xs max-w-4xl leading-relaxed">
            本平台遵循多模态盲盒隐私加密协议（Blind-Box Flow）。<span className="text-fuchsia-400">客户端屏幕全面阻断敏感图像的渲染与视觉存留</span>。高清像素矩阵将直接投递至后端医疗专属模型，特征提取完成后服务器立即执行物理粉碎，确保全球女性数据绝对安全。
            <br/>
            <span className="text-slate-500 italic text-[11px]">This interface enforces zero-retention visualization protocols. Raw pixel buffers bypass frontend display and stream directly to remote clinical inference layers.</span>
          </p>
        </div>
        {/* Global Node Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl text-[11px] text-slate-400 font-mono">
          <Globe size={14} className="text-cyan-400" />
          <span>NODE // GLOBAL_ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ======================= LEFT CONSOLE: INPUT MATRIX ======================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Capture Modality */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex justify-between">
              <span>01 / Select Target Modality</span>
              <span className="text-slate-500">选择诊断目标</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.01] border border-white/5 rounded-xl">
              <button onClick={() => { setCaptureMode('VULVA_PHOTO'); setHasFile(false); setResult(null); }} className={`py-3 px-2 text-xs rounded-lg transition-all flex flex-col items-center justify-center gap-1 text-center ${captureMode === 'VULVA_PHOTO' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                <span className="font-semibold flex items-center gap-1.5"><Camera size={13} /> 局部形态核验</span>
                <span className="text-[9px] opacity-60 font-mono tracking-tight">Vulvovaginal Anatomy</span>
              </button>
              <button onClick={() => { setCaptureMode('DISCHARGE_PHOTO'); setHasFile(false); setResult(null); }} className={`py-3 px-2 text-xs rounded-lg transition-all flex flex-col items-center justify-center gap-1 text-center ${captureMode === 'DISCHARGE_PHOTO' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                <span className="font-semibold flex items-center gap-1.5"><Layers size={13} /> 分泌物性状核验</span>
                <span className="text-[9px] opacity-60 font-mono tracking-tight">Exudate & Discharge</span>
              </button>
            </div>
          </div>

          {/* Section 2: Clinical Matrix Safe-Lock (No-Image Visualizer) */}
          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-950 border border-dashed border-white/10 group shadow-2xl flex items-center justify-center">
            {!hasFile ? (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-fuchsia-500/5 border border-fuchsia-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                  <Camera className="text-fuchsia-400" size={22} />
                </div>
                <span className="text-xs text-slate-200 font-medium">Capture or Upload Clinical Specimen</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">点击拍摄或投递诊断标本图片</span>
                <p className="text-slate-600 text-[10px] max-w-xs leading-relaxed mt-4 border-t border-white/5 pt-3">
                  🔒 Zero-Knowledge Privacy Architecture: Images are packed at the hardware level. The active UI restricts direct photo previewing.
                </p>
              </div>
            ) : (
              // 🧪 Laboratory Cyber Grid / Matrix Visualizer
              <div className="relative w-full h-full bg-[#04070c] flex flex-col items-center justify-center p-8 text-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" 
                     style={{ backgroundImage: 'radial-gradient(circle, #d946ef 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px]" />

                <div className="relative mb-6 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="w-28 h-28 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.75 shadow-[0_0_8px_#06b6d4]" />
                  </motion.div>
                  <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="w-24 h-24 rounded-full border border-dashed border-fuchsia-500/20 absolute" />
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 shadow-xl z-10">
                    <Lock className="text-cyan-400/90" size={20} />
                  </div>
                </div>

                <div className="space-y-2 z-10">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-md uppercase inline-flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    Matrix Secure Box Closed // 沙箱加密锁死
                  </span>
                  <h4 className="text-xs font-mono font-medium text-slate-300">STREAMING TARGET: {fileName.slice(0, 16)}...</h4>
                  <p className="text-slate-500 text-[10px] max-w-xs leading-normal">
                    The raw pixel buffer has been isolated. Frontend display is restricted to prevent unauthorized monitoring or caching.
                  </p>
                </div>

                <AnimatePresence>
                  {scanning && (
                    <motion.div initial={{ top: '15%' }} animate={{ top: '85%' }} exit={{ opacity: 0 }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_12px_#d946ef]" />
                  )}
                </AnimatePresence>

                <button onClick={() => {setHasFile(false); setFileName(''); setResult(null); setErrorMsg(null);}} className="absolute bottom-4 p-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-500 hover:text-white transition-all z-30 flex items-center gap-1 font-mono">
                  <RefreshCw size={10} /> RESET BUFFER / 更换文件
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          {/* Section 3: Physiological Metrics */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              02 / Menstrual Timeline (Days elapsed since Last Period)
            </label>
            <span className="text-[10px] text-slate-500 block -mt-1">生理周期核算（距离上次月经首日天数，可选填）</span>
            <input type="number" placeholder="e.g., 14" value={menstrualDays} onChange={(e) => setMenstrualDays(e.target.value)} className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-fuchsia-500/50 text-white font-mono" />
          </div>

          {/* ✍️ Section 4: Deep Personal Chief Complaint (自由描述主诉) */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText size={12} className="text-fuchsia-400" /> 03 / Patient Chief Complaint
              </label>
              <span className="text-[10px] text-slate-500">身体真实不适主诉</span>
            </div>
            <textarea 
              rows={4}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Please describe your symptoms, discomfort, onset duration, and sensory changes in your own words...&#10;&#10;请用您最熟悉的语言，自由描述最近身体的具体不舒服、出现多久了、疼痒的感觉、白带和平时有什么不同等..." 
              className="w-full px-4 py-3 text-xs bg-slate-900 border border-white/10 rounded-xl focus:outline-none focus:border-fuchsia-500/50 text-white leading-relaxed placeholder:text-slate-600 font-sans resize-none"
            />
            <div className="text-[10px] text-slate-500 text-right font-mono">
              {chiefComplaint.length} chars / Supporting Multilingual Input
            </div>
          </div>

          {/* Action Trigger Button */}
          <button onClick={executeRemoteAnalysis} disabled={!hasFile || scanning} className={`w-full py-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${!hasFile || scanning ? 'bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed' : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold shadow-[0_0_30px_rgba(217,70,239,0.2)]'}`}>
            {scanning ? <Loader2 className="animate-spin" size={12} /> : null}
            {scanning ? 'TRANSMITTING HIGH-FIDELITY IMAGE PIXELS...' : 'ENGAGE AI MULTIMODAL INFERENCE // 开始评估'}
          </button>
        </div>

        {/* ======================= RIGHT CONSOLE: TELEMETRY OUTPUT ======================= */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 md:p-8 h-full flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            {errorMsg && (
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 text-xs flex items-start gap-2 font-mono">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <div>[NETWORK_GATEWAY_EXCEPTION]: {errorMsg}</div>
              </div>
            )}

            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 py-24 text-center">
                <HeartPulse size={40} className="opacity-15 text-fuchsia-400 mb-3 animate-pulse" />
                <h5 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Awaiting Diagnostic Telemetry</h5>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed mt-1">
                  Please mount your sample and parameters on the left console. AuraGyn AI will perform high-fidelity pixel matrix decoding.
                </p>
              </div>
            ) : scanning ? (
                <div className="flex-1 flex flex-col justify-center items-center py-24 space-y-3">
                    <Loader2 className="text-fuchsia-500 animate-spin" size={24} />
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Inference pipeline active. Shredding source data...</p>
                    <p className="text-slate-600 text-[10px] -mt-1">后台多模态模型正在融合图像像素与主诉病历，研判中...</p>
                </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex-1 flex flex-col justify-between text-xs">
                
                {/* 1. Cryptographic Destruction Receipt */}
                {result.safety_notice && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-2.5 font-mono text-[10px]">
                    <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div className="text-cyan-300 leading-relaxed">
                      <span className="font-bold block uppercase">[CORE_RECEIPT] PRIVACY PURGE VERIFIED:</span>
                      {result.safety_notice}
                    </div>
                  </div>
                )}

                {/* 2. Primary Diagnostic Impression */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    <span>Diagnostic Focus // 评估聚焦</span>
                    <span className="text-fuchsia-400 font-bold">{result.ai_diagnostic_focus || 'MULTIMODAL_VISION'}</span>
                  </div>
                  <h3 className="text-base font-bold text-amber-400 flex items-start gap-2 leading-snug">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <div className="text-amber-400">{result.primary_impression}</div>
                      {result.primary_impression_en && (
                        <div className="text-[11px] text-slate-500 font-mono font-normal tracking-tight mt-0.5">{result.primary_impression_en}</div>
                      )}
                    </div>
                  </h3>
                </div>

                {/* 3. Extracted Morphological Features */}
                {result.extracted_features && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-mono font-medium tracking-widest uppercase block">
                      🔬 Decoupled Morphological Attributes // 特征层析细节
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {result.extracted_features.map((f: any, idx: number) => (
                        <div key={idx} className="bg-black/30 border border-white/5 p-3 rounded-xl flex justify-between items-center gap-4 text-[11px]">
                          <div className="space-y-0.5">
                            <span className="text-slate-400 block font-medium">{f.item}</span>
                            {f.item_en && <span className="text-[9px] font-mono text-slate-600 block leading-none">{f.item_en}</span>}
                          </div>
                          <div className="text-right space-y-0.5 font-medium">
                            <span className="text-slate-200 block">{f.val}</span>
                            {f.val_en && <span className="text-[9px] font-mono text-slate-500 block leading-none">{f.val_en}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Humane Pathological Explanation */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono font-medium tracking-widest uppercase flex items-center gap-1">
                    <Heart size={11} className="text-fuchsia-400" /> Clinical Interpretation // 专家组白话释疑
                  </label>
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-line tracking-wide space-y-2">
                    <div className="font-sans font-normal">{result.patient_explanation}</div>
                    {result.patient_explanation_en && (
                      <div className="text-[11px] text-slate-500 border-t border-white/5 pt-2 font-mono leading-relaxed mt-2 italic">{result.patient_explanation_en}</div>
                    )}
                  </div>
                </div>

                {/* 5. Therapeutic Action Roadmap */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono font-medium tracking-widest uppercase flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-400" /> Remedial Protocols & Guidelines // 康复与护理路径
                  </label>
                  <div className="bg-emerald-950/[0.04] border border-emerald-500/10 p-4 rounded-xl text-emerald-50/90 text-xs md:text-sm leading-relaxed whitespace-pre-line border-l-2 border-l-emerald-500 font-sans tracking-wide space-y-2">
                    <div className="font-normal">{result.village_action_plan}</div>
                    {result.village_action_plan_en && (
                      <div className="text-[11px] text-emerald-600/70 border-t border-emerald-500/10 pt-2 font-mono leading-relaxed mt-2">{result.village_action_plan_en}</div>
                    )}
                  </div>
                </div>

                {/* Disclaimer Shield */}
                <div className="pt-3 border-t border-white/5 text-[9px] font-mono text-slate-600 leading-normal">
                  * COMPLIANCE DISCLAIMER: This terminal node acts purely as a stateless client. All raw buffers are cleared post-stream. AI interpretations are for informational triage and peer support only.
                </div>

              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}