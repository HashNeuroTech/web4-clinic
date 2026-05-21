'use client';
import { ShieldPlus, Github, Twitter, Cpu, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050810] pt-20 pb-10 relative overflow-hidden">
      {/* 底部装饰光晕 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <ShieldPlus className="text-cyan-400 w-5 h-5" />
              <span className="font-black tracking-tighter text-white">TECH CLINIC</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              基于 AI智能医疗+ 数字钱包支付 的Web4 科技 健康干预平台。利用最先进的AI大模型与数字货币激励模型，重塑人类健康行为。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white text-sm font-bold mb-6 italic">// 诊所导航</h4>
            <ul className="space-y-4 text-xs text-slate-500">
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">AI 智能医疗中心</a></li>
              <li><a href="#pay" className="hover:text-cyan-400 transition-colors">健康资产管理</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Web4AI智能医疗协议</a></li>
            </ul>
          </div>

          {/* 法律与合规 */}
          <div>
            <h4 className="text-white text-sm font-bold mb-6 italic">// 合规性</h4>
            <ul className="space-y-4 text-xs text-slate-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">PDF 指南来源声明</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">隐私保护协议</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">智能合约审计报告</a></li>
            </ul>
          </div>

          {/* 社交与技术栈 */}
          <div>
            <h4 className="text-white text-sm font-bold mb-6 italic">// 连接实验室</h4>
            <div className="flex gap-4 mb-6 text-slate-400">
              <Github size={18} className="hover:text-white cursor-pointer" />
              <Twitter size={18} className="hover:text-white cursor-pointer" />
              <Globe size={18} className="hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/50">
              <Cpu size={12} /> SYSTEM_STATUS: ONLINE
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-[10px] font-mono text-slate-600">
            © {currentYear} TECH_CLINIC_LABS. ALL RIGHTS RESERVED. VERSION_1.0.4
          </p>
          <div className="flex gap-6 text-[10px] font-mono text-slate-600">
            <span>NETWORK: MAINNET-BETA</span>
            <span>LATENCY: 14MS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}