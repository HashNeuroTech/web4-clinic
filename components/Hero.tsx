'use client';
import { motion } from 'framer-motion';

// 定义资讯内容
const newsItems = [
  "[研究] 持续通过 AI 伴侣干预坏习惯的用户，其心血管风险平均降低 15%",
  "[公告] $HC 代币现已支持 Solana 跨链兑换",
  "[诊所] 新增《Web4 数字化疗法》PDF 文献库",
  "[提醒] 连续 7 天健康饮食打卡可触发 $HC 翻倍奖励",
];

export default function Hero() {
  return (
    <section className="py-20 flex flex-col items-center text-center">
      {/* 顶部 Live 状态 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        LIVE: 2026 AI 健康干预协议已启动
      </motion.div>

      {/* 主标题 */}
      <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mb-8 leading-tight text-white">
        科技诊所：<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">重构人类健康行为</span>
      </h1>

      {/* 描述文本 */}
      <p className="text-slate-400 max-w-2xl mb-12 text-lg">
        融合 RAG 医学知识库与多模态视觉 AI，通过代币化经济激励（$HC），为您提供 24/7 的无缝健康陪伴与行为修正。
      </p>

      {/* 修复后的资讯滚动条：使用 Framer Motion 替代 Marquee */}
      <div className="w-full max-w-5xl bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-6 overflow-hidden relative">
        <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded text-[10px] font-bold shrink-0 z-10 backdrop-blur-sm border border-cyan-500/20">
          最新资讯
        </div>
        
        <div className="flex flex-1 overflow-hidden relative">
          <motion.div 
            className="flex whitespace-nowrap gap-10 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              ease: "linear", 
              duration: 20, 
              repeat: Infinity 
            }}
          >
            {/* 复制两份以实现无缝循环 */}
            {[...newsItems, ...newsItems].map((item, index) => (
              <span key={index} className="text-sm text-slate-500 font-light tracking-wide">
                {item}
              </span>
            ))}
          </motion.div>
          
          {/* 左右两侧的渐变遮罩，增加高级感 */}
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#050810] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#050810] to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}