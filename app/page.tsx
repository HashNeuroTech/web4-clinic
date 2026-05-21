import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import WalletPay from '@/components/WalletPay';
import Link from 'next/link';
import { Microscope, ArrowUpRight, Shield, Zap, Database, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col space-y-24 pb-32 overflow-hidden bg-[#05070a] text-slate-300">
      
      {/* 全局背景光晕 - 增强科幻感 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />

      {/* 1. 顶部视觉焦点 (Hero) */}
      <section className="relative z-10">
        <Hero />
      </section>

      {/* 2. 十大 AI 矩阵 (Core Capabilities) */}
      <section id="services" className="container mx-auto px-6 scroll-mt-24 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-cyan-500/50" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.5em]">Intelligence Matrix</span>
            <span className="h-[1px] w-8 bg-cyan-500/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-center text-white mb-6">
            全维度 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI 医疗引擎</span>
          </h2>
          <p className="max-w-2xl text-center text-slate-500 text-sm leading-relaxed">
            集成医学 RAG 问诊、食物热量视觉识别、行为习惯心理干预、高精度皮肤识别、中医辨识、口腔、影像学、细胞病理、男科、妇科分析。
            十大底层模块共同驱动，构建完整的数字健康闭环。
          </p>
        </div>

        {/* 渲染包含 RAG、食谱、习惯、皮肤十大功能的组件 */}
        <FeatureGrid />
      </section>

      {/* 3. ✨ 医生办公室控制台 - 这里的 UI 做了深度差异化设计 ✨ */}
      <section className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            {/* 卡片外边框呼吸灯 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative bg-[#0a0c10] border border-white/10 rounded-[2.8rem] overflow-hidden">
              <div className="grid lg:grid-cols-2">
                
                {/* 左侧：核心入口 */}
                <div className="p-10 md:p-14 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                      <Shield className="text-cyan-500" size={20} />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-slate-500 italic">SYSTEM.ROOT / DOCTOR_OFFICE</span>
                  </div>

                  <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">
                    医生科研办公室 <br />
                    <span className="text-slate-600">RESEARCH HUB</span>
                  </h3>

                  <p className="text-slate-400 text-sm leading-loose">
                    不仅仅是 AI。这里是临床科研的实验室。通过本地 <span className="text-white font-mono">SQLite</span> 引擎深度分析患者趋势，调用 <span className="text-white font-mono">Biomistral</span> 生成专业级综述。
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                      <Database size={16} className="text-cyan-500 mb-2" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold">本地病例存储</p>
                      <p className="text-white font-mono font-bold">100% Encrypted</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                      <Brain size={16} className="text-purple-500 mb-2" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold">科研论文助手</p>
                      <p className="text-white font-mono font-bold">Auto-Synthesis</p>
                    </div>
                  </div>

                  <Link href="/doctor" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all duration-300">
                    进入办公室控制台 <ArrowUpRight size={16} />
                  </Link>
                </div>

                {/* 右侧：装饰性数据看板感 UI */}
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border-l border-white/5 p-10 hidden lg:flex flex-col justify-center relative">
                   <div className="space-y-6">
                      {/* 模拟进度条 1 */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono tracking-tighter">
                          <span>CLINIC_DATA_PROCESSING</span>
                          <span className="text-cyan-500">88%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-[88%]" />
                        </div>
                      </div>
                      {/* 模拟进度条 2 */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono tracking-tighter">
                          <span>LLM_RESEARCH_SYNTHESIS</span>
                          <span className="text-purple-500">ACTIVE</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 w-[65%] animate-pulse" />
                        </div>
                      </div>
                   </div>
                   
                   {/* 悬浮图标 */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                      <Microscope size={180} strokeWidth={1} className="text-cyan-500" />
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 数字资产与支付 */}
      <section id="pay" className="container mx-auto px-6 scroll-mt-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <WalletPay />
        </div>
      </section>

      {/* 底部装饰线 */}
      <div className="container mx-auto px-6 opacity-20">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>
    </div>
  );
}