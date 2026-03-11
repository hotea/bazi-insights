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
    <div className="glass-card p-8 rounded-3xl">
      <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
        大运流年
      </h2>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-white/5 p-6 rounded-2xl border border-slate-200/50 dark:border-white/5">
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">命宫</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{palaces.mingGong.stem}{palaces.mingGong.branch}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">胎元</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{palaces.taiYuan.stem}{palaces.taiYuan.branch}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">身宫</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{palaces.shenGong.stem}{palaces.shenGong.branch}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">起运</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{luck.startAge.years}岁 {luck.startAge.months}个月</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">方向</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{luck.direction === 'forward' ? '顺行' : '逆行'}</span>
        </div>
      </div>

      {/* 大运列表 */}
      <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-slate-400 ml-1">大运</h3>
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-8 gap-3 mb-8">
        {luck.daYun.map((step: DaYunStep, i: number) => (
          <div key={i} className="flex flex-col items-center bg-indigo-500/5 dark:bg-indigo-400/10 p-4 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all group">
            <span className="text-[10px] font-black text-indigo-500/60 mb-2 group-hover:text-indigo-500 transition-colors">{step.startAge}岁</span>
            <div className="flex flex-col items-center text-xl font-black text-indigo-900 dark:text-indigo-100">
              <span>{step.pillar.stem}</span>
              <span>{step.pillar.branch}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 流年展示（前10年） */}
      <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-slate-400 ml-1">流年 (前10年)</h3>
      <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-5 xl:grid-cols-10 gap-2">
        {luck.currentLiuNian.map((entry: LiuNianEntry, i: number) => (
          <div key={i} className="flex flex-col items-center bg-slate-500/5 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 hover:bg-slate-500/10 transition-all">
            <span className="text-[10px] font-bold text-slate-400 mb-1">{entry.year}</span>
            <div className="flex flex-col items-center text-sm font-black text-slate-700 dark:text-slate-200">
              <span>{entry.pillar.stem}</span>
              <span>{entry.pillar.branch}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuckDisplay;
