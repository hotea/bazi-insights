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
    { key: 'wood', name: '木', color: 'bg-green-500', labelColor: 'text-green-600' },
    { key: 'fire', name: '火', color: 'bg-red-500', labelColor: 'text-red-600' },
    { key: 'earth', name: '土', color: 'bg-yellow-500', labelColor: 'text-yellow-600' },
    { key: 'metal', name: '金', color: 'bg-gray-400', labelColor: 'text-gray-500' },
    { key: 'water', name: '水', color: 'bg-blue-500', labelColor: 'text-blue-600' },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">五行分析</h2>

      {/* 力量分布柱状图（简单 CSS 实现） */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-5 gap-4 h-48 items-end border-b border-gray-100 dark:border-gray-700 pb-4">
          {labels.map((item) => {
            const val = wuxing.score[item.key];
            const height = Math.min((val / wuxing.score.total) * 300, 100);
            return (
              <div key={item.key} className="flex flex-col items-center gap-2 group">
                <span className={`text-xs font-bold ${item.labelColor}`}>{val.toFixed(1)}</span>
                <div
                  className={`w-full ${item.color} rounded-t-lg transition-all duration-500 hover:opacity-80`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* 旺衰分析 */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">日主状态：</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              wuxing.dayMasterStrength.status === 'strong' ? 'bg-green-100 text-green-700' :
              wuxing.dayMasterStrength.status === 'weak' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {wuxing.dayMasterStrength.status === 'strong' ? '身旺' :
               wuxing.dayMasterStrength.status === 'weak' ? '身弱' : '中和'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {wuxing.dayMasterStrength.analysis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WuXingChart;
