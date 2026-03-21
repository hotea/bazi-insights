import React from 'react';
import { useBaZiStore } from '../../store';
import type { DaYunStep, LiuNianEntry } from '../../types';

/**
 * 大运流年展示组件
 */
const LuckDisplay: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return null;

  const { luck, palaces } = result;

  return (
    <div className="glass-card p-10 rounded-[2.5rem] flex flex-col h-full">
      <h2 className="text-3xl font-black mb-12 text-slate-800 dark:text-slate-100 flex items-center gap-4">
        <span className="w-2.5 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></span>
        大运流年
      </h2>

      <div className="mb-12 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-white/5 p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12A10 10 0 1 1 12 2"/><path d="M22 2 12 12"/><path d="M16 2h6v6"/></svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">命宫</span>
          <span className="font-black text-slate-800 dark:text-slate-200 text-lg">{palaces.mingGong.stem}{palaces.mingGong.branch}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">胎元</span>
          <span className="font-black text-slate-800 dark:text-slate-200 text-lg">{palaces.taiYuan.stem}{palaces.taiYuan.branch}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">身宫</span>
          <span className="font-black text-slate-800 dark:text-slate-200 text-lg">{palaces.shenGong.stem}{palaces.shenGong.branch}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">起运</span>
          <span className="font-black text-slate-800 dark:text-slate-200 text-lg">{luck.startAge.years}岁 {luck.startAge.months}个月</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">方向</span>
          <span className="font-black text-slate-800 dark:text-slate-200 text-lg uppercase">{luck.direction === 'forward' ? '顺行 (Forward)' : '逆行 (Reverse)'}</span>
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {/* 大运列表 */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 ml-1">大运 (Major Luck)</h3>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {luck.daYun.map((step: DaYunStep, i: number) => (
              <div key={i} className="flex flex-col items-center bg-indigo-500/5 dark:bg-indigo-400/10 p-5 rounded-[1.5rem] border border-indigo-500/10 hover:border-indigo-500/40 interactive-element group">
                <span className="text-[9px] font-black text-indigo-500 mb-3 group-hover:scale-110 transition-transform tracking-tight">{step.startAge}岁</span>
                <div className="flex flex-col items-center text-2xl font-black text-indigo-900 dark:text-indigo-100 group-hover:brightness-125 transition-all">
                  <span>{step.pillar.stem}</span>
                  <span>{step.pillar.branch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 流年展示（前10年） */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 ml-1">流年 (Annual Pillars)</h3>
          <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-3">
            {luck.currentLiuNian.map((entry: LiuNianEntry, i: number) => (
              <div key={i} className="flex flex-col items-center bg-slate-500/5 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 interactive-element group">
                <span className="text-[10px] font-black text-slate-400 mb-2 group-hover:text-indigo-500">{entry.year}</span>
                <div className="flex flex-col items-center text-sm font-black text-slate-700 dark:text-slate-200 group-hover:brightness-150">
                  <span>{entry.pillar.stem}</span>
                  <span>{entry.pillar.branch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckDisplay;
