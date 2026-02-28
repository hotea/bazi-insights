/**
 * 日柱推算模块
 *
 * 根据真太阳时推算日柱干支，支持早子时/晚子时分属不同日柱选项。
 *
 * 算法：
 *   1. 基准日：1900-01-31（UTC）= 甲子日（六十甲子序号 0）
 *   2. 计算目标日期与基准日之间的天数差
 *   3. 日柱序号 = daysDiff % 60
 *   4. 天干 = 序号 % 10，地支 = 序号 % 12
 *
 * 早子时处理：
 *   - 子时横跨 23:00-01:00，传统上分为早子时（23:00-23:59）和晚子时（00:00-00:59）
 *   - earlyRatSplit = true 时：23:00-23:59 属于下一日的日柱（以 23:00 为日柱切换点）
 *   - earlyRatSplit = false 时：23:00-23:59 仍属于当日的日柱（以 00:00 为日柱切换点）
 */

import type { Pillar } from '../../types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './yearPillar';

/**
 * 基准日：1900-01-31 UTC = 甲子日（六十甲子序号 0）
 * 使用 UTC 时间戳避免时区问题
 */
const BASE_DATE = Date.UTC(1900, 0, 31); // 1900年1月31日 00:00 UTC

/** 一天的毫秒数 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 推算日柱
 *
 * @param trueSolarTime - 真太阳时（Date 对象，UTC 存储北京时间值）
 * @param earlyRatSplit - 是否启用早子时分属不同日柱
 *   - true: 23:00-23:59（早子时/晚子时）属于下一日日柱
 *   - false: 23:00-23:59 仍属于当日日柱（默认行为）
 * @returns 日柱（天干 + 地支）
 */
export function calculateDayPillar(trueSolarTime: Date, earlyRatSplit: boolean): Pillar {
  // 提取 UTC 时间分量（因为 Date 用 UTC 存储北京时间值）
  const year = trueSolarTime.getUTCFullYear();
  const month = trueSolarTime.getUTCMonth();
  const day = trueSolarTime.getUTCDate();
  const hour = trueSolarTime.getUTCHours();

  // 计算当日 00:00 UTC 的时间戳
  const dayStart = Date.UTC(year, month, day);

  // 计算与基准日的天数差
  let daysDiff = Math.floor((dayStart - BASE_DATE) / MS_PER_DAY);

  // 早子时处理：当 earlyRatSplit 为 true 且时间在 23:00-23:59 时，日柱属于下一日
  if (earlyRatSplit && hour >= 23) {
    daysDiff += 1;
  }

  // 计算六十甲子序号（确保为非负数）
  const index = ((daysDiff % 60) + 60) % 60;

  // 天干序号 = index % 10，地支序号 = index % 12
  const stemIndex = index % 10;
  const branchIndex = index % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}
