// ============================================================
// 农历转换模块
// 基于压缩查找表实现公历与农历的互相转换
// 支持范围：1900-2100 年
//
// 算法说明：
// 使用经典的农历压缩数据表，每年用一个整数编码：
// - 低 4 位 (bits 0-3): 闰月月份（0=无闰月）
// - 第 5 位 (bit 4): 闰月大小（0=29天，1=30天）
// - bits 5-16: 1-12 月大小月信息（1=30天，0=29天）
//   bit 16 对应 1 月，bit 5 对应 12 月
//
// 基准日期：1900年1月31日 = 农历庚子年正月初一
// ============================================================

import type { LunarDate } from '../../types';

/**
 * 农历数据表（1900-2100 年）
 * 每个值编码了该农历年的月份大小和闰月信息
 */
const LUNAR_INFO: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950,
  0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6,
  0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2,
  0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
  0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60,
  0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6,
  0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
  0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0,
  0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,
  0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
  0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540,
  0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0,
  0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
  0x05ac0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954,
  0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0,
  0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50,
  0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6,
  0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
  0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250,
  0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
  0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6,
  0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0, 0x092e0, 0x0d2e3,
  0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0,
  0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0,
  0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55,
  0x04b60, 0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520,
  0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0,
  0x0d150, 0x0f252, 0x0d520,
];


/**
 * 每年春节（农历正月初一）对应的公历月和日
 * 索引 0 = 1900 年，值格式：月*100+日
 * 例如 131 = 1月31日
 *
 * 数据来源：中国紫金山天文台历表
 */
const SPRING_FESTIVAL: number[] = [
  131, 219, 208, 129, 216, 204, 125, 213, 202, 121, // 1900-1909
  210, 130, 218, 206, 126, 214, 203, 123, 211, 201, // 1910-1919
  220, 208, 128, 216, 205, 124, 213, 202, 123, 210, // 1920-1929
  130, 217, 206, 126, 214, 204, 124, 211, 131, 219, // 1930-1939
  208, 127, 215, 205, 125, 213, 202, 122, 210, 129, // 1940-1949
  217, 206, 127, 214, 203, 124, 212, 131, 218, 208, // 1950-1959
  128, 215, 205, 125, 213, 202, 121, 209, 130, 217, // 1960-1969
  206, 127, 215, 203, 123, 211, 131, 218, 207, 128, // 1970-1979
  216, 205, 125, 213, 202, 220, 209, 129, 217, 206, // 1980-1989
  127, 215, 204, 123, 210, 131, 219, 207, 128, 216, // 1990-1999
  205, 124, 212, 201, 122, 209, 129, 218, 207, 126, // 2000-2009
  214, 203, 123, 210, 131, 219, 208, 128, 216, 205, // 2010-2019
  125, 212, 201, 122, 210, 129, 217, 206, 126, 213, // 2020-2029
  203, 123, 211, 131, 219, 208, 128, 215, 204, 124, // 2030-2039
  212, 201, 122, 210, 130, 217, 206, 126, 214, 202, // 2040-2049
  123, 211, 201, 119, 208, 128, 215, 204, 124, 212, // 2050-2059
  202, 121, 210, 129, 217, 205, 126, 214, 203, 123, // 2060-2069
  211, 131, 219, 208, 127, 215, 205, 124, 212, 202, // 2070-2079
  121, 209, 129, 217, 206, 126, 214, 203, 124, 211, // 2080-2089
  131, 218, 207, 127, 215, 204, 125, 212, 202, 121, // 2090-2099
  209, // 2100
];

// -------------------- 内部辅助函数 --------------------

/**
 * 获取某农历年的闰月月份（内部使用）
 * @returns 0 表示无闰月，1-12 表示闰几月
 */
function getLeapMonthInternal(year: number): number {
  return LUNAR_INFO[year - 1900] & 0xf;
}

/**
 * 获取某农历年闰月的天数
 * @returns 0（无闰月）、29 或 30
 */
function getLeapMonthDays(year: number): number {
  if (getLeapMonthInternal(year) === 0) return 0;
  return (LUNAR_INFO[year - 1900] & 0x10) ? 30 : 29;
}

/**
 * 获取某农历年某正常月的天数
 * @param month 1-12
 * @returns 29 或 30
 */
function getMonthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> (month - 1))) ? 30 : 29;
}

/**
 * 获取某农历年的总天数（含闰月）
 */
function getLunarYearDays(year: number): number {
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    total += getMonthDays(year, m);
  }
  total += getLeapMonthDays(year);
  return total;
}

/**
 * 获取春节（农历正月初一）对应的公历 Date（UTC）
 */
