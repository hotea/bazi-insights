import './App.css'
import InputPanel from './components/InputPanel/index'
import ResultDisplay from './components/ResultDisplay/index'
import LuckDisplay from './components/LuckDisplay/index'
import WuXingChart from './components/WuXingChart/index'

/**
 * 八字排盘系统主应用组件
 */
function App() {
  return (
    <div className="min-h-screen py-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-12">
        <header className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-slate-950 via-indigo-600 to-violet-600 dark:from-white dark:via-indigo-400 dark:to-violet-400">
            八字排盘系统
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold tracking-tight">
              PRECISION DESTINY ANALYTICS PRO MAX
            </p>
            <div className="flex gap-3 px-6 py-2 bg-slate-500/5 dark:bg-white/5 rounded-full border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Advanced Calculation
              </span>
              <span className="w-px h-3 bg-slate-200 dark:bg-slate-700"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure Engine
              </span>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <InputPanel />

          <div className="grid grid-cols-1 gap-12">
            <ResultDisplay />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
              <div className="h-full">
                <WuXingChart />
              </div>
              <div className="h-full">
                <LuckDisplay />
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-24 text-center text-[11px] text-slate-400 dark:text-slate-500 pb-16 tracking-widest font-black uppercase flex flex-col items-center gap-6">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent rounded-full"></div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Enterprise</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
          </div>
          <p className="opacity-60">© {new Date().getFullYear()} 八字排盘系统. Designed with ❤️ for Destiny.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
