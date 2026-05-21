'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Sparkles, Loader2, ShieldCheck, Heart, AlertCircle, 
  CheckCircle2, HeartPulse, RefreshCw, Lock, Globe, Smile, 
  Microscope, Zap, FileText, Stethoscope 
} from 'lucide-react';

export default function DentalVisionCoreConsole() {
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  
  // 🦷 Dental Clinical Modalities // 口腔医学诊疗模态
  const [modality, setModality] = useState<'CARIES' | 'PERIODONTAL' | 'ORTHO' | 'RESTORATION'>('CARIES');
  const [chiefComplaint, setChiefComplaint] = useState('');
  
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

  const executeDentalAnalysis = async () => {
    if (!hasFile) return;
    setScanning(true);
    // 模拟后端AI inference流
    await new Promise(resolve => setTimeout(resolve, 2800));
    
    setResult({
      safety_notice: "PIXEL_BUFFER_FLUSHED: Raw image fragments shredded post-inference. // 像素缓冲区已清除：原始影像碎片已物理销毁。",
      ai_diagnostic_focus: "DENTAL_MULTIMODAL_V4",
      primary_impression: "右下第二磨牙远中邻面龋（深龋）",
      primary_impression_en: "Distal occlusal caries, lower right 2nd molar",
      extracted_features: [
        { item: "釉质受损深度", val: "穿透牙本质浅层", item_en: "Dentin invasion depth", val_en: "Superficial dentin" },
        { item: "继发性炎症", val: "牙周膜间隙无增宽", item_en: "Secondary inflammation", val_en: "Normal PDL space" }
      ],
      patient_explanation: "影像显示您的牙齿邻面有明显的龋坏，已越过釉质层向神经推进。目前处于填充治疗黄金期。",
      patient_explanation_en: "Imaging shows a clear carious lesion on the proximal surface, advancing past enamel towards the pulp. It is the golden period for restorative treatment.",
      village_action_plan: "1. 请于 3 日内完成树脂充填；2. 建议使用含氟牙膏；3. 坚持使用牙线。",
      village_action_plan_en: "1. Complete resin filling within 3 days; 2. Use fluoride toothpaste; 3. Consistent flossing."
    });
    setScanning(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen text-slate-300 bg-[#030508] font-sans selection:bg-emerald-500/20">
      
      {/* 🛡️ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-[0.25em]">
            <ShieldCheck size={12} /> Global Dental Privacy & AI Diagnostic Pipeline // 全球口腔隐私与智能诊断管线
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">DentalVision AI 口腔全科智能工作站 <span className="text-slate-600">/ Full-Service Console</span></h1>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl text-[11px] text-slate-400 font-mono">
          <Globe size={14} className="text-emerald-400" /> NODE // ORAL_HEALTH_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Console: Input Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">01 / Clinical Modality // 诊疗模态</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.01] border border-white/5 rounded-xl">
              {(['CARIES', 'PERIODONTAL', 'ORTHO', 'RESTORATION'] as const).map(m => (
                <button key={m} onClick={() => setModality(m)} className={`py-3 text-[10px] rounded-lg transition-all ${modality === m ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-950 border border-dashed border-white/10 flex items-center justify-center">
            {!hasFile ? (
              <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4 mx-auto">
                  <Smile className="text-emerald-400" size={22} />
                </div>
                <span className="text-xs text-slate-200">Upload Intraoral Matrix // 上传口腔影像</span>
              </div>
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                <Zap size={32} className="text-emerald-400 mb-4 animate-pulse" />
                <h4 className="text-xs font-mono text-emerald-400">PIXEL_STREAM_LOCKED // 数据已锁定</h4>
                <button onClick={() => {setHasFile(false); setResult(null);}} className="mt-4 text-[10px] text-slate-600 underline">RESET // 重置</button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <textarea 
            rows={4}
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Describe your dental discomfort (主诉描述)..." 
            className="w-full px-4 py-3 text-xs bg-slate-900 border border-white/10 rounded-xl focus:border-emerald-500/50 text-white resize-none"
          />

          <button onClick={executeDentalAnalysis} disabled={!hasFile || scanning} className="w-full py-4 rounded-xl text-xs font-mono uppercase bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
            {scanning ? <Loader2 className="animate-spin inline mr-2" /> : "Initiate Diagnostic Stream // 开启研判流"}
          </button>
        </div>

        {/* Right Console: Telemetry Output */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-8 h-full flex flex-col justify-center">
            {!result ? (
              <div className="text-center text-slate-600 py-20">
                <Microscope size={40} className="opacity-10 mx-auto mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest">Waiting for Input Matrix // 等待数据流</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/10 flex items-start gap-2.5 font-mono text-[10px]">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="text-emerald-300 leading-relaxed uppercase">{result.safety_notice}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Diagnostic Impression // 诊断印象</div>
                  <div className="text-lg font-bold text-amber-400 leading-tight">{result.primary_impression}</div>
                  <div className="text-[11px] text-slate-500 font-mono tracking-tight">{result.primary_impression_en}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">🔬 Morphological Attributes // 特征细节</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {result.extracted_features.map((f: any, idx: number) => (
                      <div key={idx} className="bg-black/30 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="text-slate-200 font-medium">{f.item}</div>
                          <div className="text-[9px] text-slate-500 font-mono">{f.item_en}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-medium">{f.val}</div>
                          <div className="text-[9px] text-slate-600 font-mono">{f.val_en}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                    <Heart size={11} className="text-emerald-400" /> Clinical Interpretation // 专家释疑
                  </label>
                  <div className="bg-black/30 border border-white/5 p-4 rounded-xl leading-relaxed">
                    <div className="mb-2">{result.patient_explanation}</div>
                    <div className="text-[11px] text-slate-600 border-t border-white/5 pt-2 italic font-mono">{result.patient_explanation_en}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-400" /> Therapeutic Roadmap // 治疗路径
                  </label>
                  <div className="bg-emerald-950/[0.04] border border-emerald-500/10 p-4 rounded-xl text-emerald-50/90 leading-relaxed border-l-2 border-l-emerald-500">
                    <div className="mb-2">{result.village_action_plan}</div>
                    <div className="text-[11px] text-emerald-600/70 border-t border-emerald-500/10 pt-2 font-mono">{result.village_action_plan_en}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}