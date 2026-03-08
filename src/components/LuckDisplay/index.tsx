import React from 'react';
import { useBaZiStore } from '../../store';

/**
 * 大运流年展示组件
 */
const LuckDisplay: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return null;

  const { luck, palaces } = result;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">大运流年</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium mr-2">命宫：</span>
          {palaces.mingGong.stem}{palaces.mingGong.branch}
        </div>
        <div>
          <span className="font-medium mr-2">胎元：</span>
          {palaces.taiYuan.stem}{palaces.taiYuan.branch}
        </div>
        <div>
          <span className="font-medium mr-2">身宫：</span>
          {palaces.shenGong.stem}{palaces.shenGong.branch}
        </div>
        <div>
          <span className="font-medium mr-2">大运方向：</span>
          {luck.direction === 'forward' ? '顺行' : '逆行'}
        </div>
        <div>
          <span className="font-medium mr-2">起运年龄：</span>
          {luck.startAge.years}岁 {luck.startAge.months}个月
        </div>
      </div>

      {/* 大运列表 */}
      <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">大运</h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {luck.daYun.map((step, i) => (
          <div key={i} className="flex flex-col items-center bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <span className="text-xs text-indigo-400 mb-1">{step.startAge}岁</span>
            <div className="flex flex-col items-center text-lg font-bold text-indigo-800 dark:text-indigo-100">
              <span>{step.pillar.stem}</span>
              <span>{step.pillar.branch}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 流年展示（前10年） */}
      <h3 className="text-lg font-medium mt-6 mb-3 text-gray-700 dark:text-gray-200">流年 (前10年)</h3>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {luck.currentLiuNian.map((entry, i) => (
          <div key={i} className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 mb-1">{entry.year}</span>
            <div className="flex flex-col items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
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
