import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className="dark">
      <body className="bg-[#050810] text-slate-100 antialiased selection:bg-cyan-500/30">
        {/* 背景光晕：增加 Web4 科技感 */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-900/20 blur-[100px] rounded-full" />
        </div>
        
        <Header />
        <main className="pt-24 min-h-screen container mx-auto px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}