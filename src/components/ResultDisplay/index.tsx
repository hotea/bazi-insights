import React from 'react';
import { useBaZiStore } from '../../store';
import type { Pillar } from '../../types';

/**
 * 结果展示组件
 */
const ResultDisplay: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return (
    <div className="glass-card p-16 rounded-[2rem] text-center flex flex-col items-center">
      <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight">
        请在上方输入信息并点击“立即排盘”
      </p>
      <p className="mt-2 text-slate-400 dark:text-slate-500 text-sm">
        精准专业的在线八字引擎，为您提供深度命理分析。
      </p>
    </div>
  );

  const { fourPillars, calendarData } = result;

  return (
    <div className="glass-card p-10 rounded-[2.5rem]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-4">
          <span className="w-2.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"></span>
          排盘结果
        </h2>
        <div className="flex gap-2 p-1.5 bg-slate-500/5 dark:bg-white/5 rounded-full border border-slate-200/50 dark:border-white/5">
           <div className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
           </div>
           <div className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-indigo-500"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
           </div>
        </div>
      </div>

      {/* 历法时间展示 */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-white/5 p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">公历</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{calendarData.solarDate.toLocaleDateString()} {calendarData.solarDate.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-8 0 4 4 0 0 0-8 0 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10Z"/><path d="M12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">农历</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{calendarData.lunarDate.year}年 {calendarData.lunarDate.month}月 {calendarData.lunarDate.day}日</p>
          </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-3 pt-4 border-t border-slate-200/30 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><path d="M12 12v-4"/><path d="m16 12-4 4-4-4"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">真太阳时</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{calendarData.trueSolarTime.trueSolarTime.toLocaleDateString()} {calendarData.trueSolarTime.trueSolarTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* 四柱大卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <PillarCard label="年柱" pillar={fourPillars.year} />
        <PillarCard label="月柱" pillar={fourPillars.month} />
        <PillarCard label="日柱" pillar={fourPillars.day} highlight />
        <PillarCard label="时柱" pillar={fourPillars.hour} />
      </div>
    </div>
  );
};

const PillarCard: React.FC<{ label: string; pillar: Pillar; highlight?: boolean }> = ({ label, pillar, highlight }) => (
  <div className={`flex flex-col items-center p-10 rounded-3xl border transition-all duration-300 relative group ${
    highlight
      ? 'bg-indigo-500/10 border-indigo-500/40 scale-[1.05] shadow-[0_20px_50px_-15px_rgba(99,102,241,0.25)]'
      : 'bg-slate-500/5 border-slate-200/50 dark:border-white/5 hover:bg-slate-500/10 hover:-translate-y-1'
  }`}>
    {highlight && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-indigo-500/50 uppercase tracking-tighter">
        Day Master
      </div>
    )}
    <span className={`text-[11px] font-black uppercase tracking-[0.2em] mb-6 ${highlight ? 'text-indigo-500' : 'text-slate-400'}`}>
      {label}
    </span>
    <div className="flex flex-col items-center gap-2">
      <span className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter leading-tight group-hover:scale-110 transition-transform duration-500">{pillar.stem}</span>
      <span className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter leading-tight group-hover:scale-110 transition-transform duration-500">{pillar.branch}</span>
    </div>
  </div>
);

export default ResultDisplay;
