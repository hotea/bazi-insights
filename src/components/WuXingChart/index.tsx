import React from 'react';
import { useBaZiStore } from '../../store';

/**
 * 五行力量可视化展示组件
 */
const WuXingChart: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return null;

  const { wuxing } = result;

  const labels = [
    { key: 'wood', name: '木', color: 'bg-emerald-500', labelColor: 'text-emerald-600', shadow: 'shadow-emerald-500/30' },
    { key: 'fire', name: '火', color: 'bg-rose-500', labelColor: 'text-rose-600', shadow: 'shadow-rose-500/30' },
    { key: 'earth', name: '土', color: 'bg-amber-500', labelColor: 'text-amber-600', shadow: 'shadow-amber-500/30' },
    { key: 'metal', name: '金', color: 'bg-slate-400', labelColor: 'text-slate-500', shadow: 'shadow-slate-400/30' },
    { key: 'water', name: '水', color: 'bg-blue-500', labelColor: 'text-blue-600', shadow: 'shadow-blue-500/30' },
  ] as const;

  const wuxingNameMap = {
    'wood': '木',
    'fire': '火',
    'earth': '土',
    'metal': '金',
    'water': '水'
  } as const;

  return (
    <div className="glass-card p-10 rounded-[2.5rem] flex flex-col h-full">
      <h2 className="text-3xl font-black mb-12 text-slate-800 dark:text-slate-100 flex items-center gap-4">
        <span className="w-2.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></span>
        五行深度分析
      </h2>

      <div className="flex flex-col gap-12 flex-1">
        {/* 柱状图 */}
        <div className="grid grid-cols-5 gap-6 h-64 items-end border-b border-slate-200/50 dark:border-white/5 pb-8">
          {labels.map((item) => {
            const val = wuxing.score[item.key];
            const height = Math.min((val / wuxing.score.total) * 300, 100);
            return (
              <div key={item.key} className="flex flex-col items-center gap-4 group interactive-element h-full justify-end">
                <span className={`text-[11px] font-black tracking-tighter ${item.labelColor}`}>{val.toFixed(1)}</span>
                <div
                  className={`w-full ${item.color} rounded-[1rem] transition-all duration-700 group-hover:shadow-2xl ${item.shadow} relative overflow-hidden group-hover:brightness-110`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* 旺衰解读 */}
        <div className="bg-slate-500/5 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m4.93 19.07 14.14-14.14"/></svg>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">日主状态</span>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
              wuxing.dayMasterStrength.status === 'strong' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' :
              wuxing.dayMasterStrength.status === 'weak' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' :
              'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
            }`}>
              {wuxing.dayMasterStrength.status === 'strong' ? '身旺 (Strong)' :
               wuxing.dayMasterStrength.status === 'weak' ? '身弱 (Weak)' : '中和 (Balanced)'}
            </span>
          </div>
          <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
            {wuxing.dayMasterStrength.analysis}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/20">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-emerald-500">喜用神</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{wuxing.analysis.favorableElements}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-rose-500">忌神</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{wuxing.analysis.unfavorableElements}</p>
            </div>
          </div>
        </div>

        {/* 详细解读 */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h9z"/></svg>
            深刻解读
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
            {wuxing.analysis.overview}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labels.map((item) => {
              const detail = wuxing.analysis.details[item.name];
              return (
                <div key={item.key} className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200/30 dark:border-white/5 hover:bg-slate-500/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-black ${item.labelColor} flex items-center gap-2`}>
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      {item.name}元素 ({detail.status})
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mt-0.5 flex-shrink-0"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{detail.personality}</p>
                    </div>
                    <div className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mt-0.5 flex-shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{detail.health}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WuXingChart;
