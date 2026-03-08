/**
 * 时柱推算模块
 *
 * 根据真太阳时和日干推算时柱干支。
 */

import type { HeavenlyStem, Pillar } from '../../types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './yearPillar';

/**
 * 五鼠遁日口诀：日干 → 子时天干在 HEAVENLY_STEMS 中的索引偏移
 */
const DAY_STEM_TO_HOUR_START: Record<HeavenlyStem, number> = {
  '甲': 0, '己': 0,
  '乙': 2, '庚': 2,
  '丙': 4, '辛': 4,
  '丁': 6, '壬': 6,
  '戊': 8, '癸': 8,
};

/**
 * 根据小时确定时支索引
 */
export function getHourBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2);
}

/**
 * 推算时柱
 */
export function calculateHourPillar(trueSolarTime: Date, dayStem: HeavenlyStem): Pillar {
  const hour = trueSolarTime.getUTCHours();
  const branchIndex = getHourBranchIndex(hour);
  const branch = EARTHLY_BRANCHES[branchIndex];
  const startStemIndex = DAY_STEM_TO_HOUR_START[dayStem];
  const stemIndex = (startStemIndex + branchIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];
  return { stem, branch };
}
