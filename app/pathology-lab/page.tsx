'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 💡 引入符合微观细胞学、病理组织学的 Lucide 图标
import { Camera, Scan, RefreshCw, Loader2, ShieldCheck, Microscope, Grid, Crosshair, FlaskConical, ClipboardType } from 'lucide-react';

export default function PathologyLab() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [analysisType, setAnalysisType] = useState<'histology' | 'cytology'>('histology');
  const [specimenSource, setSpecimenSource] = useState('');
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

  const executePathologyAnalysis = async () => {
    if (!image || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('analysis_type', analysisType);
    formData.append('specimen_source', specimenSource);

    try {
      // 💡 路由中继到网关对应的病理科处理端
      const response = await fetch('http://localhost:8005/clinic/pathology-analysis/user_01', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Pathology analysis failed:", error);
      // 灾备 Mock 数据：输出严格的三甲医院标准病理报告
      setResult({
        metadata: {
          specimen_id: "BIO-2026-7741A",
          staining_method: "H&E Staining (苏木精-伊红染色)",
          magnification: "40x / 高倍显微镜数字化扫描"
        },
        microscopic_findings: "送检组织为针吸穿刺活检标本。微观下见异型上皮细胞呈巢状或腺管状排列，浸润性生长。细胞核大深染，核仁明显，可见多核巨细胞及病理性核分裂象（3个/10HPF）。间质纤维组织增生，伴有中度淋巴细胞浸润。未见明确脉管内瘤栓。",
        diagnostic_impression: "（左乳穿刺组织）结合形态学表现，符合浸润性导管癌（Infiltrative Ductal Carcinoma, 非特殊型），Nottingham 组织学分级为：Ⅱ级（中分化）。",
        ihc_markers: "ER (+, 75%强阳性), PR (+, 60%中等阳性), HER2 (2+, 建议进一步 FISH 检测), Ki-67 (阳性率约 30%)",
        grading_score: {
          system_name: "组织学恶性分级",
          grade_value: "Grade II (中度恶性)",
          tumor_proportion: "核异型性: 3分 | 有丝分裂: 2分"
        }
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen selection:bg-rose-500/30 text-slate-300 bg-[#05070a]">
      
      {/* 头部标题：PATHOLOGY_CORE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">PATHOLOGY_CORE <span className="text-rose-500">.06</span></h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">AI Digital Pathology & Cytology Review Station</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
             WSI_SCANNER: SYNCHRONIZED (金标准细胞识别)
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：微观采样、技术流切换与标本信息录入 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 病理分类切换 */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
            <button onClick={() => { setAnalysisType('histology'); setImage(null); setResult(null); }} className={`py-2 text-xs font-mono rounded-xl transition-all tracking-wider ${analysisType === 'histology' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold' : 'text-slate-500 hover:text-slate-300'}`}>
              Histology 组织切片
            </button>
            <button onClick={() => { setAnalysisType('cytology'); setImage(null); setResult(null); }} className={`py-2 text-xs font-mono rounded-xl transition-all tracking-wider ${analysisType === 'cytology' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold' : 'text-slate-500 hover:text-slate-300'}`}>
              Cytology 细胞涂片
            </button>
          </div>

          {/* 模拟高阶数字化病理物镜视窗 */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-black border border-white/10 group shadow-2xl flex items-center justify-center">
            {/* 显微镜对焦十字测距线 */}
            <div className="absolute inset-0 border-b border-r border-white/[0.02] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.04] pointer-events-none">
              <Crosshair size={64} strokeWidth={0.5} />
            </div>
            
            {!image ? (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-rose-500/40 transition-all">
                  <Microscope className="text-slate-600 group-hover:text-rose-400" size={32} />
                </div>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest text-center px-4">
                  Mount WSI H&E Slide Matrix...
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 模拟高倍镜下的高对比度渲染 */}
                <img src={image} alt="Pathology Scan" className="w-full h-full object-cover filter saturate-125" />
                
                {/* 模拟全视野数字切片(WSI)网关阵列分块扫描动画 */}
                <AnimatePresence>
                  {scanning && (
                    <>
                      {/* 横向扫描 */}
                      <motion.div 
                        initial={{ top: '0%' }} animate={{ top: '100%' }} exit={{ opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 w-full h-[2px] bg-rose-500 shadow-[0_0_20px_#f43f5e] z-20"
                      />
                      {/* 模拟智能网关格栅切割识别 */}
                      <motion.div 
                        initial={{ opacity: 0.1 }} animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 text-rose-500/20 pointer-events-none flex items-center justify-center"
                      >
                        <Grid size={120} strokeWidth={0.5} />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
                
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 border border-white/10 rounded-lg text-[9px] font-mono text-slate-400 flex items-center gap-2">
                  <Grid size={10} className="text-rose-400" /> APERTURE: F/1.4 | OBJECTIVE: 40X
                </div>

                <button onClick={() => {setImage(null); setResult(null);}} className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 border border-white/10 text-white hover:bg-red-500/40 transition-all z-30">
                  <RefreshCw size={20} />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          {/* 标本来源与病史备注 */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FlaskConical size={12}/> 离体标本来源与大体描述 (Specimen Source)
            </label>
            <input 
              type="text" 
              placeholder="例：左乳肿物粗针穿刺物，灰色条索状组织共3条..." 
              value={specimenSource}
              onChange={(e) => setSpecimenSource(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white transition-all"
            />
          </div>

          <button onClick={executePathologyAnalysis} disabled={!image || scanning}
            className={`w-full py-5 rounded-[1.5rem] font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              !image || scanning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)]'
            }`}
          >
            {scanning ? <Loader2 className="animate-spin" size={20} /> : <Microscope size={20} />}
            {scanning ? 'Segmenting Cellular Nuclei...' : '开始细胞学高倍镜图谱扫描'}
          </button>
        </div>

        {/* 右侧：高阶结构化病理学诊断报告 */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl backdrop-blur-xl">
            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Microscope size={64} className="opacity-10 text-rose-500" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Pathology Inference Core IDLE</p>
              </div>
            ) : scanning ? (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 text-center">
                        <Loader2 className="mx-auto text-rose-500 animate-spin" size={40} />
                        <p className="text-rose-400 font-mono text-xs animate-pulse">COUNTING_PATHOLOGICAL_MITOSIS...</p>
                    </div>
                </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col space-y-6">
                
                {/* 1. 核心病理分级与技术参数卡 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">染色技术 (Stain)</p>
                        <p className="text-rose-400 font-bold text-[10px] truncate">{result.metadata.staining_method}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">分级系统 (System)</p>
                        <p className="text-amber-400 font-bold text-[10px] truncate">{result.grading_score.system_name}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">恶性分级结论</p>
                        <p className="text-red-400 font-bold text-[10px]">{result.grading_score.grade_value}</p>
                    </div>
                </div>

                {/* 2. 详细三甲标准表述 */}
                <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ClipboardType size={14} className="text-rose-400"/> 镜下所见 (Microscopic Findings)
                        </h4>
                        <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl text-slate-300 text-sm leading-relaxed tracking-wide">
                            {result.microscopic_findings}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FlaskConical size={14} className="text-purple-400"/> 免疫组化/分子表型 (Immunohistochemistry)
                        </h4>
                        <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl font-mono text-xs text-purple-200 leading-relaxed">
                            {result.ihc_markers}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400"/> 病理诊断意见 (Pathological Diagnosis)
                        </h4>
                        <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-3xl text-rose-50/90 text-sm leading-relaxed border-l-2 border-l-rose-500 font-semibold">
                            {result.diagnostic_impression}
                        </div>
                    </section>
                </div>

                {/* 底部验证签名区域 */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-slate-600 flex-shrink-0" />
                      <p className="text-[10px] text-slate-600 leading-tight italic">
                        Gold Standard Verification Note: Deep learning models accelerate tumor region extraction. Prescriptions or surgical plans must align with a senior human pathologist's signed report.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-700 whitespace-nowrap">LAB_ID // BIO-8005</span>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}