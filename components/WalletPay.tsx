'use client';
import { Wallet, ArrowRight, ShieldCheck, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletPay() {
  return (
    <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-[#0a0f1d] to-black border border-white/5 p-12">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono mb-6 tracking-widest">
            <ShieldCheck size={14} /> WEB4 ASSET PROTECTION ACTIVE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white italic">Digital Wallet</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl">
            通过自律行为赚取的 <span className="text-white">$HC 代币</span> 是诊所内的硬通货。您可以用来支付 AI 深度诊断报告，或作为“健康资产”进行数字支付。
          </p>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="bg-white/[0.03] border border-white/10 px-8 py-6 rounded-3xl backdrop-blur-md">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Coins size={12} className="text-yellow-500" /> Balance
              </p>
              <p className="text-3xl font-mono font-bold text-white">1,240.50 <span className="text-sm text-cyan-500">$HC</span></p>
            </div>
            <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Clinic Status</p>
              <p className="text-sm font-bold text-green-400">Verified Health Miner</p>
            </div>
          </div>
        </div>

        <button className="shrink-0 flex items-center gap-4 bg-cyan-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)]">
          <Wallet size={20} /> 资产提现 / 支付 <ArrowRight size={18} />
        </button>
      </div>
      
      {/* 装饰：右下角巨大的虚幻图标 */}
      <div className="absolute -right-20 -bottom-20 opacity-[0.02] text-white">
        <Coins size={400} />
      </div>
    </div>
  );
}