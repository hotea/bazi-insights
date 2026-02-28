/**
 * 月柱推算模块单元测试
 *
 * 测试覆盖：
 * - 已知日期的月柱验证
 * - 五虎遁月口诀：5 组年干对应的月干映射
 * - 边界：节气交接时刻前后的月柱切换
 * - 边界：年末年初（小寒/大寒期间）的月柱
 */

import { describe, it, expect } from 'vitest';
import { calculateMonthPillar, calculateMonthStem, YEAR_STEM_TO_MONTH_START } from './monthPillar';
import { getAllSolarTerms } from '../calendar/solarTerms';
import type { HeavenlyStem, SolarTerm } from '../../types';

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
 * 辅助函数：获取包含相邻年份节气的完整数组
 * 月柱推算需要跨年节气数据（如上一年的大雪、小寒等）
 */
function getSolarTermsWithNeighbors(year: number): SolarTerm[] {
  return [
    ...getAllSolarTerms(year - 1),
    ...getAllSolarTerms(year),
    ...getAllSolarTerms(year + 1),
  ];
}

describe('calculateMonthStem - 五虎遁月口诀', () => {
  // 甲/己年 → 寅月起丙寅（偏移 2）
  it('甲年：寅月天干为丙', () => {
    expect(calculateMonthStem('甲', 0)).toBe('丙');
  });

  it('己年：寅月天干为丙', () => {
    expect(calculateMonthStem('己', 0)).toBe('丙');
  });

  // 乙/庚年 → 寅月起戊寅（偏移 4）
  it('乙年：寅月天干为戊', () => {
    expect(calculateMonthStem('乙', 0)).toBe('戊');
  });

  it('庚年：寅月天干为戊', () => {
    expect(calculateMonthStem('庚', 0)).toBe('戊');
  });

  // 丙/辛年 → 寅月起庚寅（偏移 6）
  it('丙年：寅月天干为庚', () => {
    expect(calculateMonthStem('丙', 0)).toBe('庚');
  });

  it('辛年：寅月天干为庚', () => {
    expect(calculateMonthStem('辛', 0)).toBe('庚');
  });

  // 丁/壬年 → 寅月起壬寅（偏移 8）
  it('丁年：寅月天干为壬', () => {
    expect(calculateMonthStem('丁', 0)).toBe('壬');
  });

  it('壬年：寅月天干为壬', () => {
    expect(calculateMonthStem('壬', 0)).toBe('壬');
  });

  // 戊/癸年 → 寅月起甲寅（偏移 0）
  it('戊年：寅月天干为甲', () => {
    expect(calculateMonthStem('戊', 0)).toBe('甲');
  });

  it('癸年：寅月天干为甲', () => {
    expect(calculateMonthStem('癸', 0)).toBe('甲');
  });

  // 验证月干递推：甲年寅月丙，卯月丁，辰月戊...
  it('甲年各月天干递推正确', () => {
    const expected: HeavenlyStem[] = ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'];
    for (let i = 0; i < 12; i++) {
      expect(calculateMonthStem('甲', i)).toBe(expected[i]);
    }
  });

  // 验证所有 5 组年干的偏移值
  it('五虎遁月偏移值完整性', () => {
    expect(YEAR_STEM_TO_MONTH_START['甲']).toBe(2);
    expect(YEAR_STEM_TO_MONTH_START['己']).toBe(2);
    expect(YEAR_STEM_TO_MONTH_START['乙']).toBe(4);
    expect(YEAR_STEM_TO_MONTH_START['庚']).toBe(4);
    expect(YEAR_STEM_TO_MONTH_START['丙']).toBe(6);
    expect(YEAR_STEM_TO_MONTH_START['辛']).toBe(6);
    expect(YEAR_STEM_TO_MONTH_START['丁']).toBe(8);
    expect(YEAR_STEM_TO_MONTH_START['壬']).toBe(8);
    expect(YEAR_STEM_TO_MONTH_START['戊']).toBe(0);
    expect(YEAR_STEM_TO_MONTH_START['癸']).toBe(0);
  });
});

