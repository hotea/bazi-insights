/**
 * 年柱推算模块单元测试
 *
 * 测试覆盖：
 * - 已知年份的年柱验证（如 2024 甲辰年、1984 甲子年）
 * - 立春分界：立春前后年柱正确切换
 * - 多年份跨度验证
 */

import { describe, it, expect } from 'vitest';
import { calculateYearPillar, getYearPillar } from './yearPillar';
import { getAllSolarTerms } from '../calendar/solarTerms';
import type { SolarTerm } from '../../types';

/**
 * 辅助函数：创建北京时间 Date 对象
 * Date 内部用 UTC 存储北京时间值
 */
function bjTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

/**
 * 辅助函数：获取包含指定年份立春数据的节气数组
 */
function getSolarTermsForYear(year: number): SolarTerm[] {
  return getAllSolarTerms(year);
}

describe('getYearPillar - 根据年份计算干支', () => {
  it('甲子年：1984 → 甲子', () => {
    const pillar = getYearPillar(1984);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  it('甲辰年：2024 → 甲辰', () => {
    const pillar = getYearPillar(2024);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('辰');
  });

  it('乙巳年：2025 → 乙巳', () => {
    const pillar = getYearPillar(2025);
    expect(pillar.stem).toBe('乙');
    expect(pillar.branch).toBe('巳');
  });

  it('庚子年：2020 → 庚子', () => {
    const pillar = getYearPillar(2020);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('子');
  });

  it('辛丑年：2021 → 辛丑', () => {
    const pillar = getYearPillar(2021);
    expect(pillar.stem).toBe('辛');
    expect(pillar.branch).toBe('丑');
  });

  it('庚午年：1990 → 庚午', () => {
    const pillar = getYearPillar(1990);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('午');
  });

  it('庚子年：1900 → 庚子', () => {
    const pillar = getYearPillar(1900);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('子');
  });

  it('庚申年：2100 → 庚申（支持范围上限附近）', () => {
    const pillar = getYearPillar(2100);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('申');
  });

  it('六十甲子循环：相隔60年干支相同', () => {
    const p1 = getYearPillar(1984);
    const p2 = getYearPillar(2044);
    expect(p1.stem).toBe(p2.stem);
    expect(p1.branch).toBe(p2.branch);
  });
});

describe('calculateYearPillar - 以立春为分界的年柱推算', () => {
  // 2024 年立春：2024-02-04 16:27 北京时间
  it('2024 立春之后 → 甲辰年', () => {
    const solarTerms = getSolarTermsForYear(2024);
    // 2024-06-15 明确在立春之后
    const date = bjTime(2024, 6, 15, 12, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('辰');
  });

  it('2024 立春之前 → 癸卯年（上一年干支）', () => {
    const solarTerms = getSolarTermsForYear(2024);
    // 2024-01-15 在立春之前
    const date = bjTime(2024, 1, 15, 12, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('癸');
    expect(pillar.branch).toBe('卯');
  });

  it('2024 立春当天稍后 → 甲辰年', () => {
    const solarTerms = getSolarTermsForYear(2024);
    // 2024-02-04 17:00 在立春（16:27）之后
    const date = bjTime(2024, 2, 4, 17, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('辰');
  });

  it('2024 立春当天稍前 → 癸卯年', () => {
    const solarTerms = getSolarTermsForYear(2024);
    // 2024-02-04 16:00 在立春（16:27）之前
    const date = bjTime(2024, 2, 4, 16, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('癸');
    expect(pillar.branch).toBe('卯');
  });

  // 2023 年立春：2023-02-04 10:42 北京时间
  it('2023 立春之后 → 癸卯年', () => {
    const solarTerms = getSolarTermsForYear(2023);
    const date = bjTime(2023, 5, 1, 12, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('癸');
    expect(pillar.branch).toBe('卯');
  });

  it('2023 立春之前 → 壬寅年', () => {
    const solarTerms = getSolarTermsForYear(2023);
    const date = bjTime(2023, 1, 20, 8, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('壬');
    expect(pillar.branch).toBe('寅');
  });

  // 1984 年立春：1984-02-04 约 23:19 北京时间
  it('1984 立春之后 → 甲子年', () => {
    const solarTerms = getSolarTermsForYear(1984);
    const date = bjTime(1984, 3, 1, 12, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  it('1984 立春之前 → 癸亥年', () => {
    const solarTerms = getSolarTermsForYear(1984);
    const date = bjTime(1984, 1, 15, 12, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('癸');
    expect(pillar.branch).toBe('亥');
  });

  // 2000 年立春：2000-02-04 20:40 北京时间
  it('2000 立春之后 → 庚辰年', () => {
    const solarTerms = getSolarTermsForYear(2000);
    const date = bjTime(2000, 2, 4, 21, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('辰');
  });

  it('2000 立春之前 → 己卯年', () => {
    const solarTerms = getSolarTermsForYear(2000);
    const date = bjTime(2000, 2, 4, 20, 0);
    const pillar = calculateYearPillar(date, solarTerms);
    expect(pillar.stem).toBe('己');
    expect(pillar.branch).toBe('卯');
  });

  it('应在缺少立春数据时抛出错误', () => {
    const emptySolarTerms: SolarTerm[] = [];
    const date = bjTime(2024, 6, 15, 12, 0);
    expect(() => calculateYearPillar(date, emptySolarTerms)).toThrow('未找到');
  });
});
