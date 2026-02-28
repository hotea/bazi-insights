// ============================================================
// 农历转换模块测试
// 覆盖：已知日期转换、闰月处理、往返一致性、边界情况
// ============================================================

import { describe, it, expect } from 'vitest';
import { solarToLunar, lunarToSolar, getLeapMonth } from './lunarCalendar';

describe('getLeapMonth - 获取闰月信息', () => {
  it('无闰月的年份应返回 0', () => {
    expect(getLeapMonth(1901)).toBe(0);
  });

  it('有闰月的年份应返回正确的闰月月份', () => {
    // 2023 年闰二月
    expect(getLeapMonth(2023)).toBe(2);
    // 2025 年闰六月
    expect(getLeapMonth(2025)).toBe(6);
    // 2020 年闰四月
    expect(getLeapMonth(2020)).toBe(4);
    // 2017 年闰六月
    expect(getLeapMonth(2017)).toBe(6);
    // 1900 年闰八月
    expect(getLeapMonth(1900)).toBe(8);
  });

  it('年份超出范围应抛出错误', () => {
    expect(() => getLeapMonth(1899)).toThrow('超出支持范围');
    expect(() => getLeapMonth(2101)).toThrow('超出支持范围');
  });

  it('边界年份应正常工作', () => {
    expect(() => getLeapMonth(1900)).not.toThrow();
    expect(() => getLeapMonth(2100)).not.toThrow();
  });
});

