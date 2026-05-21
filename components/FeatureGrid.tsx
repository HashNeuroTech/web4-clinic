'use client';
import { motion } from 'framer-motion';
// 💡 引入了 ShieldAlert（男科隐私与健康屏障）和 HeartPulse（妇科生殖微循环与暖心关怀）图标
import { BrainCircuit, ScanEye, Zap, ArrowUpRight, Sparkles, Activity, Leaf, Microscope, Bone, ShieldAlert, HeartPulse } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "RAG 医学问诊",
    desc: "接入专业医学 PDF 指南，Gemma 3 结合 RAG 技术 24 小时为您解答健康疑虑。",
    icon: <BrainCircuit size={24} />,
    link: "/rag-clinic",
    color: "cyan",
    border: "group-hover:border-cyan-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
  },
  {
    title: "食谱热量识别",
    desc: "Qwen2.5-VL 视觉模型实时 analysis 采样，精准拆解分子级营养数据。",
    icon: <ScanEye size={24} />,
    link: "/vision-lab",
    color: "purple",
    border: "group-hover:border-purple-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]"
  },
  {
    title: "AI 皮肤诊疗",
    desc: "针对面部细节进行深度影像扫描，提供结构化肤质报告与护肤建议。",
    icon: <Sparkles size={24} />,
    link: "/skin-lab",
    color: "blue",
    border: "group-hover:border-blue-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
  },
  {
    title: "牙医正畸多模态",
    desc: "智能诊断口腔错合畸形，高精度测算头颅侧位 X 光片 SNA/SNB 骨骼标志点数据。",
    icon: <Activity size={24} />,
    link: "/ortho-lab",
    color: "emerald",
    border: "group-hover:border-emerald-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]"
  },
  {
    title: "AI 影像学诊断",
    desc: "利用多模态视觉技术深度解析 CT、MRI 及 X 光片，精准标记病灶区域并输出放射诊断报告。",
    icon: <Bone size={24} />,
    link: "/radiology-lab",
    color: "indigo",
    border: "group-hover:border-indigo-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
  },
  {
    title: "智能病理分析",
    desc: "对 H&E 染色组织切片或细胞抽吸图像进行高分辨率扫描，全自动识别细胞形态异常与病理分级。",
    icon: <Microscope size={24} />,
    link: "/pathology-lab",
    color: "rose",
    border: "group-hover:border-rose-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]"
  },
  {
    title: "男科专属门诊",
    desc: "提供高度隐私的男科健康评估，涵盖雄激素水平、前列腺功能筛查及生活方式干预方案。",
    icon: <ShieldAlert size={24} />,
    link: "/andrology-lab",
    color: "teal",
    border: "group-hover:border-teal-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]"
  },
  {
    title: "妇科全周期守护",
    desc: "智能评估生殖内分泌、卵巢健康及生理周期波动，提供针对性的温和调理与日常护理建议。",
    icon: <HeartPulse size={24} />,
    link: "/gynecology-lab",
    color: "pink",
    border: "group-hover:border-pink-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]"
  },
  {
    title: "中医 AI 辨证系统",
    desc: "结合望闻问切，通过舌象、面色视觉扫描与问诊，输出四诊合参的调理方案。",
    icon: <Leaf size={24} />,
    link: "/tcm-lab",
    color: "orange",
    border: "group-hover:border-orange-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]"
  },
  {
    title: "习惯与心理干预",
    desc: "AI 实时修正坏习惯并提供心理辅导，通过 $HC 代币激励重塑健康自我。",
    icon: <Zap size={24} />,
    link: "/habit-companion",
    color: "yellow",
    border: "group-hover:border-yellow-500/50",
    shadow: "group-hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]"
  }
];

export default function FeatureGrid() {
  return (
    // 💡 10 张卡牌完美响应式：中屏 2 列，大屏平铺 5 列，双行完美铺满，结构极其严谨、优雅
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {features.map((f, i) => (
        <Link href={f.link} key={i} className="block h-full">
          <motion.div
            whileHover={{ 
              y: -10, 
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              transition: { duration: 0.3, ease: "easeOut" } 
            }}
            whileTap={{ scale: 0.97 }}
            className={`group relative p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/10 transition-all duration-500 cursor-pointer h-full flex flex-col ${f.border} ${f.shadow}`}
          >
            {/* 背景动态光晕 - 新增 teal 和 pink 支持 */}
            <div className={`absolute -right-16 -top-16 w-40 h-40 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
              f.color === 'cyan' ? 'bg-cyan-500' : 
              f.color === 'purple' ? 'bg-purple-500' : 
              f.color === 'blue' ? 'bg-blue-500' : 
              f.color === 'emerald' ? 'bg-emerald-500' : 
              f.color === 'indigo' ? 'bg-indigo-500' : 
              f.color === 'rose' ? 'bg-rose-500' : 
              f.color === 'teal' ? 'bg-teal-500' : 
              f.color === 'pink' ? 'bg-pink-500' : 
              f.color === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'
            }`} />
            
            {/* 图标容器 - 适配新增配色 */}
            <div className={`mb-8 inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-all duration-500 ${
              f.color === 'cyan' ? 'text-cyan-400 group-hover:bg-cyan-500/10' : 
              f.color === 'purple' ? 'text-purple-400 group-hover:bg-purple-500/10' : 
              f.color === 'blue' ? 'text-blue-400 group-hover:bg-blue-500/10' : 
              f.color === 'emerald' ? 'text-emerald-400 group-hover:bg-emerald-500/10' : 
              f.color === 'indigo' ? 'text-indigo-400 group-hover:bg-indigo-500/10' : 
              f.color === 'rose' ? 'text-rose-400 group-hover:bg-rose-500/10' : 
              f.color === 'teal' ? 'text-teal-400 group-hover:bg-teal-500/10' : 
              f.color === 'pink' ? 'text-pink-400 group-hover:bg-pink-500/10' : 
              f.color === 'orange' ? 'text-orange-400 group-hover:bg-orange-500/10' : 'text-yellow-400 group-hover:bg-yellow-500/10'
            }`}>
              {f.icon}
            </div>

            {/* 标题 */}
            <h3 className="text-xl font-black mb-4 flex items-center justify-between text-white tracking-tight">
              {f.title}
              <ArrowUpRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </h3>

            {/* 描述文本 */}
            <p className="text-slate-500 text-[13px] leading-relaxed mb-10 group-hover:text-slate-300 transition-colors">
              {f.desc}
            </p>

            {/* 底部装饰：自动处理两位数 Module 编号 (Mod // 10) */}
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-white/20 uppercase">
                Mod // {i + 1 < 10 ? `0${i + 1}` : i + 1}
              </span>
              <div className={`flex items-center gap-2`}>
                <span className="text-[9px] font-mono text-white/10 group-hover:text-white/40 transition-colors uppercase">Status: Active</span>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  f.color === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 
                  f.color === 'purple' ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 
                  f.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 
                  f.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 
                  f.color === 'indigo' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 
                  f.color === 'rose' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 
                  f.color === 'teal' ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]' : 
                  f.color === 'pink' ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 
                  f.color === 'orange' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]'
                }`} />
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}