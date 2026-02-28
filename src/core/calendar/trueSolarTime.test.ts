/**
 * 真太阳时计算模块单元测试
 *
 * 测试覆盖：
 * - EoT（时差方程）值在合理范围内
 * - 不同城市的经度时差修正
 * - 真太阳时计算公式的正确性
 */

import { describe, it, expect } from 'vitest';
import { calculateEoT, calculateTrueSolarTime, getDayOfYear } from './trueSolarTime';

/**
 * 辅助函数：创建北京时间 Date 对象
 * Date 内部使用 UTC 存储北京时间值（与节气模块保持一致）
 */
function bjTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

describe('getDayOfYear - 计算一年中的第几天', () => {
  it('1月1日应为第1天', () => {
    expect(getDayOfYear(bjTime(2024, 1, 1, 0, 0))).toBe(1);
  });

  it('12月31日在非闰年应为第365天', () => {
    expect(getDayOfYear(bjTime(2023, 12, 31, 0, 0))).toBe(365);
  });

  it('12月31日在闰年应为第366天', () => {
    expect(getDayOfYear(bjTime(2024, 12, 31, 0, 0))).toBe(366);
  });

  it('3月1日在闰年应为第61天', () => {
    expect(getDayOfYear(bjTime(2024, 3, 1, 0, 0))).toBe(61);
  });

  it('3月1日在非闰年应为第60天', () => {
    expect(getDayOfYear(bjTime(2023, 3, 1, 0, 0))).toBe(60);
  });
});

describe('calculateEoT - 时差方程计算', () => {
  it('全年 EoT 值应在 -15 到 +17 分钟范围内', () => {
    for (let day = 1; day <= 365; day++) {
      const eot = calculateEoT(day);
      expect(eot).toBeGreaterThanOrEqual(-15);
      expect(eot).toBeLessThanOrEqual(17);
    }
  });

  it('2月中旬（约第44天）EoT 应接近极小值约 -14 分钟', () => {
    // Meeus 简化公式中，第 44 天附近 EoT 达到负极值约 -14.6 分钟
    const eot = calculateEoT(44);
    expect(eot).toBeLessThan(-10);
    expect(eot).toBeGreaterThan(-17);
  });

  it('11月初（约第304天）EoT 应接近极大值约 +16 分钟', () => {
    // Meeus 简化公式中，第 304 天附近 EoT 达到正极值约 +16.4 分钟
    const eot = calculateEoT(304);
    expect(eot).toBeGreaterThan(10);
    expect(eot).toBeLessThan(17);
  });

  it('4月中旬（约第105天）EoT 应接近 0', () => {
    // 4月中旬 EoT 接近零点
    const eot = calculateEoT(105);
    expect(Math.abs(eot)).toBeLessThan(2);
  });

  it('9月初（约第245天）EoT 应接近 0', () => {
    // 9月初 EoT 接近零点
    const eot = calculateEoT(245);
    expect(Math.abs(eot)).toBeLessThan(2);
  });
});

describe('calculateTrueSolarTime - 真太阳时计算', () => {
  it('经度 120° 时经度时差应为 0', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 120);
    expect(result.longitudeDiff).toBe(0);
  });

  it('结果对象应包含原始时间和真太阳时', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 116.4);

    expect(result.originalTime).toBe(time);
    expect(result.trueSolarTime).toBeInstanceOf(Date);
    expect(typeof result.longitudeDiff).toBe('number');
    expect(typeof result.eotCorrection).toBe('number');
  });

  it('北京（经度 116.4°）经度时差应约为 -14.4 分钟', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 116.4);

    // 经度时差 = (116.4 - 120) × 4 = -14.4 分钟
    expect(result.longitudeDiff).toBeCloseTo(-14.4, 5);
  });

  it('乌鲁木齐（经度 87.6°）经度时差应约为 -129.6 分钟', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 87.6);

    // 经度时差 = (87.6 - 120) × 4 = -129.6 分钟
    expect(result.longitudeDiff).toBeCloseTo(-129.6, 5);
  });

  it('上海（经度 121.5°）经度时差应约为 +6 分钟', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 121.5);

    // 经度时差 = (121.5 - 120) × 4 = 6 分钟
    expect(result.longitudeDiff).toBeCloseTo(6, 5);
  });

  it('真太阳时应等于标准时间加上经度时差和EoT修正', () => {
    const time = bjTime(2024, 3, 20, 12, 0);
    const longitude = 116.4;
    const result = calculateTrueSolarTime(time, longitude);

    // 手动计算期望值
    const expectedLongDiff = (longitude - 120) * 4; // -14.4 分钟
    const dayOfYear = getDayOfYear(time);
    const expectedEoT = calculateEoT(dayOfYear);
    const totalCorrectionMs = (expectedLongDiff + expectedEoT) * 60 * 1000;
    const expectedTrueSolarTime = new Date(time.getTime() + totalCorrectionMs);

    expect(result.trueSolarTime.getTime()).toBe(expectedTrueSolarTime.getTime());
    expect(result.longitudeDiff).toBeCloseTo(expectedLongDiff, 10);
    expect(result.eotCorrection).toBeCloseTo(expectedEoT, 10);
  });

  it('乌鲁木齐的真太阳时应明显早于北京标准时间', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 87.6);

    // 乌鲁木齐经度时差约 -129.6 分钟，真太阳时应比标准时间早约 2 小时
    const diffMinutes =
      (result.trueSolarTime.getTime() - time.getTime()) / 60000;
    expect(diffMinutes).toBeLessThan(-100); // 至少早 100 分钟
  });

  it('不同日期的 EoT 修正值应不同', () => {
    const longitude = 120; // 经度时差为 0，只看 EoT 差异
    const time1 = bjTime(2024, 2, 15, 12, 0); // 2月中旬（EoT 负极值附近）
    const time2 = bjTime(2024, 11, 1, 12, 0); // 11月初（EoT 正极值附近）

    const result1 = calculateTrueSolarTime(time1, longitude);
    const result2 = calculateTrueSolarTime(time2, longitude);

    // 2月中旬 EoT 为负值，11月初 EoT 为正值（Meeus 简化公式）
    expect(result1.eotCorrection).toBeLessThan(0);
    expect(result2.eotCorrection).toBeGreaterThan(0);
  });

  it('经度 120° 时真太阳时与标准时间的差值应仅为 EoT 修正', () => {
    const time = bjTime(2024, 6, 15, 12, 0);
    const result = calculateTrueSolarTime(time, 120);

    const diffMs = result.trueSolarTime.getTime() - time.getTime();
    const diffMinutes = diffMs / 60000;

    // 差值应等于 EoT 修正值（允许浮点精度误差）
    expect(diffMinutes).toBeCloseTo(result.eotCorrection, 4);
  });
});
