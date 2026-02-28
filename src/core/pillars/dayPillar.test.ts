/**
 * 日柱推算模块单元测试
 *
 * 测试覆盖：
 * - 基准日验证（1900-01-31 = 甲子日）
 * - 已知日期的日柱验证（与权威资料对照）
 * - 早子时（earlyRatSplit = true）：23:00-23:59 属于下一日日柱
 * - 非早子时（earlyRatSplit = false）：23:00-23:59 属于当日日柱
 * - 午夜边界（00:00）测试
 * - 多日期跨度验证
 */

import { describe, it, expect } from 'vitest';
import { calculateDayPillar } from './dayPillar';

/**
 * 辅助函数：创建北京时间 Date 对象
 * Date 内部用 UTC 存储北京时间值
 */
function bjTime(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

describe('calculateDayPillar - 基准日与已知日期验证', () => {
  it('基准日 1900-01-31 = 甲子日', () => {
    const date = bjTime(1900, 1, 31, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  it('1900-02-01 = 乙丑日（基准日后一天）', () => {
    const date = bjTime(1900, 2, 1, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('乙');
    expect(pillar.branch).toBe('丑');
  });

  it('1900-01-30 = 癸亥日（基准日前一天）', () => {
    const date = bjTime(1900, 1, 30, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('癸');
    expect(pillar.branch).toBe('亥');
  });

  // 2024-01-01 = 甲辰日（可通过万年历查证）
  it('2024-01-01 = 甲辰日', () => {
    const date = bjTime(2024, 1, 1, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('辰');
  });

  // 2000-01-01 = 戊午日
  it('2000-01-01 = 戊午日', () => {
    const date = bjTime(2000, 1, 1, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('戊');
    expect(pillar.branch).toBe('午');
  });

  // 1984-02-04 = 甲子日（甲子年甲子日）
  it('1984-02-04 = 甲子日', () => {
    const date = bjTime(1984, 2, 4, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  // 六十甲子循环：相隔60天干支相同
  it('六十甲子循环：基准日 + 60天 = 甲子日', () => {
    const date = bjTime(1900, 4, 1, 12, 0); // 1900-01-31 + 60天 = 1900-04-01
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  // 2023-10-01 = 丙午日
  it('2023-10-01 = 丙午日', () => {
    const date = bjTime(2023, 10, 1, 12, 0);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('丙');
    expect(pillar.branch).toBe('午');
  });
});

describe('calculateDayPillar - 早子时处理', () => {
  // 使用基准日 1900-01-31（甲子日）测试早子时
  // 1900-01-31 23:30 → earlyRatSplit=true 时应属于下一日（乙丑日）
  it('earlyRatSplit=true, 23:30 → 属于下一日日柱', () => {
    const date = bjTime(1900, 1, 31, 23, 30);
    const pillar = calculateDayPillar(date, true);
    // 甲子日的下一日是乙丑日
    expect(pillar.stem).toBe('乙');
    expect(pillar.branch).toBe('丑');
  });

  it('earlyRatSplit=false, 23:30 → 仍属于当日日柱', () => {
    const date = bjTime(1900, 1, 31, 23, 30);
    const pillar = calculateDayPillar(date, false);
    // 仍然是甲子日
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  // 23:00 边界测试
  it('earlyRatSplit=true, 23:00 → 属于下一日日柱', () => {
    const date = bjTime(1900, 1, 31, 23, 0);
    const pillar = calculateDayPillar(date, true);
    expect(pillar.stem).toBe('乙');
    expect(pillar.branch).toBe('丑');
  });

  it('earlyRatSplit=true, 22:59 → 仍属于当日日柱', () => {
    const date = bjTime(1900, 1, 31, 22, 59);
    const pillar = calculateDayPillar(date, true);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  // 23:59 边界测试
  it('earlyRatSplit=true, 23:59 → 属于下一日日柱', () => {
    const date = bjTime(1900, 1, 31, 23, 59);
    const pillar = calculateDayPillar(date, true);
    expect(pillar.stem).toBe('乙');
    expect(pillar.branch).toBe('丑');
  });

  it('earlyRatSplit=false, 23:59 → 仍属于当日日柱', () => {
    const date = bjTime(1900, 1, 31, 23, 59);
    const pillar = calculateDayPillar(date, false);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  // 使用其他日期测试早子时
  it('2024-01-01 23:15, earlyRatSplit=true → 属于 2024-01-02 的日柱', () => {
    const dateWithEarly = bjTime(2024, 1, 1, 23, 15);
    const dateNextDay = bjTime(2024, 1, 2, 12, 0);
    const pillarEarly = calculateDayPillar(dateWithEarly, true);
    const pillarNextDay = calculateDayPillar(dateNextDay, false);
    // 早子时应与下一日日柱相同
    expect(pillarEarly.stem).toBe(pillarNextDay.stem);
    expect(pillarEarly.branch).toBe(pillarNextDay.branch);
  });
});

describe('calculateDayPillar - 午夜边界测试', () => {
  it('00:00 午夜 → 属于新一天的日柱（无论 earlyRatSplit 设置）', () => {
    // 1900-02-01 00:00 应该是乙丑日
    const dateA = bjTime(1900, 2, 1, 0, 0);
    const pillarA = calculateDayPillar(dateA, false);
    expect(pillarA.stem).toBe('乙');
    expect(pillarA.branch).toBe('丑');

    const pillarB = calculateDayPillar(dateA, true);
    expect(pillarB.stem).toBe('乙');
    expect(pillarB.branch).toBe('丑');
  });

  it('00:30 → 属于当日日柱（无论 earlyRatSplit 设置）', () => {
    const date = bjTime(1900, 2, 1, 0, 30);
    const pillarA = calculateDayPillar(date, false);
    const pillarB = calculateDayPillar(date, true);
    expect(pillarA.stem).toBe(pillarB.stem);
    expect(pillarA.branch).toBe(pillarB.branch);
  });
});

describe('calculateDayPillar - 多日期跨度验证', () => {
  it('连续两天的日柱应在六十甲子中相邻', () => {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const day1 = bjTime(2024, 6, 15, 12, 0);
    const day2 = bjTime(2024, 6, 16, 12, 0);
    const pillar1 = calculateDayPillar(day1, false);
    const pillar2 = calculateDayPillar(day2, false);

    const stemIdx1 = stems.indexOf(pillar1.stem);
    const stemIdx2 = stems.indexOf(pillar2.stem);
    const branchIdx1 = branches.indexOf(pillar1.branch);
    const branchIdx2 = branches.indexOf(pillar2.branch);

    // 天干应相邻（循环）
    expect(stemIdx2).toBe((stemIdx1 + 1) % 10);
    // 地支应相邻（循环）
    expect(branchIdx2).toBe((branchIdx1 + 1) % 12);
  });

  it('相隔 60 天的日柱应相同', () => {
    const day1 = bjTime(2024, 3, 1, 12, 0);
    const day2 = bjTime(2024, 4, 30, 12, 0); // 3月1日 + 60天 = 4月30日
    const pillar1 = calculateDayPillar(day1, false);
    const pillar2 = calculateDayPillar(day2, false);
    expect(pillar1.stem).toBe(pillar2.stem);
    expect(pillar1.branch).toBe(pillar2.branch);
  });
});
