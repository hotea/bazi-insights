/**
 * 四柱推算引擎集成
 *
 * 结合真太阳时和节气数据，推算年、月、日、时四柱。
 */

import type { FourPillars, SolarTerm } from '../../types';
import { calculateYearPillar } from './yearPillar';
import { calculateMonthPillar } from './monthPillar';
import { calculateDayPillar } from './dayPillar';
import { calculateHourPillar } from './hourPillar';

/**
 * 推算四柱
 *
 * @param trueSolarTime - 真太阳时
 * @param solarTerms - 节气数据（应覆盖目标日期前后）
 * @param earlyRatSplit - 是否启用早子时分属不同日柱
 * @returns 完整的四柱对象
 */
export function calculateFourPillars(
  trueSolarTime: Date,
  solarTerms: SolarTerm[],
  earlyRatSplit: boolean
): FourPillars {
  // 1. 推算年柱
  const year = calculateYearPillar(trueSolarTime, solarTerms);

  // 2. 推算月柱（依赖年柱天干）
  const month = calculateMonthPillar(trueSolarTime, year.stem, solarTerms);

  // 3. 推算日柱
  const day = calculateDayPillar(trueSolarTime, earlyRatSplit);

  // 4. 推算时柱（依赖日柱天干）
  const hour = calculateHourPillar(trueSolarTime, day.stem);

  return { year, month, day, hour };
}

export * from './yearPillar';
export * from './monthPillar';
export * from './dayPillar';
export * from './hourPillar';
