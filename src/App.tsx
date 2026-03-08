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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            八字排盘系统
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            精准、专业、纯前端在线八字推算引擎
          </p>
        </header>

        <main className="space-y-8">
          <InputPanel />

          <div className="grid grid-cols-1 gap-8">
            <ResultDisplay />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WuXingChart />
              <LuckDisplay />
            </div>
          </div>
        </main>

        <footer className="mt-16 text-center text-sm text-slate-400 dark:text-slate-500 pb-8">
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full opacity-20"></div>
          <p>© {new Date().getFullYear()} 八字排盘系统. Designed with ❤️ for Destiny.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
