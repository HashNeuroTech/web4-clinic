'use client';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits, type Address } from 'viem';
import { History, Wallet, RefreshCw } from 'lucide-react';

const HC_TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address;
const USDT_TOKEN_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7' as Address;

export default function DigitalWalletPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'PAY'>('DEPOSIT');

  useEffect(() => { setMounted(true); }, []);

  const { data: ethBalance, refetch: refetchEth } = useBalance({ address } as any);
  const { data: usdtBalance, refetch: refetchUsdt } = useBalance({ address, token: USDT_TOKEN_ADDRESS } as any);
  const { data: hcBalance, refetch: refetchHc } = useBalance({ address, token: HC_TOKEN_ADDRESS } as any);

  const formatBal = (data: any) => data ? formatUnits(data.value, data.decimals) : '0.00';

  const handleRefresh = async () => { await Promise.all([refetchEth(), refetchUsdt(), refetchHc()]); };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
      <h1 className="text-2xl font-black text-white">Asset Control Panel</h1>
      
      {!isConnected ? (
        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
          <Wallet size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">请连接钱包以管理资产</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Clinic Yuan', bal: formatBal(hcBalance), sym: 'HC', icon: '💎' },
              { name: 'USDT', bal: formatBal(usdtBalance), sym: 'USDT', icon: '💠' },
              { name: 'Ethereum', bal: formatBal(ethBalance), sym: 'ETH', icon: '✨' },
              { name: 'Fiat', bal: '5,000.00', sym: 'CNY', icon: '¥' },
            ].map((asset, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl">
                <div className="text-xl mb-2">{asset.icon}</div>
                <p className="text-[9px] uppercase font-mono text-slate-500">{asset.name}</p>
                <h3 className="text-lg font-bold text-white mt-1">
                  {asset.bal} <span className="text-[10px] text-slate-600">{asset.sym}</span>
                </h3>
              </div>
            ))}
          </div>

          {/* 恢复了交互面板 */}
          <div className="bg-[#0a0c10] border border-white/10 rounded-[2rem] p-8 md:p-12">
            <div className="flex gap-8 mb-8 border-b border-white/5 pb-6">
              {(['DEPOSIT', 'WITHDRAW', 'PAY'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} 
                  className={`text-xs font-mono uppercase tracking-widest ${activeTab === tab ? 'text-cyan-400' : 'text-slate-600'}`}>
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
        </>
      )}
    </div>
  );
}