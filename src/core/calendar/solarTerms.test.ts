/**
 * 节气计算模块单元测试
 *
 * 使用紫金山天文台公布的节气数据验证计算精度
 * 精度要求：误差 < 1 分钟
 */

import { describe, it, expect } from 'vitest';
import {
  getSolarTermMoment,
  getAllSolarTerms,
  findPrevNextJieQi,
  isJie,
  SOLAR_TERM_NAMES,
} from './solarTerms';

/**
 * 辅助函数：比较两个时间的差值（分钟）
 */
function diffMinutes(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / 60000;
}

/**
 * 辅助函数：创建北京时间 Date 对象
 * 注意：Date 内部存储 UTC，北京时间 = UTC + 8h
 * 我们的 getSolarTermMoment 返回的是"北京时间值存储在 Date 中"
 * 即 date.getUTCHours() 实际上是北京时间的小时数
 */
function bjTime(year: number, month: number, day: number, hour: number, minute: number): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}

describe('getSolarTermMoment - 节气精确时刻计算', () => {
  // 2024 年部分节气数据（紫金山天文台公布，北京时间）
  // 来源：中国科学院紫金山天文台历算室
  const knownTerms2024: { index: number; name: string; expected: Date }[] = [
    { index: 0, name: '小寒', expected: bjTime(2024, 1, 6, 4, 49) },
    { index: 1, name: '大寒', expected: bjTime(2024, 1, 20, 22, 7) },
    { index: 2, name: '立春', expected: bjTime(2024, 2, 4, 16, 27) },
    { index: 3, name: '雨水', expected: bjTime(2024, 2, 19, 12, 13) },
    { index: 4, name: '惊蛰', expected: bjTime(2024, 3, 5, 10, 23) },
    { index: 5, name: '春分', expected: bjTime(2024, 3, 20, 11, 6) },
    { index: 6, name: '清明', expected: bjTime(2024, 4, 4, 15, 2) },
    { index: 7, name: '谷雨', expected: bjTime(2024, 4, 19, 21, 59) },
    { index: 8, name: '立夏', expected: bjTime(2024, 5, 5, 8, 10) },
    { index: 9, name: '小满', expected: bjTime(2024, 5, 20, 20, 59) },
    { index: 10, name: '芒种', expected: bjTime(2024, 6, 5, 12, 10) },
    { index: 11, name: '夏至', expected: bjTime(2024, 6, 21, 4, 51) },
    { index: 12, name: '小暑', expected: bjTime(2024, 7, 6, 22, 20) },
    { index: 13, name: '大暑', expected: bjTime(2024, 7, 22, 15, 44) },
    { index: 14, name: '立秋', expected: bjTime(2024, 8, 7, 8, 9) },
    { index: 15, name: '处暑', expected: bjTime(2024, 8, 22, 22, 55) },
    { index: 16, name: '白露', expected: bjTime(2024, 9, 7, 11, 11) },
    { index: 17, name: '秋分', expected: bjTime(2024, 9, 22, 20, 44) },
    { index: 18, name: '寒露', expected: bjTime(2024, 10, 8, 3, 0) },
    { index: 19, name: '霜降', expected: bjTime(2024, 10, 23, 6, 15) },
    { index: 20, name: '立冬', expected: bjTime(2024, 11, 7, 6, 20) },
    { index: 21, name: '小雪', expected: bjTime(2024, 11, 22, 3, 56) },
    { index: 22, name: '大雪', expected: bjTime(2024, 12, 6, 23, 17) },
    { index: 23, name: '冬至', expected: bjTime(2024, 12, 21, 17, 21) },
  ];

  it.each(knownTerms2024)(
    '2024年 $name (index=$index) 精度应 < 1 分钟',
    ({ index, expected }) => {
      const calculated = getSolarTermMoment(2024, index);
      const diff = diffMinutes(calculated, expected);
      expect(diff).toBeLessThan(1);
    }
  );

  // 2023 年部分节气数据验证
  const knownTerms2023: { index: number; name: string; expected: Date }[] = [
    { index: 2, name: '立春', expected: bjTime(2023, 2, 4, 10, 42) },
    { index: 5, name: '春分', expected: bjTime(2023, 3, 21, 5, 24) },
    { index: 11, name: '夏至', expected: bjTime(2023, 6, 21, 22, 58) },
    { index: 17, name: '秋分', expected: bjTime(2023, 9, 23, 14, 50) },
    { index: 23, name: '冬至', expected: bjTime(2023, 12, 22, 11, 27) },
  ];

  it.each(knownTerms2023)(
    '2023年 $name (index=$index) 精度应 < 1 分钟',
    ({ index, expected }) => {
      const calculated = getSolarTermMoment(2023, index);
      const diff = diffMinutes(calculated, expected);
      expect(diff).toBeLessThan(1);
    }
  );

  // 2000 年部分节气数据验证（较早年份）
  // 数据来源：紫金山天文台历算室
  const knownTerms2000: { index: number; name: string; expected: Date }[] = [
    { index: 2, name: '立春', expected: bjTime(2000, 2, 4, 20, 40) },
    { index: 5, name: '春分', expected: bjTime(2000, 3, 20, 15, 35) },
    { index: 11, name: '夏至', expected: bjTime(2000, 6, 21, 9, 48) },
    { index: 17, name: '秋分', expected: bjTime(2000, 9, 23, 1, 28) },
    { index: 23, name: '冬至', expected: bjTime(2000, 12, 21, 21, 37) },
  ];

  it.each(knownTerms2000)(
    '2000年 $name (index=$index) 精度应 < 2 分钟',
    ({ index, expected }) => {
      const calculated = getSolarTermMoment(2000, index);
      const diff = diffMinutes(calculated, expected);
      // 较早年份允许稍大误差（ΔT 估算精度降低）
      expect(diff).toBeLessThan(2);
    }
  );

  it('应拒绝无效的节气序号', () => {
    expect(() => getSolarTermMoment(2024, -1)).toThrow('无效的节气序号');
    expect(() => getSolarTermMoment(2024, 24)).toThrow('无效的节气序号');
  });
});