describe('calculateMonthPillar - 已知日期月柱验证', () => {
  // 2024 年（甲辰年，年干甲）
  it('2024-03-15 → 丁卯月（惊蛰后、清明前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 3, 15, 12, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.stem).toBe('丁');
    expect(pillar.branch).toBe('卯');
  });

  it('2024-06-15 → 庚午月（芒种后、小暑前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 6, 15, 12, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.stem).toBe('庚');
    expect(pillar.branch).toBe('午');
  });

  it('2024-08-15 → 壬申月（立秋后、白露前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 8, 15, 12, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.stem).toBe('壬');
    expect(pillar.branch).toBe('申');
  });

  // 2023 年（癸卯年，年干癸）
  it('2023-04-10 → 丙辰月（清明后、立夏前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2023);
    const date = bjTime(2023, 4, 10, 12, 0);
    const pillar = calculateMonthPillar(date, '癸', solarTerms);
    expect(pillar.stem).toBe('丙');
    expect(pillar.branch).toBe('辰');
  });

  // 2020 年（庚子年，年干庚）
  it('2020-02-10 → 戊寅月（立春后、惊蛰前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2020);
    const date = bjTime(2020, 2, 10, 12, 0);
    const pillar = calculateMonthPillar(date, '庚', solarTerms);
    expect(pillar.stem).toBe('戊');
    expect(pillar.branch).toBe('寅');
  });
});

describe('calculateMonthPillar - 节气交接边界测试', () => {
  // 2024 年惊蛰：约 2024-03-05 10:23 北京时间
  it('2024 惊蛰后 1 小时 → 卯月', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    // 惊蛰后明确时间
    const date = bjTime(2024, 3, 5, 12, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.branch).toBe('卯');
  });

  it('2024 惊蛰前 1 天 → 仍为寅月', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 3, 4, 12, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.branch).toBe('寅');
  });

  // 2024 年立春：约 2024-02-04 16:27 北京时间
  it('2024 立春后 → 寅月', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 2, 4, 17, 0);
    const pillar = calculateMonthPillar(date, '甲', solarTerms);
    expect(pillar.branch).toBe('寅');
  });

  it('2024 立春前 → 丑月（上一年的丑月）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    const date = bjTime(2024, 2, 4, 15, 0);
    // 立春前属于上一年的丑月，年干应为癸（癸卯年）
    const pillar = calculateMonthPillar(date, '癸', solarTerms);
    expect(pillar.branch).toBe('丑');
  });

  // 节气交接时刻：恰好在节气时刻应属于新月份（Requirements 12.3）
  it('恰好在节气交接时刻 → 属于新月份', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    // 找到 2024 年惊蛰的精确时刻
    const jingZhe = solarTerms.find(
      (t) => t.index === 4 && t.moment.getFullYear() === 2024,
    );
    expect(jingZhe).toBeDefined();

    // 恰好在惊蛰时刻 → 应为卯月
    const pillar = calculateMonthPillar(jingZhe!.moment, '甲', solarTerms);
    expect(pillar.branch).toBe('卯');
  });
});

describe('calculateMonthPillar - 年末年初边界（小寒/大雪期间）', () => {
  // 小寒(index=0) → 丑月，大雪(index=22) → 子月
  // 这些月份跨越公历年份边界

  it('2024-01-10 → 丑月（小寒后、立春前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2024);
    // 2024年1月10日，在2024年小寒(约1月6日)之后，立春(约2月4日)之前
    const date = bjTime(2024, 1, 10, 12, 0);
    // 此时年干为癸（2023癸卯年，因为还没到立春）
    const pillar = calculateMonthPillar(date, '癸', solarTerms);
    expect(pillar.branch).toBe('丑');
  });

  it('2023-12-15 → 子月（大雪后、小寒前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2023);
    // 2023年12月15日，在大雪(约12月7日)之后，2024年小寒之前
    const date = bjTime(2023, 12, 15, 12, 0);
    // 年干为癸（癸卯年）
    const pillar = calculateMonthPillar(date, '癸', solarTerms);
    expect(pillar.branch).toBe('子');
  });

  it('2023-11-15 → 亥月（立冬后、大雪前）', () => {
    const solarTerms = getSolarTermsWithNeighbors(2023);
    const date = bjTime(2023, 11, 15, 12, 0);
    const pillar = calculateMonthPillar(date, '癸', solarTerms);
    expect(pillar.branch).toBe('亥');
  });
});

describe('calculateMonthPillar - 错误处理', () => {
  it('空节气数组应抛出错误', () => {
    const date = bjTime(2024, 6, 15, 12, 0);
    expect(() => calculateMonthPillar(date, '甲', [])).toThrow();
  });
});
