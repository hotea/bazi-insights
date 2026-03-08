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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            八字排盘系统
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            精准、专业、纯前端在线八字推算引擎
          </p>
        </header>

        <main className="space-y-6">
          <InputPanel />

          <div className="grid grid-cols-1 gap-6">
            <ResultDisplay />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WuXingChart />
              <LuckDisplay />
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p>© {new Date().getFullYear()} 八字排盘系统. MIT Licensed.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