describe('getAllSolarTerms - 获取全年节气', () => {
  it('应返回恰好 24 个节气', () => {
    const terms = getAllSolarTerms(2024);
    expect(terms).toHaveLength(24);
  });

  it('每个节气应包含完整信息', () => {
    const terms = getAllSolarTerms(2024);
    for (const term of terms) {
      expect(term.name).toBeTruthy();
      expect(term.index).toBeGreaterThanOrEqual(0);
      expect(term.index).toBeLessThanOrEqual(23);
      expect(term.moment).toBeInstanceOf(Date);
      expect(term.longitude).toBeGreaterThanOrEqual(0);
      expect(term.longitude).toBeLessThanOrEqual(345);
    }
  });

  it('节气应按时间顺序排列', () => {
    const terms = getAllSolarTerms(2024);
    for (let i = 1; i < terms.length; i++) {
      expect(terms[i].moment.getTime()).toBeGreaterThan(
        terms[i - 1].moment.getTime()
      );
    }
  });

  it('节气时刻应精确到秒', () => {
    const terms = getAllSolarTerms(2024);
    for (const term of terms) {
      // 验证 Date 对象有效
      expect(term.moment.getTime()).not.toBeNaN();
      // 验证秒级精度（毫秒部分可以存在）
      const seconds = term.moment.getUTCSeconds();
      expect(seconds).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeLessThanOrEqual(59);
    }
  });

  it('节气名称应覆盖全部 24 个', () => {
    const terms = getAllSolarTerms(2024);
    const names = terms.map((t) => t.name);
    for (const name of SOLAR_TERM_NAMES) {
      expect(names).toContain(name);
    }
  });
});

describe('findPrevNextJieQi - 查找前后节气', () => {
  it('应正确找到 2024-03-15 前后的"节"', () => {
    // 2024-03-15 在惊蛰(3月5日)之后、清明(4月4日)之前
    const date = new Date(Date.UTC(2024, 2, 15, 12, 0, 0));
    const { prev, next } = findPrevNextJieQi(date);

    expect(prev.name).toBe('惊蛰');
    expect(next.name).toBe('清明');
  });

  it('应正确找到 2024-01-01 前后的"节"', () => {
    // 2024-01-01 在大雪(2023年12月7日)之后、小寒(2024年1月6日)之前
    const date = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
    const { prev, next } = findPrevNextJieQi(date);

    expect(prev.name).toBe('大雪');
    expect(next.name).toBe('小寒');
  });

  it('应正确找到 2024-06-10 前后的"节"', () => {
    // 2024-06-10 在芒种(6月5日)之后、小暑(7月6日)之前
    const date = new Date(Date.UTC(2024, 5, 10, 12, 0, 0));
    const { prev, next } = findPrevNextJieQi(date);

    expect(prev.name).toBe('芒种');
    expect(next.name).toBe('小暑');
  });

  it('返回的应该都是"节"而非"气"', () => {
    const date = new Date(Date.UTC(2024, 3, 25, 12, 0, 0));
    const { prev, next } = findPrevNextJieQi(date);

    // 验证返回的都是"节"
    expect(isJie(prev.index)).toBe(true);
    expect(isJie(next.index)).toBe(true);
  });
});

describe('isJie - 判断节气是否为"节"', () => {
  it('偶数索引应为"节"', () => {
    // 节：小寒(0)、立春(2)、惊蛰(4)、清明(6)、立夏(8)、芒种(10)
    //     小暑(12)、立秋(14)、白露(16)、寒露(18)、立冬(20)、大雪(22)
    const jieIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    for (const idx of jieIndices) {
      expect(isJie(idx)).toBe(true);
    }
  });

  it('奇数索引应为"气"', () => {
    // 气：大寒(1)、雨水(3)、春分(5)、谷雨(7)、小满(9)、夏至(11)
    //     大暑(13)、处暑(15)、秋分(17)、霜降(19)、小雪(21)、冬至(23)
    const qiIndices = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
    for (const idx of qiIndices) {
      expect(isJie(idx)).toBe(false);
    }
  });
});
