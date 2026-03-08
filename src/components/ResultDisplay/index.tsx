import React from 'react';
import { useBaZiStore } from '../../store';
import type { Pillar } from '../../types';

/**
 * 结果展示组件
 */
const ResultDisplay: React.FC = () => {
  const { result } = useBaZiStore();

  if (!result) return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-400">
      请在上方输入信息并点击“立即排盘”
    </div>
  );

  const { fourPillars, calendarData } = result;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">排盘结果</h2>

      {/* 历法时间展示 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium mr-2">公历：</span>
          {calendarData.solarDate.toLocaleDateString()} {calendarData.solarDate.toLocaleTimeString()}
        </div>
        <div>
          <span className="font-medium mr-2">农历：</span>
          {calendarData.lunarDate.year}年 {calendarData.lunarDate.month}月 {calendarData.lunarDate.day}日
        </div>
        <div className="md:col-span-2">
          <span className="font-medium mr-2">真太阳时：</span>
          {calendarData.trueSolarTime.trueSolarTime.toLocaleDateString()} {calendarData.trueSolarTime.trueSolarTime.toLocaleTimeString()}
        </div>
      </div>

      {/* 四柱大卡片 */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
        <PillarCard label="年柱" pillar={fourPillars.year} />
        <PillarCard label="月柱" pillar={fourPillars.month} />
        <PillarCard label="日柱" pillar={fourPillars.day} />
        <PillarCard label="时柱" pillar={fourPillars.hour} />
      </div>
    </div>
  );
};

const PillarCard: React.FC<{ label: string; pillar: Pillar }> = ({ label, pillar }) => (
  <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
    <span className="text-xs text-gray-400 mb-2">{label}</span>
    <div className="flex flex-col items-center text-2xl font-bold text-gray-800 dark:text-gray-100">
      <span className="mb-1">{pillar.stem}</span>
      <span>{pillar.branch}</span>
    </div>
  </div>
);

export default ResultDisplay;
