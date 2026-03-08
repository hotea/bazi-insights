import React from 'react';
import { useBaZiStore } from '../../store';
import type { Pillar } from '../../types';

/**
 * 结果展示组件
 */
const ResultDisplay: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return (
    <div className="glass-card p-12 rounded-3xl text-center text-slate-400 font-medium">
      <div className="mb-4 text-4xl">☯️</div>
      请在上方输入信息并点击“立即排盘”
    </div>
  );

  const { fourPillars, calendarData } = result;

  return (
    <div className="glass-card p-8 rounded-3xl">
      <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
        排盘结果
      </h2>

      {/* 历法时间展示 */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-white/5 p-6 rounded-2xl border border-slate-200/50 dark:border-white/5">
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">公历</span>
          {calendarData.solarDate.toLocaleDateString()} {calendarData.solarDate.toLocaleTimeString()}
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-3 text-slate-400">农历</span>
          {calendarData.lunarDate.year}年 {calendarData.lunarDate.month}月 {calendarData.lunarDate.day}日
        </div>
        <div className="md:col-span-2 flex items-center">
          <span className="font-bold mr-3 text-slate-400">真太阳时</span>
          {calendarData.trueSolarTime.trueSolarTime.toLocaleDateString()} {calendarData.trueSolarTime.trueSolarTime.toLocaleTimeString()}
        </div>
      </div>

      {/* 四柱大卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <PillarCard label="年柱" pillar={fourPillars.year} />
        <PillarCard label="月柱" pillar={fourPillars.month} />
        <PillarCard label="日柱" pillar={fourPillars.day} highlight />
        <PillarCard label="时柱" pillar={fourPillars.hour} />
      </div>
    </div>
  );
};

const PillarCard: React.FC<{ label: string; pillar: Pillar; highlight?: boolean }> = ({ label, pillar, highlight }) => (
  <div className={`flex flex-col items-center p-6 rounded-2xl border transition-all ${
    highlight
      ? 'bg-indigo-500/10 border-indigo-500/30 scale-105 shadow-lg shadow-indigo-500/10'
      : 'bg-slate-500/5 border-slate-200/50 dark:border-white/5'
  }`}>
    <span className={`text-xs font-black uppercase tracking-widest mb-4 ${highlight ? 'text-indigo-500' : 'text-slate-400'}`}>
      {label}
    </span>
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{pillar.stem}</span>
      <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{pillar.branch}</span>
    </div>
  </div>
);

export default ResultDisplay;
