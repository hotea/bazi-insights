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
    { key: 'wood', name: '木', color: 'bg-emerald-500', labelColor: 'text-emerald-600', shadow: 'shadow-emerald-500/20' },
    { key: 'fire', name: '火', color: 'bg-rose-500', labelColor: 'text-rose-600', shadow: 'shadow-rose-500/20' },
    { key: 'earth', name: '土', color: 'bg-amber-500', labelColor: 'text-amber-600', shadow: 'shadow-amber-500/20' },
    { key: 'metal', name: '金', color: 'bg-slate-400', labelColor: 'text-slate-500', shadow: 'shadow-slate-400/20' },
    { key: 'water', name: '水', color: 'bg-blue-500', labelColor: 'text-blue-600', shadow: 'shadow-blue-500/20' },
  ] as const;

  return (
    <div className="glass-card p-8 rounded-3xl">
      <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
        五行分析
      </h2>

      {/* 力量分布柱状图 */}
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-5 gap-4 h-56 items-end border-b border-slate-200/50 dark:border-white/5 pb-6">
          {labels.map((item) => {
            const val = wuxing.score[item.key];
            const height = Math.min((val / wuxing.score.total) * 300, 100);
            return (
              <div key={item.key} className="flex flex-col items-center gap-3 group">
                <span className={`text-xs font-black ${item.labelColor}`}>{val.toFixed(1)}</span>
                <div
                  className={`w-full ${item.color} rounded-xl transition-all duration-700 hover:scale-105 shadow-lg ${item.shadow}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* 旺衰分析 */}
        <div className="bg-slate-500/5 dark:bg-white/5 p-6 rounded-2xl border border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">日主状态</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              wuxing.dayMasterStrength.status === 'strong' ? 'bg-emerald-500/20 text-emerald-600' :
              wuxing.dayMasterStrength.status === 'weak' ? 'bg-rose-500/20 text-rose-600' :
              'bg-blue-500/20 text-blue-600'
            }`}>
              {wuxing.dayMasterStrength.status === 'strong' ? '身旺' :
               wuxing.dayMasterStrength.status === 'weak' ? '身弱' : '中和'}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {wuxing.dayMasterStrength.analysis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WuXingChart;