describe('solarToLunar - 公历转农历', () => {
  it('基准日期：1900-01-31 应为农历 1900 年正月初一', () => {
    const result = solarToLunar(new Date(Date.UTC(1900, 0, 31)));
    expect(result).toEqual({
      year: 1900,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
  });

  it('已知日期：2000-01-01 的农历转换', () => {
    // 2000年1月1日 = 农历1999年十一月廿六
    // 1999年十一月初一 = 1999-12-07，所以 2000-01-01 距离 25 天 = 廿六
    const result = solarToLunar(new Date(Date.UTC(2000, 0, 1)));
    expect(result.year).toBe(1999);
    expect(result.month).toBe(11);
    expect(result.day).toBe(26);
    expect(result.isLeapMonth).toBe(false);
  });

  it('已知日期：2023-01-22 应为农历 2023 年正月初一', () => {
    const result = solarToLunar(new Date(Date.UTC(2023, 0, 22)));
    expect(result).toEqual({
      year: 2023,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
  });

  it('已知日期：2024-02-10 应为农历 2024 年正月初一', () => {
    const result = solarToLunar(new Date(Date.UTC(2024, 1, 10)));
    expect(result).toEqual({
      year: 2024,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
  });

  it('闰月日期：2023 年闰二月中的日期', () => {
    // 2023年闰二月从公历3月21日开始（权威来源确认）
    const result = solarToLunar(new Date(Date.UTC(2023, 2, 21)));
    expect(result.year).toBe(2023);
    expect(result.month).toBe(2);
    expect(result.isLeapMonth).toBe(true);
    expect(result.day).toBe(1);
  });

  it('2023 年正常二月最后一天', () => {
    // 2023年二月从2月20日到3月20日（29天）
    const result = solarToLunar(new Date(Date.UTC(2023, 2, 20)));
    expect(result.year).toBe(2023);
    expect(result.month).toBe(2);
    expect(result.isLeapMonth).toBe(false);
  });

  it('年份超出范围应抛出错误', () => {
    expect(() => solarToLunar(new Date(Date.UTC(1899, 0, 1)))).toThrow();
  });

  it('年末日期转换', () => {
    // 2023-12-31 = 农历2023年十一月十九
    const result = solarToLunar(new Date(Date.UTC(2023, 11, 31)));
    expect(result.year).toBe(2023);
    expect(result.month).toBe(11);
    expect(result.day).toBe(19);
    expect(result.isLeapMonth).toBe(false);
  });

  it('春节前一天应属于上一个农历年', () => {
    // 2023年春节是1月22日，1月21日应属于2022年
    const result = solarToLunar(new Date(Date.UTC(2023, 0, 21)));
    expect(result.year).toBe(2022);
  });
});

describe('lunarToSolar - 农历转公历', () => {
  it('农历 1900 年正月初一应为 1900-01-31', () => {
    const result = lunarToSolar({ year: 1900, month: 1, day: 1, isLeapMonth: false });
    expect(result.getUTCFullYear()).toBe(1900);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCDate()).toBe(31);
  });

  it('农历 2023 年正月初一应为 2023-01-22', () => {
    const result = lunarToSolar({ year: 2023, month: 1, day: 1, isLeapMonth: false });
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCDate()).toBe(22);
  });

  it('农历 2024 年正月初一应为 2024-02-10', () => {
    const result = lunarToSolar({ year: 2024, month: 1, day: 1, isLeapMonth: false });
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(1);
    expect(result.getUTCDate()).toBe(10);
  });

  it('闰月转换：2023 年闰二月初一应为 2023-03-21', () => {
    // 权威来源确认：2023年闰二月从3月21日开始
    const result = lunarToSolar({ year: 2023, month: 2, day: 1, isLeapMonth: true });
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(2); // 3月
    expect(result.getUTCDate()).toBe(21);
  });

  it('不存在的闰月应抛出错误', () => {
    // 2024 年没有闰月
    expect(() => lunarToSolar({ year: 2024, month: 3, day: 1, isLeapMonth: true })).toThrow();
  });

  it('日期超过该月天数应抛出错误', () => {
    // 2023年正月只有29天
    expect(() => lunarToSolar({ year: 2023, month: 1, day: 30, isLeapMonth: false })).toThrow();
  });

  it('年份超出范围应抛出错误', () => {
    expect(() => lunarToSolar({ year: 1899, month: 1, day: 1, isLeapMonth: false })).toThrow();
    expect(() => lunarToSolar({ year: 2101, month: 1, day: 1, isLeapMonth: false })).toThrow();
  });
});

describe('往返一致性 - 公历→农历→公历', () => {
  const testDates = [
    new Date(Date.UTC(1900, 0, 31)),  // 最早支持日期
    new Date(Date.UTC(1949, 9, 1)),   // 1949-10-01 国庆
    new Date(Date.UTC(1986, 0, 1)),   // 1986-01-01
    new Date(Date.UTC(2000, 0, 1)),   // 2000-01-01
    new Date(Date.UTC(2000, 5, 15)),  // 2000-06-15
    new Date(Date.UTC(2008, 7, 8)),   // 2008-08-08 奥运
    new Date(Date.UTC(2020, 0, 25)),  // 2020-01-25 春节
    new Date(Date.UTC(2023, 0, 22)),  // 2023-01-22 春节
    new Date(Date.UTC(2023, 2, 21)),  // 2023-03-21 闰月第一天
    new Date(Date.UTC(2023, 3, 19)),  // 2023-04-19 闰月最后一天
    new Date(Date.UTC(2023, 11, 31)), // 2023-12-31 年末
    new Date(Date.UTC(2024, 1, 10)),  // 2024-02-10 春节
    new Date(Date.UTC(2050, 5, 15)),  // 2050-06-15 未来日期
  ];

  testDates.forEach((date) => {
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    it(`往返一致性: ${dateStr}`, () => {
      const lunar = solarToLunar(date);
      const solar = lunarToSolar(lunar);
      expect(solar.getUTCFullYear()).toBe(date.getUTCFullYear());
      expect(solar.getUTCMonth()).toBe(date.getUTCMonth());
      expect(solar.getUTCDate()).toBe(date.getUTCDate());
    });
  });
});

describe('往返一致性 - 农历→公历→农历', () => {
  const testLunarDates = [
    { desc: '2023年正月初一', lunar: { year: 2023, month: 1, day: 1, isLeapMonth: false } },
    { desc: '2023年二月十五', lunar: { year: 2023, month: 2, day: 15, isLeapMonth: false } },
    { desc: '2023年闰二月初一', lunar: { year: 2023, month: 2, day: 1, isLeapMonth: true } },
    { desc: '2023年闰二月十五', lunar: { year: 2023, month: 2, day: 15, isLeapMonth: true } },
    { desc: '2024年正月初一', lunar: { year: 2024, month: 1, day: 1, isLeapMonth: false } },
    { desc: '2020年闰四月初一', lunar: { year: 2020, month: 4, day: 1, isLeapMonth: true } },
    { desc: '1900年正月初一', lunar: { year: 1900, month: 1, day: 1, isLeapMonth: false } },
  ];

  testLunarDates.forEach(({ desc, lunar }) => {
    it(`往返一致性: ${desc}`, () => {
      const solar = lunarToSolar(lunar);
      const result = solarToLunar(solar);
      expect(result.year).toBe(lunar.year);
      expect(result.month).toBe(lunar.month);
      expect(result.day).toBe(lunar.day);
      expect(result.isLeapMonth).toBe(lunar.isLeapMonth);
    });
  });
});


describe('闰月边界测试', () => {
  it('2023 年正常二月最后一天和闰二月第一天应连续', () => {
    // 2023年二月有29天，所以最后一天是二月廿九
    const normalLastDay = lunarToSolar({ year: 2023, month: 2, day: 29, isLeapMonth: false });
    const leapFirstDay = lunarToSolar({ year: 2023, month: 2, day: 1, isLeapMonth: true });

    // 闰二月第一天应该是正常二月最后一天的下一天
    const diff = (leapFirstDay.getTime() - normalLastDay.getTime()) / 86400000;
    expect(diff).toBe(1);
  });

  it('闰月最后一天和下一个正常月第一天应连续', () => {
    // 2023 年闰二月有 30 天
    const leapLastDay = lunarToSolar({ year: 2023, month: 2, day: 30, isLeapMonth: true });
    // 三月初一
    const nextMonthFirstDay = lunarToSolar({ year: 2023, month: 3, day: 1, isLeapMonth: false });

    const diff = (nextMonthFirstDay.getTime() - leapLastDay.getTime()) / 86400000;
    expect(diff).toBe(1);
  });

  it('非闰月年份的月份应连续', () => {
    // 2024 年无闰月
    expect(getLeapMonth(2024)).toBe(0);

    // 2024 年正月有 29 天，最后一天是廿九
    const janLast = lunarToSolar({ year: 2024, month: 1, day: 29, isLeapMonth: false });
    const febFirst = lunarToSolar({ year: 2024, month: 2, day: 1, isLeapMonth: false });
    const diff = (febFirst.getTime() - janLast.getTime()) / 86400000;
    expect(diff).toBe(1);
  });
});

describe('边界情况', () => {
  it('1900 年春节当天', () => {
    const result = solarToLunar(new Date(Date.UTC(1900, 0, 31)));
    expect(result).toEqual({ year: 1900, month: 1, day: 1, isLeapMonth: false });
  });

  it('2100 年的日期应能正常转换', () => {
    const result = solarToLunar(new Date(Date.UTC(2100, 0, 1)));
    expect(result.year).toBeGreaterThanOrEqual(2099);
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeGreaterThanOrEqual(1);
  });

  it('闰月标识区分：正常月和闰月的 isLeapMonth 不同', () => {
    // 2023 年有闰二月
    const normalFeb = solarToLunar(new Date(Date.UTC(2023, 1, 25))); // 二月中
    const leapFeb = solarToLunar(new Date(Date.UTC(2023, 3, 1)));    // 闰二月中

    expect(normalFeb.month).toBe(2);
    expect(normalFeb.isLeapMonth).toBe(false);

    expect(leapFeb.month).toBe(2);
    expect(leapFeb.isLeapMonth).toBe(true);
  });
});