function getSpringFestivalDate(year: number): Date {
  const code = SPRING_FESTIVAL[year - 1900];
  const month = Math.floor(code / 100);
  const day = code % 100;
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 计算两个 UTC 日期之间的天数差（仅日期部分）
 * 返回 d2 - d1 的天数
 */
function daysBetween(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate());
  const utc2 = Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate());
  return Math.floor((utc2 - utc1) / 86400000);
}

// -------------------- 公开 API --------------------

/**
 * 获取某农历年的闰月信息
 * @param year 农历年份（1900-2100）
 * @returns 闰月月份，0 表示该年无闰月
 */
export function getLeapMonth(year: number): number {
  if (year < 1900 || year > 2100) {
    throw new Error(`年份 ${year} 超出支持范围 (1900-2100)`);
  }
  return getLeapMonthInternal(year);
}

/**
 * 公历日期转农历日期
 * @param date 公历日期（Date 对象，使用 UTC 存储北京时间值）
 * @returns 农历日期
 */
export function solarToLunar(date: Date): LunarDate {
  const solarYear = date.getUTCFullYear();
  const solarMonth = date.getUTCMonth() + 1;
  const solarDay = date.getUTCDate();

  // 验证范围
  if (solarYear < 1900 || solarYear > 2100) {
    throw new Error(`日期超出支持范围 (1900-2100)`);
  }

  const inputDate = new Date(Date.UTC(solarYear, solarMonth - 1, solarDay));

  // 确定该公历日期属于哪个农历年
  // 策略：如果在当年春节之前，则属于上一个农历年
  let lunarYear: number;
  const springFestival = getSpringFestivalDate(solarYear);

  if (inputDate >= springFestival) {
    lunarYear = solarYear;
  } else {
    lunarYear = solarYear - 1;
  }

  // 计算从该农历年春节到目标日期的天数偏移
  const yearSpringFestival = getSpringFestivalDate(lunarYear);
  let offset = daysBetween(yearSpringFestival, inputDate);

  // 如果 offset < 0，说明日期在春节之前（不应发生，因为上面已处理）
  if (offset < 0) {
    throw new Error(`内部错误：日期偏移为负`);
  }

  // 逐月推算
  const leapMonth = getLeapMonthInternal(lunarYear);
  let lunarMonth = 0;
  let isLeapMonth = false;

  for (let m = 1; m <= 12; m++) {
    // 正常月
    const days = getMonthDays(lunarYear, m);
    if (offset < days) {
      lunarMonth = m;
      isLeapMonth = false;
      break;
    }
    offset -= days;

    // 闰月（紧跟在对应正常月之后）
    if (leapMonth === m) {
      const leapDays = getLeapMonthDays(lunarYear);
      if (offset < leapDays) {
        lunarMonth = m;
        isLeapMonth = true;
        break;
      }
      offset -= leapDays;
    }
  }

  // 如果遍历完所有月份仍未找到（理论上不应发生）
  if (lunarMonth === 0) {
    lunarMonth = 12;
    isLeapMonth = false;
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: offset + 1,
    isLeapMonth,
  };
}

/**
 * 农历日期转公历日期
 * @param lunarDate 农历日期
 * @returns 公历日期（Date 对象，使用 UTC 存储北京时间值）
 */
export function lunarToSolar(lunarDate: LunarDate): Date {
  const { year, month, day, isLeapMonth } = lunarDate;

  // 验证范围
  if (year < 1900 || year > 2100) {
    throw new Error(`农历年份 ${year} 超出支持范围 (1900-2100)`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`农历月份 ${month} 无效`);
  }
  if (day < 1 || day > 30) {
    throw new Error(`农历日期 ${day} 无效`);
  }

  // 验证闰月是否存在
  const leapMonth = getLeapMonthInternal(year);
  if (isLeapMonth && leapMonth !== month) {
    throw new Error(`农历 ${year} 年没有闰${month}月`);
  }

  // 验证日期不超过该月天数
  const maxDays = isLeapMonth ? getLeapMonthDays(year) : getMonthDays(year, month);
  if (day > maxDays) {
    throw new Error(`农历 ${year} 年${isLeapMonth ? '闰' : ''}${month}月只有 ${maxDays} 天`);
  }

  // 从春节开始累加天数
  let offset = 0;

  for (let m = 1; m < month; m++) {
    offset += getMonthDays(year, m);
    if (leapMonth === m) {
      offset += getLeapMonthDays(year);
    }
  }

  // 如果目标是闰月，还需加上该月正常月的天数
  if (isLeapMonth) {
    offset += getMonthDays(year, month);
  }

  // 加上日期偏移（day 从 1 开始）
  offset += day - 1;

  // 从春节日期加上偏移天数
  const springFestival = getSpringFestivalDate(year);
  return new Date(springFestival.getTime() + offset * 86400000);
}
