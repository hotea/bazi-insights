/**
 * 五行力量分析模块
 *
 * 计算八字中五行的分布计数和力量评分。
 */

import type { WuXing, HeavenlyStem, EarthlyBranch, FourPillars, WuXingCount, WuXingScore, DayMasterStrength, Pillar } from '../../types';

/**
 * 干支到五行的映射
 */
const STEM_TO_WUXING: Record<HeavenlyStem, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

const BRANCH_TO_WUXING: Record<EarthlyBranch, WuXing> = {
  '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土',
  '亥': '水', '子': '水', '丑': '土',
};

/**
 * 转换五行键名为输出格式
 */
function getWuXingKey(wuxing: WuXing): keyof WuXingCount {
  const map: Record<WuXing, keyof WuXingCount> = {
    '金': 'metal',
    '木': 'wood',
    '水': 'water',
    '火': 'fire',
    '土': 'earth',
  };
  return map[wuxing];
}

/**
 * 计算五行计数（简单统计八字中的五行出现次数）
 */
export function calculateWuXingCount(fourPillars: FourPillars): WuXingCount {
  const count: WuXingCount = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
  const pillars: Pillar[] = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  for (const pillar of pillars) {
    count[getWuXingKey(STEM_TO_WUXING[pillar.stem])]++;
    count[getWuXingKey(BRANCH_TO_WUXING[pillar.branch])]++;
  }

  return count;
}

/**
 * 计算五行力量评分
 * 简单的启发式算法：天干计 1.2 分，地支计 1.0 分，月令地支计 2.0 分（权重增强）
 */
export function calculateWuXingScore(fourPillars: FourPillars): WuXingScore {
  const score: WuXingScore = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, total: 0 };

  // 天干权重
  const stems: HeavenlyStem[] = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.day.stem, fourPillars.hour.stem];
  for (const stem of stems) {
    const s = 1.2;
    score[getWuXingKey(STEM_TO_WUXING[stem])] += s;
    score.total += s;
  }

  // 地支权重
  const branches: EarthlyBranch[] = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  for (let i = 0; i < branches.length; i++) {
    // 月令（index 1）权重增强
    const s = i === 1 ? 2.0 : 1.0;
    score[getWuXingKey(BRANCH_TO_WUXING[branches[i]])] += s;
    score.total += s;
  }

  return score;
}

/**
 * 判断日主旺衰
 */
export function calculateDayMasterStrength(
  fourPillars: FourPillars,
  score: WuXingScore
): DayMasterStrength {
  const dayStem = fourPillars.day.stem;
  const dayWuXing = STEM_TO_WUXING[dayStem];
  const dayScore = score[getWuXingKey(dayWuXing)];

  // 计算同类（比劫 + 印枭）力量
  // 此处简化处理：仅以日主所在五行力量占比判断
  const percentage = (dayScore / score.total) * 100;

  let status: 'strong' | 'weak' | 'neutral' = 'neutral';
  if (percentage > 25) status = 'strong';
  else if (percentage < 15) status = 'weak';

  return {
    status,
    score: Math.round(percentage),
    analysis: `日主为${dayStem}${dayWuXing}，在全局力量中占比约为 ${Math.round(percentage)}%。`,
  };
}
