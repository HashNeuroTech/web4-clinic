'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, Zap, RefreshCw, Loader2, Thermometer, ShieldAlert } from 'lucide-react';

export default function VisionLab() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 处理图片选择与预览
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null); // 上传新图时重置结果
    }
  };

  // 2. 调用后端 9000 端口网关
  const startScan = async () => {
    if (!image || !fileInputRef.current?.files?.[0]) return;
    
    setScanning(true);
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      // 💡 联调 9000 端口网关
      const response = await fetch('http://localhost:8005/clinic/analyze-and-reward/user_01', {
        method: 'POST',
        body: formData, // 浏览器会自动设置 multipart/form-data 和 boundary
      });

      if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);

      const data = await response.json();
      console.log("Web4 网关返回结果:", data);

      // 设置结果状态
      setResult({
        analysis: data.analysis,
        event: data.event,
        wallet: data.wallet || { balance: 'N/A' }
      });
    } catch (error) {
      console.error("Scanning failed:", error);
      setResult({
        analysis: "❌ 扫描失败。请确认 9000(Gateway) 和 8001(Vision) 服务已启动。",
        event: "连接中断",
        wallet: { balance: "ERR" }
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      {/* 头部标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">VISION_LAB <span className="text-purple-500">.01</span></h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">Molecular Nutrition Analysis System</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
             qwen2.5vl:7b: ACTIVE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：采样器 (占据 5 列) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900/50 border border-white/10 group shadow-2xl">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-purple-500/40 transition-all">
                  <Camera className="text-slate-500 group-hover:text-purple-400" size={32} />
                </div>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Waiting for Sample...</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img src={image} alt="Sample" className="w-full h-full object-cover" />
                
                {/* 核心：激光扫描线 */}
                <AnimatePresence>
                  {scanning && (
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 w-full h-[2px] bg-purple-400 shadow-[0_0_25px_#a855f7,0_0_10px_#a855f7] z-20"
                    />
                  )}
                </AnimatePresence>

                {/* 蒙层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <button 
                  onClick={() => {setImage(null); setResult(null);}}
                  className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 border border-white/10 text-white hover:bg-red-500/40 transition-all z-30"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <button 
            onClick={startScan}
            disabled={!image || scanning}
            className={`w-full py-5 rounded-[1.5rem] font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              !image || scanning 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]'
            }`}
          >
            {scanning ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            {scanning ? 'Analyzing...' : 'Execute Scan'}
          </button>
        </div>

        {/* 右侧：化验结果 (占据 7 列) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl backdrop-blur-xl">
            {!result && !scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Scan size={64} className="opacity-10" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">System IDLE: Awaiting Input</p>
              </div>
            ) : scanning ? (
              <div className="flex-1 flex flex-col justify-center space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-purple-400">
                    <span>MOLECULAR_SCANNING</span>
                    <span>{Math.floor(Math.random()*100)}%</span>
                  </div>
                  <div className="h-[2px] bg-white/5 w-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 2, ease: "circOut" }}
                      className="h-full w-full bg-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex-1 flex flex-col"
              >
                {/* 状态标头 */}
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${result.event.includes('警告') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {result.event.includes('警告') ? <ShieldAlert size={20} /> : <Zap size={20} />}
                     </div>
                     <div>
                       <h3 className="text-white font-bold text-lg">{result.event}</h3>
                       <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Transaction Verified on ActivityPub</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-slate-500 font-mono uppercase">Wallet Balance</p>
                     <p className="text-cyan-400 font-bold font-mono text-xl">{result.wallet.balance} $HC</p>
                   </div>
                </div>

                {/* 化验正文 */}
                <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-3xl p-6 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10">
                  <div className="text-slate-300 text-sm leading-loose whitespace-pre-wrap font-sans">
                    {result.analysis}
                  </div>
                </div>

                {/* 底部装饰 */}
                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-mono">Scan Tech</p>
                    <p className="text-white text-xs font-bold">qwen2.5vl:7b</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-mono">Precision</p>
                    <p className="text-white text-xs font-bold">98.2%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-mono">Gateway</p>
                    <p className="text-white text-xs font-bold">v9000.4</p>
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