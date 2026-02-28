/**
 * 夏令时处理模块
 *
 * 中国在 1986-1991 年间实施夏令时（DST），每年春季将时钟拨快 1 小时，
 * 秋季再拨回。本模块提供夏令时检测和修正功能。
 *
 * 导出函数：
 * - isDSTActive(date): 判断给定日期时间是否处于夏令时生效期间
 * - applyDSTCorrection(date, userConfirmedDST): 根据用户确认修正夏令时
 */

import type { DSTEntry } from '../../types';

/**
 * 中国夏令时精确起止时刻表（1986-1991）
 *
 * 每年夏令时从指定日期凌晨 2:00 开始（时钟拨至 3:00），
 * 到指定日期凌晨 2:00 结束（时钟拨回 1:00）。
 *
 * 注意：Date 使用 UTC 存储北京时间值（与项目其他模块保持一致）
 */
export const DST_TABLE: DSTEntry[] = [
  {
    year: 1986,
    start: new Date(Date.UTC(1986, 4, 4, 2, 0, 0)),   // 5月4日 02:00
    end: new Date(Date.UTC(1986, 8, 14, 2, 0, 0)),     // 9月14日 02:00
  },
  {
    year: 1987,
    start: new Date(Date.UTC(1987, 3, 12, 2, 0, 0)),   // 4月12日 02:00
    end: new Date(Date.UTC(1987, 8, 13, 2, 0, 0)),     // 9月13日 02:00
  },
  {
    year: 1988,
    start: new Date(Date.UTC(1988, 3, 10, 2, 0, 0)),   // 4月10日 02:00
    end: new Date(Date.UTC(1988, 8, 11, 2, 0, 0)),     // 9月11日 02:00
  },
  {
    year: 1989,
    start: new Date(Date.UTC(1989, 3, 16, 2, 0, 0)),   // 4月16日 02:00
    end: new Date(Date.UTC(1989, 8, 17, 2, 0, 0)),     // 9月17日 02:00
  },
  {
    year: 1990,
    start: new Date(Date.UTC(1990, 3, 15, 2, 0, 0)),   // 4月15日 02:00
    end: new Date(Date.UTC(1990, 8, 16, 2, 0, 0)),     // 9月16日 02:00
  },
  {
    year: 1991,
    start: new Date(Date.UTC(1991, 3, 14, 2, 0, 0)),   // 4月14日 02:00
    end: new Date(Date.UTC(1991, 8, 15, 2, 0, 0)),     // 9月15日 02:00
  },
];

/**
 * 判断给定日期时间是否处于中国夏令时生效期间
 *
 * @param date - 待检测的日期时间（UTC 存储的北京时间）
 * @returns 如果处于夏令时生效期间返回 true，否则返回 false
 */
export function isDSTActive(date: Date): boolean {
  const year = date.getUTCFullYear();

  // 仅 1986-1991 年实施夏令时
  if (year < 1986 || year > 1991) {
    return false;
  }

  const entry = DST_TABLE.find((e) => e.year === year);
  if (!entry) {
    return false;
  }

  const timestamp = date.getTime();
  // 夏令时生效期间：[start, end)
  return timestamp >= entry.start.getTime() && timestamp < entry.end.getTime();
}

/**
 * 根据用户确认修正夏令时
 *
 * 当用户确认出生时间包含夏令时偏移时，将时间减去 1 小时以还原为标准时间。
 * 如果用户确认未包含夏令时，或日期不在夏令时期间，则保持原样。
 *
 * @param date - 用户输入的出生日期时间（UTC 存储的北京时间）
 * @param userConfirmedDST - 用户是否确认出生时间包含夏令时
 * @returns 修正后的日期时间
 */
export function applyDSTCorrection(
  date: Date,
  userConfirmedDST: boolean
): Date {
  // 仅当用户确认包含夏令时且日期在夏令时期间时才修正
  if (userConfirmedDST && isDSTActive(date)) {
    // 减去 1 小时（3600000 毫秒）
    return new Date(date.getTime() - 60 * 60 * 1000);
  }

  return date;
}
