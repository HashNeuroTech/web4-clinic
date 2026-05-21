'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 💡 替换为符合古典中医与现代科技交融的图标
import { Camera, Scan, Sparkles, RefreshCw, Loader2, Activity, ShieldCheck, Leaf, Heart, Flame } from 'lucide-react';

export default function TcmLab() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [sampleType, setSampleType] = useState<'tongue' | 'herb'>('tongue');
  
  // 模拟交互式问诊流：收集患者核心症状进行四诊合参
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [constitution, setConstitution] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const symptomTags = ["畏寒怕冷", "失眠多梦", "心悸气短", "脾胃虚寒", "经常上火", "口苦咽干", "湿气沉重", "腰膝酸软"];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const toggleSymptom = (tag: string) => {
    setConstitution(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const executeTcmDiagnosis = async () => {
    if (!image || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('sample_type', sampleType);
    formData.append('symptoms', JSON.stringify(constitution));
    formData.append('chief_complaint', chiefComplaint);

    try {
      // 💡 路由中继到网关（可根据具体中继端口进行微调）
      const response = await fetch('http://localhost:8005/clinic/tcm-diagnosis/user_01', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("TCM Diagnosis failed:", error);
      // 离线灾备 Mock 结构化展示
      setResult({
        syndrome_differentiation: {
          pattern: "气血两虚，湿邪内阻（示例）",
          viscera_location: "脾、心",
          eight_principles: "里证 / 虚证 / 寒证",
          tongue_analysis: "舌质淡白，苔白厚腻，边缘可见明显齿痕。"
        },
        treatment_plan: {
          principle: "益气养血，健脾祛湿",
          prescription_name: "归脾汤加减合参",
          herbs_detail: "黄芪 15g, 党参 12g, 白术 10g, 茯苓 15g, 当归 10g, 薏苡仁 20g",
          decoction_method: "每剂水煎服 400ml，早晚分服。忌食生冷油腻之物。"
        },
        lifestyle_advice: "建议子时（23点）前入睡以养肝血；可适当艾灸足三里、神阙穴以温阳祛湿。"
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen selection:bg-orange-500/30 text-slate-300 bg-[#05070a]">
      
      {/* 头部标题：TCM_CORE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">TCM_CORE <span className="text-orange-500">.09</span></h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">AI Traditional Chinese Medicine Unit</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-mono flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             FOUR_DIAGNOSES: SYNCHRONIZED (望闻问切)
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：多模态采样与主诉输入 */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 采样器模式选择 */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
            <button onClick={() => { setSampleType('tongue'); setImage(null); setResult(null); }} className={`py-2 text-xs font-mono rounded-xl transition-all uppercase tracking-wider ${sampleType === 'tongue' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold' : 'text-slate-500 hover:text-slate-300'}`}>
              舌象面色识别
            </button>
            <button onClick={() => { setSampleType('herb'); setImage(null); setResult(null); }} className={`py-2 text-xs font-mono rounded-xl transition-all uppercase tracking-wider ${sampleType === 'herb' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold' : 'text-slate-500 hover:text-slate-300'}`}>
              中药原材鉴别
            </button>
          </div>

          {/* 图像采集框 */}
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900/50 border border-white/10 group shadow-2xl">
            {!image ? (
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-orange-500/40 transition-all">
                  <Camera className="text-slate-500 group-hover:text-orange-400" size={32} />
                </div>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest text-center px-4">
                  {sampleType === 'tongue' ? 'Awaiting Tongue/Face Sample...' : 'Awaiting Herb Specimen...'}
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img src={image} alt="TCM Sample" className="w-full h-full object-cover" />
                <AnimatePresence>
                  {scanning && (
                    <motion.div 
                      initial={{ top: '0%' }} animate={{ top: '100%' }} exit={{ opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 w-full h-[2px] bg-orange-400 shadow-[0_0_25px_#f97316] z-20"
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

          {/* 问诊交互流：输入主诉与标签选择 */}
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">问诊 // 输入当前不适 (主诉)</label>
            <input 
              type="text" 
              placeholder="例：精神疲惫，最近胃口不好，容易腹胀..." 
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500/50 text-white transition-all"
            />

            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 pt-2">体质探针 // 勾选伴随症状</label>
            <div className="grid grid-cols-2 gap-2">
              {symptomTags.map((tag) => {
                const isSelected = constitution.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleSymptom(tag)} className={`py-2 px-3 text-xs text-left rounded-xl border transition-all ${isSelected ? 'bg-orange-500/10 border-orange-500/40 text-orange-300 font-medium' : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-400'}`}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={executeTcmDiagnosis} disabled={!image || scanning}
            className={`w-full py-5 rounded-[1.5rem] font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              !image || scanning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]'
            }`}
          >
            {scanning ? <Loader2 className="animate-spin" size={20} /> : <Scan size={20} />}
            {scanning ? 'Decoding Meridian Flow...' : '四诊合参：开启中医辨证'}
          </button>
        </div>

        {/* 右侧：四诊合参化验报告 */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl backdrop-blur-xl">
            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Leaf size={64} className="opacity-10 text-orange-500" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Meridian AI Core IDLE</p>
              </div>
            ) : scanning ? (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="space-y-2 text-center">
                        <Loader2 className="mx-auto text-orange-500 animate-spin" size={40} />
                        <p className="text-orange-400 font-mono text-xs animate-pulse">ANALYZING_TONGUE_AND_PULSE_DATA...</p>
                    </div>
                </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col space-y-6">
                
                {/* 1. 八纲辨证核心结论 */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">辨证分型 (Pattern)</p>
                        <p className="text-orange-400 font-bold text-xs truncate">{result.syndrome_differentiation.pattern}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">病位脏腑 (Viscera)</p>
                        <p className="text-yellow-500 font-bold text-xs">{result.syndrome_differentiation.viscera_location}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">八纲定位 (8 Principles)</p>
                        <p className="text-amber-500 font-bold text-xs">{result.syndrome_differentiation.eight_principles}</p>
                    </div>
                </div>

                {/* 2. 深度剖析（望诊、中药鉴别与药效应用） */}
                <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Flame size={14} className="text-orange-400"/> 望诊分析 / 原材鉴别报告
                        </h4>
                        <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl text-slate-300 text-sm leading-relaxed">
                            {result.syndrome_differentiation.tongue_analysis}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Leaf size={14} className="text-green-400"/> 论治方案 & 专属配伍（理法方药）
                        </h4>
                        <div className="bg-orange-500/5 border border-orange-500/10 p-5 rounded-3xl text-orange-50/90 text-sm leading-relaxed space-y-3">
                            <div><strong className="text-orange-400">治则治法：</strong>{result.treatment_plan.principle}</div>
                            <div><strong className="text-orange-400">推介方剂：</strong>{result.treatment_plan.prescription_name}</div>
                            <div className="p-3 bg-black/30 rounded-xl border border-white/5 font-mono text-xs text-orange-200/90">
                              <strong className="text-white block mb-1">药材配伍配比：</strong>
                              {result.treatment_plan.herbs_detail}
                            </div>
                            <div className="text-xs text-slate-400"><strong className="text-slate-300">煎服禁忌：</strong>{result.treatment_plan.decoction_method}</div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Heart size={14} className="text-rose-400"/> 食疗调摄与经络养生建议
                        </h4>
                        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-3xl text-slate-400 text-xs leading-relaxed italic">
                            {result.lifestyle_advice}
                        </div>
                    </section>
                </div>

                {/* 底部安全机制免责 */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-slate-600 flex-shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-tight italic">
                      中医AI辅助提示：四诊报告及方药剂量由多模态大模型推演生成，不作为临床最终开方凭证。请在执业中医师指导下用药。
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