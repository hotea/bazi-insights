/**
 * 夏令时处理模块单元测试
 *
 * 测试覆盖：
 * - isDSTActive: 夏令时生效期间判断
 * - applyDSTCorrection: 夏令时修正逻辑
 * - DST_TABLE: 1986-1991 年精确起止时刻表
 */

import { describe, it, expect } from 'vitest';
import { isDSTActive, applyDSTCorrection, DST_TABLE } from './dst';

/**
 * 辅助函数：创建北京时间 Date 对象
 * Date 内部使用 UTC 存储北京时间值（与项目其他模块保持一致）
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

describe('DST_TABLE - 夏令时时刻表', () => {
  it('应包含 1986-1991 年共 6 条记录', () => {
    expect(DST_TABLE).toHaveLength(6);
  });

  it('每条记录应包含 year、start、end 字段', () => {
    for (const entry of DST_TABLE) {
      expect(entry.year).toBeGreaterThanOrEqual(1986);
      expect(entry.year).toBeLessThanOrEqual(1991);
      expect(entry.start).toBeInstanceOf(Date);
      expect(entry.end).toBeInstanceOf(Date);
    }
  });

  it('每条记录的 start 应早于 end', () => {
    for (const entry of DST_TABLE) {
      expect(entry.start.getTime()).toBeLessThan(entry.end.getTime());
    }
  });

  it('1986 年夏令时应从 5月4日 02:00 到 9月14日 02:00', () => {
    const entry = DST_TABLE.find((e) => e.year === 1986)!;
    expect(entry.start.getTime()).toBe(bjTime(1986, 5, 4, 2, 0).getTime());
    expect(entry.end.getTime()).toBe(bjTime(1986, 9, 14, 2, 0).getTime());
  });

  it('1991 年夏令时应从 4月14日 02:00 到 9月15日 02:00', () => {
    const entry = DST_TABLE.find((e) => e.year === 1991)!;
    expect(entry.start.getTime()).toBe(bjTime(1991, 4, 14, 2, 0).getTime());
    expect(entry.end.getTime()).toBe(bjTime(1991, 9, 15, 2, 0).getTime());
  });
});

describe('isDSTActive - 夏令时生效判断', () => {
  // ---- 1986-1991 年范围外 ----
  it('1985 年应返回 false', () => {
    expect(isDSTActive(bjTime(1985, 6, 15, 12, 0))).toBe(false);
  });

  it('1992 年应返回 false', () => {
    expect(isDSTActive(bjTime(1992, 6, 15, 12, 0))).toBe(false);
  });

  it('2024 年应返回 false', () => {
    expect(isDSTActive(bjTime(2024, 6, 15, 12, 0))).toBe(false);
  });

  // ---- 夏令时生效期间内 ----
  it('1986 年 7 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1986, 7, 1, 12, 0))).toBe(true);
  });

  it('1987 年 6 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1987, 6, 15, 10, 0))).toBe(true);
  });

  it('1988 年 8 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1988, 8, 20, 8, 0))).toBe(true);
  });

  it('1989 年 5 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1989, 5, 1, 15, 0))).toBe(true);
  });

  it('1990 年 7 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1990, 7, 20, 6, 0))).toBe(true);
  });

  it('1991 年 6 月应处于夏令时期间', () => {
    expect(isDSTActive(bjTime(1991, 6, 1, 12, 0))).toBe(true);
  });

  // ---- 夏令时生效期间外（同年但不在范围内） ----
  it('1986 年 1 月应不在夏令时期间', () => {
    expect(isDSTActive(bjTime(1986, 1, 15, 12, 0))).toBe(false);
  });

  it('1987 年 12 月应不在夏令时期间', () => {
    expect(isDSTActive(bjTime(1987, 12, 1, 12, 0))).toBe(false);
  });

  // ---- 边界时刻测试 ----
  it('1986 年 5月4日 02:00 恰好是夏令时开始时刻（应返回 true）', () => {
    expect(isDSTActive(bjTime(1986, 5, 4, 2, 0, 0))).toBe(true);
  });

  it('1986 年 5月4日 01:59:59 应不在夏令时期间', () => {
    expect(isDSTActive(bjTime(1986, 5, 4, 1, 59, 59))).toBe(false);
  });

  it('1986 年 9月14日 02:00 恰好是夏令时结束时刻（应返回 false，左闭右开）', () => {
    expect(isDSTActive(bjTime(1986, 9, 14, 2, 0, 0))).toBe(false);
  });

  it('1986 年 9月14日 01:59:59 应仍在夏令时期间', () => {
    expect(isDSTActive(bjTime(1986, 9, 14, 1, 59, 59))).toBe(true);
  });

  it('1991 年 4月14日 02:00 恰好是夏令时开始时刻（应返回 true）', () => {
    expect(isDSTActive(bjTime(1991, 4, 14, 2, 0, 0))).toBe(true);
  });

  it('1991 年 9月15日 01:59:59 应仍在夏令时期间', () => {
    expect(isDSTActive(bjTime(1991, 9, 15, 1, 59, 59))).toBe(true);
  });

  it('1991 年 9月15日 02:00 应不在夏令时期间', () => {
    expect(isDSTActive(bjTime(1991, 9, 15, 2, 0, 0))).toBe(false);
  });
});

describe('applyDSTCorrection - 夏令时修正', () => {
  it('用户确认包含夏令时且在夏令时期间，应减去 1 小时', () => {
    const input = bjTime(1986, 7, 1, 15, 30);
    const result = applyDSTCorrection(input, true);

    // 15:30 - 1小时 = 14:30
    const expected = bjTime(1986, 7, 1, 14, 30);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('用户确认包含夏令时但不在夏令时期间，应保持原样', () => {
    const input = bjTime(1986, 1, 15, 12, 0);
    const result = applyDSTCorrection(input, true);

    expect(result.getTime()).toBe(input.getTime());
  });

  it('用户确认未包含夏令时且在夏令时期间，应保持原样', () => {
    const input = bjTime(1986, 7, 1, 15, 30);
    const result = applyDSTCorrection(input, false);

    expect(result.getTime()).toBe(input.getTime());
  });

  it('用户确认未包含夏令时且不在夏令时期间，应保持原样', () => {
    const input = bjTime(2024, 6, 15, 12, 0);
    const result = applyDSTCorrection(input, false);

    expect(result.getTime()).toBe(input.getTime());
  });

  it('修正后时间差应恰好为 1 小时（3600000 毫秒）', () => {
    const input = bjTime(1989, 6, 1, 10, 0);
    const result = applyDSTCorrection(input, true);

    expect(input.getTime() - result.getTime()).toBe(3600000);
  });

  it('1986-1991 年范围外的日期，即使确认夏令时也不修正', () => {
    const input = bjTime(1985, 7, 1, 12, 0);
    const result = applyDSTCorrection(input, true);

    expect(result.getTime()).toBe(input.getTime());
  });

  it('修正应正确处理跨日边界（凌晨 0:30 减 1 小时变为前一天 23:30）', () => {
    // 1987 年 6 月 15 日 00:30 在夏令时期间
    const input = bjTime(1987, 6, 15, 0, 30);
    const result = applyDSTCorrection(input, true);

    // 00:30 - 1小时 = 前一天 23:30
    const expected = bjTime(1987, 6, 14, 23, 30);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('夏令时开始边界时刻的修正', () => {
    // 1988 年 4月10日 02:00 是夏令时开始时刻
    const input = bjTime(1988, 4, 10, 2, 0);
    const result = applyDSTCorrection(input, true);

    // 02:00 - 1小时 = 01:00
    const expected = bjTime(1988, 4, 10, 1, 0);
    expect(result.getTime()).toBe(expected.getTime());
  });
});
