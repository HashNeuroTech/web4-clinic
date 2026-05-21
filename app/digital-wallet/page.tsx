'use client';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { History, ArrowDownRight, Wallet, RefreshCw } from 'lucide-react';
import { type Address, isAddress } from 'viem';

// 替换为你的真实合约地址
const HC_TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address;
const USDT_TOKEN_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7' as Address;

export default function DigitalWalletPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'PAY'>('DEPOSIT');

  // 挂载检查：解决 Hydration 报错
  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用 isAddress 安全校验地址
  const { data: ethBalance, refetch: refetchEth } = useBalance({ address });
  const { data: usdtBalance, refetch: refetchUsdt } = useBalance({ 
    address, 
    token: isAddress(USDT_TOKEN_ADDRESS) ? USDT_TOKEN_ADDRESS : undefined 
  });
  const { data: hcBalance, refetch: refetchHc } = useBalance({ 
    address, 
    token: isAddress(HC_TOKEN_ADDRESS) ? HC_TOKEN_ADDRESS : undefined 
  });

  const handleRefresh = async () => {
    await Promise.all([refetchEth(), refetchUsdt(), refetchHc()]);
  };

  if (!mounted) return null; // 预渲染期间不显示，防止不匹配

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-white">Asset Control Panel</h1>
      </div>

      {!isConnected ? (
        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
          <Wallet size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">请连接钱包以管理您的多币种资产</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Clinic Yuan', bal: hcBalance?.formatted, sym: 'HC', icon: '💎' },
              { name: 'USDT', bal: usdtBalance?.formatted, sym: 'USDT', icon: '💠' },
              { name: 'Ethereum', bal: ethBalance?.formatted, sym: 'ETH', icon: '✨' },
              { name: 'Fiat', bal: '5,000.00', sym: 'CNY', icon: '¥' },
            ].map((asset, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl">
                <div className="text-xl mb-2">{asset.icon}</div>
                <p className="text-[9px] uppercase font-mono text-slate-500">{asset.name}</p>
                <h3 className="text-lg font-bold text-white mt-1">
                  {asset.bal ?? '0.00'} <span className="text-[10px] text-slate-600">{asset.sym}</span>
                </h3>
              </div>
            ))}
          </div>

          <div className="bg-[#0a0c10] border border-white/10 rounded-[2rem] p-8 md:p-12">
            <div className="flex gap-8 mb-8 border-b border-white/5 pb-6">
              {(['DEPOSIT', 'WITHDRAW', 'PAY'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs font-mono uppercase tracking-widest ${activeTab === tab ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <input type="number" placeholder="输入金额..." className="w-full bg-transparent border-b border-white/10 py-4 text-3xl font-bold focus:outline-none focus:border-cyan-500" />
              <button className="w-full py-4 bg-white text-black rounded-xl font-black text-xs hover:bg-cyan-400 transition">
                确认 {activeTab}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono text-slate-500 flex items-center gap-2">
                <History size={14} /> TRANSACTION_LOG
              </h4>
              <button onClick={handleRefresh} className="text-[10px] text-cyan-500 flex items-center gap-1 hover:underline">
                <RefreshCw size={10} /> 刷新余额
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
