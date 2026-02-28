/**
 * 年柱推算模块
 *
 * 根据真太阳时和立春精确时刻推算年柱干支。
 * 年柱以立春为分界点，而非公历1月1日或农历正月初一。
 *
 * 算法：
 *   1. 从节气数据中找到立春（index=2）的精确时刻
 *   2. 判断出生时间在立春之前还是之后
 *   3. 立春之前取上一年干支，立春及之后取当年干支
 *   4. 天干 = (year - 4) % 10 → 天干数组索引
 *   5. 地支 = (year - 4) % 12 → 地支数组索引
 */

import type { HeavenlyStem, EarthlyBranch, Pillar, SolarTerm } from '../../types';

// 天干数组（按序排列）
const HEAVENLY_STEMS: HeavenlyStem[] = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
];

// 地支数组（按序排列）
const EARTHLY_BRANCHES: EarthlyBranch[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
];

/** 立春在节气数组中的索引 */
const LICHUN_INDEX = 2;

/**
 * 根据年份计算年柱干支
 *
 * @param year - 干支纪年对应的年份
 * @returns 年柱（天干 + 地支）
 */
function getYearPillar(year: number): Pillar {
  // 六十甲子循环：甲子年对应公元4年
  // 天干序号 = (year - 4) % 10
  // 地支序号 = (year - 4) % 12
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * 从节气数组中查找立春时刻
 *
 * @param solarTerms - 节气数组（应包含目标年份的节气数据）
 * @param year - 目标年份
 * @returns 立春的精确时刻，未找到则返回 null
 */
function findLichunMoment(solarTerms: SolarTerm[], year: number): Date | null {
  for (const term of solarTerms) {
    if (term.index === LICHUN_INDEX && term.moment.getFullYear() === year) {
      return term.moment;
    }
  }
  return null;
}

/**
 * 推算年柱
 *
 * 以立春精确时刻为年柱分界点：
 * - 出生时间在立春之前 → 取上一年干支
 * - 出生时间在立春时刻或之后 → 取当年干支
 *
 * @param trueSolarTime - 真太阳时（Date 对象，UTC 存储北京时间值）
 * @param solarTerms - 节气数组（应包含出生年份及相邻年份的立春数据）
 * @returns 年柱（天干 + 地支）
 */
export function calculateYearPillar(trueSolarTime: Date, solarTerms: SolarTerm[]): Pillar {
  const year = trueSolarTime.getFullYear();

  // 查找当年立春时刻
  const lichunMoment = findLichunMoment(solarTerms, year);

  if (!lichunMoment) {
    throw new Error(`未找到 ${year} 年的立春数据，请确保 solarTerms 包含该年节气`);
  }

  // 判断出生时间与立春的先后关系
  // 立春时刻及之后 → 当年干支；立春之前 → 上一年干支
  const effectiveYear = trueSolarTime.getTime() >= lichunMoment.getTime() ? year : year - 1;

  return getYearPillar(effectiveYear);
}

// 导出辅助函数供测试使用
export { getYearPillar, HEAVENLY_STEMS, EARTHLY_BRANCHES };
