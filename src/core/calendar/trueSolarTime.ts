/**
 * 真太阳时计算模块
 *
 * 真太阳时 = 北京标准时间 + 经度时差修正 + 时差方程(EoT)修正
 *
 * - 经度时差：(longitude - 120) × 4 分钟/度
 * - 时差方程(EoT)：基于 Meeus 简化公式，考虑地球椭圆轨道和黄赤交角
 *
 * @module trueSolarTime
 */

import type { TrueSolarTimeResult } from '../../types';

/**
 * 计算一年中的第几天（dayOfYear）
 *
 * @param date - 日期对象（使用 UTC 方法读取，因为内部存储的是北京时间值）
 * @returns 一年中的第几天（1-366）
 */
export function getDayOfYear(date: Date): number {
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / 86400000) + 1;
}

/**
 * 计算时差方程修正值（Equation of Time）
 *
 * 使用 Meeus 简化公式：
 *   B = 360/365.25 × (dayOfYear - 81)（度）
 *   EoT = 9.87 × sin(2B) - 7.53 × cos(B) - 1.5 × sin(B)（分钟）
 *
 * EoT 范围大约在 -14 到 +16 分钟之间
 *
 * @param dayOfYear - 一年中的第几天（1-366）
 * @returns EoT 修正值（分钟），正值表示真太阳时快于平太阳时
 */
export function calculateEoT(dayOfYear: number): number {
  // 将角度 B 转换为弧度进行三角函数计算
  const B = ((360 / 365.25) * (dayOfYear - 81)) * (Math.PI / 180);

  // Meeus 简化公式
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  return eot;
}

/**
 * 计算真太阳时
 *
 * 公式：真太阳时 = 北京标准时间 + 经度时差 + EoT修正
 * 其中：经度时差 = (longitude - 120) × 4 分钟/度
 *
 * @param standardTime - 北京标准时间（Date 对象，UTC 字段存储北京时间值）
 * @param longitude - 出生地经度（东经为正）
 * @returns TrueSolarTimeResult 对象
 */
export function calculateTrueSolarTime(
  standardTime: Date,
  longitude: number
): TrueSolarTimeResult {
  // 计算经度时差（分钟）
  // 北京时间基于东经 120°，每度对应 4 分钟
  const longitudeDiff = (longitude - 120) * 4;

  // 计算当天是一年中的第几天
  const dayOfYear = getDayOfYear(standardTime);

  // 计算时差方程修正值（分钟）
  const eotCorrection = calculateEoT(dayOfYear);

  // 总修正量（毫秒）
  const totalCorrectionMs = (longitudeDiff + eotCorrection) * 60 * 1000;

  // 计算真太阳时
  const trueSolarTime = new Date(standardTime.getTime() + totalCorrectionMs);

  return {
    originalTime: standardTime,
    trueSolarTime,
    longitudeDiff,
    eotCorrection,
  };
}
