'use client';

import { useState, useRef } from 'react';
import { Upload, X, MessageSquare, Cpu, ShieldCheck } from 'lucide-react';

export default function AndroProTerminal() {
  const [complaint, setComplaint] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-8 font-sans">
      <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] grid grid-cols-12 gap-8">
        
        {/* 左侧：输入控制区 (影像 → 主诉 → 动作) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* 1. 影像上传区：置于最上方 */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-64 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-all bg-[#0A0A0A] relative overflow-hidden group"
          >
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover opacity-60" />
                <button onClick={(e) => { e.stopPropagation(); setPreview(null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500/50">
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <Upload className="text-slate-600 mb-2 group-hover:text-cyan-500 transition-colors" size={24} />
                <span className="text-xs text-slate-500">上传影像 / 检查单</span>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setPreview(URL.createObjectURL(e.target.files[0]))} />
          </div>

          {/* 2. 主诉输入区：居中 */}
          <div className="flex-1 flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MessageSquare size={12} /> 临床主诉 (Chief Complaint)
            </label>
            <textarea 
              className="flex-1 w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 text-sm focus:border-cyan-500/50 outline-none resize-none transition-all"
              placeholder="请描述症状细节：分泌物性状、疼痛部位、持续时长等..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </div>

          {/* 3. 执行按钮：位于底部 */}
          <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(6,182,212,0.2)]">
            执行智能医学分析
          </button>
        </section>

        {/* 右侧：分析看板 */}
        <section className="col-span-12 lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Cpu className="text-cyan-500" /> 医学诊断分析报告
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px]">
                <ShieldCheck size={12} /> 隐私安全校验已启用
              </div>
            </div>

            {/* 分析内容展示区域 */}
            <div className="grid grid-cols-1 gap-6 text-sm text-slate-400">
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="font-bold text-slate-300 mb-2">模型评估结论</p>
                 <p>请上传影像并描述主诉，系统将联动生化模型进行多模态评估...</p>
               </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}