'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldPlus, Wallet, X, Info } from 'lucide-react';

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // 模拟连接成功
  const handleConnect = () => {
    setShowWalletModal(false);
    setTimeout(() => setIsLogged(true), 500); // 增加一点延迟感，模拟链上校验
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            {isLogged ? (
              <LoggedInStatus onLogout={() => setIsLogged(false)} />
            ) : (
              <button 
                onClick={() => setShowWalletModal(true)}
                className="bg-cyan-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
              >
                <Wallet size={16} /> 连接钱包
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 钱包连接弹窗 */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            {/* 背景遮罩 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* 弹窗主体 */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
              
              <button 
                onClick={() => setShowWalletModal(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">连接加密钱包</h2>
              <p className="text-slate-400 text-sm mb-8">选择您的钱包以存取健康资产和代币奖励。</p>

              <div className="space-y-4">
                <WalletOption 
                  name="MetaMask" 
                  icon="🦊" 
                  onClick={handleConnect} 
                  tag="推荐"
                />
                <WalletOption 
                  name="WalletConnect" 
                  icon="🌐" 
                  onClick={handleConnect} 
                />
                <WalletOption 
                  name="Solana Phantom" 
                  icon="👻" 
                  onClick={handleConnect} 
                />
              </div>

              <div className="mt-8 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex gap-3">
                <Info className="text-cyan-400 shrink-0" size={18} />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Web4 科技诊所不会访问您的私钥。连接钱包即表示您同意我们的《数字化疗程服务协议》。
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// 辅助组件：钱包选项
function WalletOption({ name, icon, onClick, tag }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{name}</span>
      </div>
      {tag && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase font-bold">{tag}</span>}
    </button>
  );
}

// Logo 辅助组件 (简化版)
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-900 border border-cyan-500/30 rounded-xl">
        <ShieldPlus className="text-cyan-400 w-6 h-6" />
      </div>
      <span className="text-lg font-black text-white leading-none tracking-tighter uppercase">Tech Clinic</span>
    </div>
  );
}

// 登录后状态
function LoggedInStatus({ onLogout }: any) {
  return (
    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
      <div className="text-right">
        <p className="text-[10px] text-slate-500 font-mono leading-none mb-1">BALANCE</p>
        <p className="text-sm font-bold text-cyan-400 leading-none">1,240 $HC</p>
      </div>
      <button onClick={onLogout} className="text-slate-500 hover:text-red-400 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}