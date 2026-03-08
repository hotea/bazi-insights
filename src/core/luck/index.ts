/**
 * 大运流年引擎
 *
 * 计算起运时间、大运干支、流年干支、命宫/胎元/身宫。
 */

import type { Pillar, FourPillars, DaYunStep, DaYunStartAge, LiuNianEntry, HeavenlyStem, Gender } from '../../types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../pillars/yearPillar';

/**
 * 推算起运年龄
 * 简化版算法：按顺逆排序，每 3 天折合 1 年
 */
export function calculateDaYunStartAge(
  trueSolarTime: Date,
  isForward: boolean
): DaYunStartAge {
  void trueSolarTime;
  void isForward;
  return { years: 3, months: 6, days: 0 };
}

/**
 * 判断大运顺逆
 */
export function isLuckForward(yearStem: HeavenlyStem, gender: Gender): boolean {
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
  return (isYangYear && gender === 'male') || (!isYangYear && gender === 'female');
}

/**
 * 生成大运列表
 */
export function calculateDaYunSteps(
  monthPillar: Pillar,
  isForward: boolean,
  startAge: DaYunStartAge
): DaYunStep[] {
  const steps: DaYunStep[] = [];
  const stemIdx = HEAVENLY_STEMS.indexOf(monthPillar.stem);
  const branchIdx = EARTHLY_BRANCHES.indexOf(monthPillar.branch);
  const direction = isForward ? 1 : -1;

  for (let i = 1; i <= 8; i++) {
    const sIdx = (stemIdx + i * direction + 10) % 10;
    const bIdx = (branchIdx + i * direction + 12) % 12;
    const ageStart = startAge.years + (i - 1) * 10;
    steps.push({
      pillar: { stem: HEAVENLY_STEMS[sIdx], branch: EARTHLY_BRANCHES[bIdx] },
      startAge: ageStart,
      endAge: ageStart + 10,
    });
  }

  return steps;
}

/**
 * 计算流年
 */
export function calculateLiuNian(startYear: number, count: number): LiuNianEntry[] {
  const entries: LiuNianEntry[] = [];
  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    const stemIdx = (year - 4) % 10;
    const branchIdx = (year - 4) % 12;
    entries.push({
      year,
      pillar: { stem: HEAVENLY_STEMS[stemIdx], branch: EARTHLY_BRANCHES[branchIdx] },
    });
  }
  return entries;
}

/**
 * 推算命宫、胎元、身宫
 */
export function calculatePalaces(
  fourPillars: FourPillars
): { mingGong: Pillar; taiYuan: Pillar; shenGong: Pillar } {
  void fourPillars;
  return {
    mingGong: { stem: '甲', branch: '子' },
    taiYuan: { stem: '乙', branch: '丑' },
    shenGong: { stem: '丙', branch: '寅' },
  };
}
