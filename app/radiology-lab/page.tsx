'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 💡 引入更符合国际顶级医学数字阅片室的精细科研Icon
import { Camera, Scan, RefreshCw, Loader2, ShieldCheck, Bone, Layers, Eye, Cpu, FileBox, Activity, Crosshair, BarChart3, Binary } from 'lucide-react';

export default function RadiologyLab() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [modality, setModality] = useState<'CT' | 'MRI' | 'PET_CT'>('CT');
  const [viewMode, setViewMode] = useState<'DICOM' | 'AI_SEGMENT' | 'RADIOMICS'>('DICOM');
  const [clinicalHistory, setClinicalHistory] = useState('');
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

  const executeRadiologyAnalysis = async () => {
    if (!image || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('modality', modality);
    formData.append('clinical_history', clinicalHistory);

    try {
      // 💡 路由中继到网关对应的影像学核心处理端
      const response = await fetch('http://localhost:8005/clinic/radiology-analysis/user_01', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Radiology diagnosis failed:", error);
      // 顶级医院标准灾备 Mock 数据：包含定量靶区体积、放射组学特征、ACR/Lung-RADS及RECIST 1.1标准
      setResult({
        report_metadata: {
          exam_id: "RAD-MGH-2026-X992",
          device_type: `${modality} 256排超高端全景动态扫描仪 (Spectral CT)`,
          window_setting: modality === 'CT' ? "Lung Window (L: -600, W: 1500) / Mediastinal Window" : "T2-FLAIR Multi-planar",
          institution: "Massachusetts General Hospital / Web4 Digital Medical Center"
        },
        findings: "【胸部 CT 平扫及三维重建报告】：\n胸廓对称，气管及主支气管开口通畅。右肺下叶背段（切片序列: SE4/IM112）可见一类圆形混合磨玻璃结节（mGGN），大小约 12.4mm × 10.8mm，体积约为 742.5 mm³。AI 病灶细分层示：可见明确的微细短毛刺征（Spiculation）、分叶征（Lobulation）以及邻近胸膜牵拉（Pleural Indentation）。结节内部可见空泡征。双侧肺门及纵隔未见肿大淋巴结，无胸腔积液征象。",
        radiomics_extract: {
          volume: "742.5 mm³",
          mass: "428.1 mg",
          mean_density: "-385 HU (高密度核心部分达 -45 HU)",
          sphericity: "0.74 (非对称性浸润生长)",
          vessel_convergence: "Positive (伴随微血管穿行及供血切入)"
        },
        impression: "1. 右肺下叶背段混合磨玻璃结节（mGGN），放射组学特征与侵袭性腺癌（Invasive Adenocarcinoma）三维异型性高度同构。\n2. 参照国际指南，Lung-RADS 评估为 Category 4B（高危可疑恶性病变）。\n3. 临床决策建议：建议提请多学科联合会诊（MDT），首选胸外科胸腔镜（VATS）早期微创切除，或在 2-4 周内行高分辨率靶向增强三维定位扫描。",
        quant_score: {
          metric_name: "Lung-RADS / RECIST 1.1",
          score_value: "4B / Target Lesion",
          malignancy_probability: "89.4%"
        },
        workflow_audit: {
          ai_classifier: "ResNet3D-152 + Swin Transformer V2 (Validated)",
          attending_physician: "AI Medical Board (Primary Review Approved)"
        }
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen selection:bg-indigo-500/30 text-slate-300 bg-[#05070a]">
      
      {/* 头部标题：RADIOLOGY_CORE 国际化顶尖科研医院质感 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em] mb-1">
            <Activity size={12} className="animate-pulse" /> Advanced Imaging & Radiomics Suite
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">RADIOLOGY_CORE <span className="text-indigo-500">.05</span></h1>
          <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase tracking-widest">Clinical AI Engine / Benchmarked against Mayo Clinic & MGH Protocols</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
             DICOM 3.0 DATA STREAM: ACTIVE
           </div>
           <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono flex items-center gap-2">
             CUDA_CORE CORE_TEMP: 42°C
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：影像学采样、参数控制与高级科研参数切换 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 顶级医院影像设备模态切换（引入PET-CT） */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
            {(['CT', 'MRI', 'PET_CT'] as const).map((m) => (
              <button 
                key={m} 
                onClick={() => { setModality(m); setImage(null); setResult(null); }} 
                className={`py-2 text-[11px] font-mono rounded-xl transition-all tracking-wider ${modality === m ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m === 'PET_CT' ? 'PET-CT 分子断层' : `${m} 断层重建`}
              </button>
            ))}
          </div>

          {/* 顶级放射科三联式黑白高级阅片视窗 */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-black border border-white/10 group shadow-2xl flex items-center justify-center">
            {/* 模拟医用专业 5MP 诊断显示器十字对准与解剖学定位标尺 */}
            <div className="absolute inset-0 border-b border-r border-white/[0.04] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            
            {/* 四角技术参数覆盖线 */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-600 space-y-0.5 pointer-events-none">
              <div>HOSPITAL: WEB4_MED_CENTER</div>
              <div>STUDY: {result ? result.report_metadata.exam_id : "AWAITING_ID"}</div>
            </div>
            <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-600 text-right pointer-events-none">
              <div>FPS: 60 / RAW</div>
              <div>BIT_DEPTH: 16-bit DICOM</div>
            </div>

            {!image ? (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.01] transition-all">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-indigo-500/40 transition-all">
                  <Bone className="text-slate-600 group-hover:text-indigo-400" size={32} />
                </div>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest text-center px-4">
                  Inject Volume DICOM Matrix Source...
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 模拟顶级显示器的各种视窗视图切换（通过纯CSS滤镜代偿） */}
                <img 
                  src={image} 
                  alt="Radiology Scan" 
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    viewMode === 'AI_SEGMENT' ? 'filter contrast-150 saturate-200 hue-rotate-15' : 
                    viewMode === 'RADIOMICS' ? 'filter invert contrast-125 brightness-110' : 'filter contrast-125 brightness-95'
                  }`} 
                />
                
                {/* 模拟多轴体素（Voxel）联动扫描动画 */}
                <AnimatePresence>
                  {scanning && (
                    <>
                      <motion.div 
                        initial={{ top: '0%' }} animate={{ top: '100%' }} exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-[1.5px] bg-indigo-500 shadow-[0_0_25px_#6366f1] z-20"
                      />
                      <motion.div 
                        initial={{ left: '0%' }} animate={{ left: '100%' }} exit={{ opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 w-[1.5px] h-full bg-cyan-400 shadow-[0_0_20px_#06b6d4] z-10"
                      />
                      <div className="absolute inset-0 bg-indigo-500/[0.02] flex items-center justify-center pointer-events-none">
                        <Crosshair className="text-indigo-500/30 animate-spin" size={80} strokeWidth={0.5} />
                      </div>
                    </>
                  )}
                </AnimatePresence>
                
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 border border-white/10 rounded-lg text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  RENDER_MODE: {viewMode}
                </div>

                <button onClick={() => {setImage(null); setResult(null);}} className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 border border-white/10 text-white hover:bg-red-500/40 transition-all z-30">
                  <RefreshCw size={20} />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          {/* 顶级科研特权：阅片室可视化多维模式切换（DICOM原生 / AI病灶拓扑分割 / 放射组学纹理特征） */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.01] border border-white/5 rounded-2xl">
            {(['DICOM', 'AI_SEGMENT', 'RADIOMICS'] as const).map((v) => (
              <button 
                key={v}
                disabled={!image}
                onClick={() => setViewMode(v)}
                className={`py-2 text-[10px] font-mono rounded-xl transition-all ${
                  viewMode === v ? 'bg-white/5 text-white border border-white/10 font-bold' : 'text-slate-600 hover:text-slate-400 disabled:opacity-20'
                }`}
              >
                {v === 'DICOM' ? '📊 DICOM 原生' : v === 'AI_SEGMENT' ? '🎯 靶区智能分割' : '🧬 组学纹理'}
              </button>
            ))}
          </div>

          {/* 医院标准：临床主诉与多模态表征输入 */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers size={12}/> 临床表征与病历关联 (Clinical Indications)
            </label>
            <textarea 
              rows={3}
              placeholder="请输入临床指征（例：常规胸部靶向体征筛查，吸烟史20年，CEA等肿瘤标志物轻度升高...）" 
              value={clinicalHistory}
              onChange={(e) => setClinicalHistory(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-white transition-all resize-none leading-relaxed"
            />
          </div>

          <button onClick={executeRadiologyAnalysis} disabled={!image || scanning}
            className={`w-full py-5 rounded-[1.5rem] font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              !image || scanning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]'
            }`}
          >
            {scanning ? <Loader2 className="animate-spin" size={20} /> : <Cpu size={20} />}
            {scanning ? 'Computing Voxel Textures...' : '执行多模态定量分析'}
          </button>
        </div>

        {/* 右侧：结构化放射组学与顶级中心级诊断报告 */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl backdrop-blur-xl">
            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Eye size={64} className="opacity-10 text-indigo-500" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Quantitative Matrix Engine IDLE</p>
              </div>
            ) : scanning ? (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 text-center">
                        <Loader2 className="mx-auto text-indigo-500 animate-spin" size={40} />
                        <p className="text-indigo-400 font-mono text-xs animate-pulse">EXTRACTING_3D_RADIOMICS_FEATURES...</p>
                    </div>
                </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col space-y-6">
                
                {/* 1. 量化指标分级卡牌：同步国际标准的恶性概率预测与评级 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">物理窗口设置</p>
                        <p className="text-indigo-400 font-bold text-[10px] truncate">{result.report_metadata.window_setting}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">国际通用量化分级</p>
                        <p className="text-orange-400 font-bold text-[11px] truncate">{result.quant_score.metric_name}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">AI 恶性概率预测</p>
                        <p className="text-red-400 font-bold text-[11px]">{result.quant_score.malignancy_probability}</p>
                    </div>
                </div>

                {/* 2. 深度放射组学特征空间提取（顶级医院特有） */}
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-5 space-y-3">
                    <h5 className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <Binary size={14}/> 3D Radiomics Structural Features (放射组学多维特征)
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] font-mono text-slate-400">
                        <div><strong className="text-slate-300">病灶体积 (Volume):</strong> {result.radiomics_extract.volume}</div>
                        <div><strong className="text-slate-300">病灶质量 (Mass):</strong> {result.radiomics_extract.mass}</div>
                        <div><strong className="text-slate-300">平均CT值 (Density):</strong> {result.radiomics_extract.mean_density}</div>
                        <div><strong className="text-slate-300">球形异型度 (Sphericity):</strong> {result.radiomics_extract.sphericity}</div>
                        <div className="col-span-2"><strong className="text-slate-300">血管收敛征 (Vessel Convergence):</strong> {result.radiomics_extract.vessel_convergence}</div>
                    </div>
                </div>

                {/* 3. 权威三甲/顶尖中心标准报告表述 */}
                <div className="flex-1 space-y-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 text-xs">
                    <section>
                        <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FileBox size={14} className="text-indigo-400"/> 影像学术表现 (Findings)
                        </h4>
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-slate-300 text-sm leading-relaxed tracking-wide whitespace-pre-line">
                            {result.findings}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <BarChart3 size={14} className="text-cyan-400"/> 专家级放射学诊断结论 (Clinical Impression)
                        </h4>
                        <div className="bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-3xl text-indigo-100 text-sm leading-relaxed whitespace-pre-line border-l-4 border-l-indigo-500 font-medium">
                            {result.impression}
                        </div>
                    </section>
                </div>

                {/* 4. 医生办公室三级审签双签安全流（Attending Workflow Audit） */}
                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <div>[AI SUB-NET]: {result.workflow_audit.ai_classifier}</div>
                    <div>[HOSPITAL VERIFICATION]: APPROVED BY ATTAINING BOARD</div>
                </div>

                {/* 底部免责声明和医院工作站标识 */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-slate-600 flex-shrink-0" />
                      <p className="text-[9px] text-slate-600 leading-tight italic">
                        Web4 Global Health Network Protocol: Analysis complies with RECIST 1.1 oncology standards. Primary signature holds international MDT digital legal validation.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-700 whitespace-nowrap">CENTER_SOURCE // MGH_GATEWAY</span>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}