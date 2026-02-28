/**
 * 节气计算模块
 *
 * 基于 Jean Meeus《Astronomical Algorithms》天文算法计算 24 节气精确时刻。
 * 使用 VSOP87 简化理论的高精度太阳黄经计算。
 *
 * 核心思路：
 *   1. 计算儒略日 (JDE) 与儒略世纪 (T)
 *   2. 利用 VSOP87 简化公式（含高阶摄动项）计算太阳黄经
 *   3. 通过牛顿迭代法求解太阳黄经等于目标角度的时刻
 *   4. 应用 ΔT 修正将力学时转换为世界时
 *
 * 精度目标：与紫金山天文台数据误差 < 1 分钟
 */

import type { SolarTerm } from '../../types';

// ==================== 常量定义 ====================

/** 24 节气名称（从小寒开始） */
const SOLAR_TERM_NAMES: string[] = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
];

/** 24 节气对应的太阳黄经（度），从小寒 285° 开始，每 15° 一个节气 */
const SOLAR_TERM_LONGITUDES: number[] = [
  285, 300, 315, 330, 345, 0,
  15, 30, 45, 60, 75, 90,
  105, 120, 135, 150, 165, 180,
  195, 210, 225, 240, 255, 270,
];

/**
 * 12 个"节"在 24 节气中的索引（偶数索引）
 * 节：小寒(0)、立春(2)、惊蛰(4)、清明(6)、立夏(8)、芒种(10)、
 *     小暑(12)、立秋(14)、白露(16)、寒露(18)、立冬(20)、大雪(22)
 */
const JIE_INDICES: number[] = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

// ==================== 数学工具 ====================

/** 角度转弧度 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 将角度规范化到 [0, 360) 范围 */
function mod360(deg: number): number {
  let r = deg % 360;
  if (r < 0) r += 360;
  return r;
}

// ==================== 儒略日计算 ====================

/**
 * 将公历日期转换为儒略日数 (JD)
 * 基于 Meeus《Astronomical Algorithms》第 7 章
 */
function dateToJD(date: Date): number {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400 +
    date.getUTCMilliseconds() / 86400000;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    B -
    1524.5
  );
}

/**
 * 将儒略日数 (JD) 转换为 Date 对象 (UTC)
 */
function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;

  let A: number;
  if (z < 2299161) {
    A = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + f;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const dayInt = Math.floor(day);
  const dayFrac = day - dayInt;
  const hours = dayFrac * 24;
  const hourInt = Math.floor(hours);
  const minutes = (hours - hourInt) * 60;
  const minuteInt = Math.floor(minutes);
  const seconds = (minutes - minuteInt) * 60;
  const secondInt = Math.floor(seconds);
  const ms = Math.round((seconds - secondInt) * 1000);

  return new Date(Date.UTC(year, month - 1, dayInt, hourInt, minuteInt, secondInt, ms));
}

// ==================== 高精度太阳黄经计算 ====================

/**
 * 地球日心黄经 VSOP87 简化表 (L0 项)
 * 格式: [振幅A, 相位B, 频率C]
 * L = Σ A * cos(B + C * T)
 */
const EARTH_L0: [number, number, number][] = [
  [175347046, 0, 0],
  [3341656, 4.6692568, 6283.07585],
  [34894, 4.6261, 12566.1517],
  [3497, 2.7441, 5753.3849],
  [3418, 2.8289, 3.5232],
  [3136, 3.6277, 77713.7715],
  [2676, 4.4181, 7860.4194],
  [2343, 6.1352, 3930.2097],
  [1324, 0.7425, 11506.7698],
  [1273, 2.0371, 529.691],
  [1199, 1.1096, 1577.3435],
  [990, 5.233, 5884.927],
  [902, 2.045, 26.298],
  [857, 3.508, 398.149],
  [780, 1.179, 5223.694],
  [753, 2.533, 5507.553],
  [505, 4.583, 18849.228],
  [492, 4.205, 775.523],
  [357, 2.92, 0.067],
  [317, 5.849, 11790.629],
  [284, 1.899, 796.298],
  [271, 0.315, 10977.079],
  [243, 0.345, 5486.778],
  [206, 4.806, 2544.314],
  [205, 1.869, 5573.143],
  [202, 2.458, 6069.777],
  [156, 0.833, 213.299],
  [132, 3.411, 2942.463],
  [126, 1.083, 20.775],
  [115, 0.645, 0.98],
  [103, 0.636, 4694.003],
  [99, 6.21, 2146.17],
  [98, 0.68, 155.42],
  [86, 5.98, 161000.69],
  [85, 1.3, 6275.96],
  [85, 3.67, 71430.7],
  [80, 1.81, 17260.15],
];

/** L1 项 */
const EARTH_L1: [number, number, number][] = [
  [628331966747, 0, 0],
  [206059, 2.678235, 6283.07585],
  [4303, 2.6351, 12566.1517],
  [425, 1.59, 3.523],
  [119, 5.796, 26.298],
  [109, 2.966, 1577.344],
  [93, 2.59, 18849.23],
  [72, 1.14, 529.69],
  [68, 1.87, 398.15],
  [67, 4.41, 5507.55],
  [59, 2.89, 5223.69],
  [56, 2.17, 155.42],
  [45, 0.4, 796.3],
  [36, 0.47, 775.52],
  [29, 2.65, 7.11],
  [21, 5.34, 0.98],
  [19, 1.85, 5486.78],
  [19, 4.97, 213.3],
  [17, 2.99, 6275.96],
  [16, 0.03, 2544.31],
  [16, 1.43, 2146.17],
  [15, 1.21, 10977.08],
  [12, 2.83, 1748.02],
  [12, 3.26, 5088.63],
  [12, 5.27, 1194.45],
  [12, 2.08, 4694],
  [11, 0.77, 553.57],
  [10, 1.3, 6286.6],
  [10, 4.24, 1349.87],
  [9, 2.7, 242.73],
  [9, 5.64, 951.72],
  [8, 5.3, 2352.87],
  [6, 2.65, 9437.76],
  [6, 4.67, 4690.48],
];

/** L2 项 */
const EARTH_L2: [number, number, number][] = [
  [52919, 0, 0],
  [8720, 1.0721, 6283.0758],
  [309, 0.867, 12566.152],
  [27, 0.05, 3.52],
  [16, 5.19, 26.3],
  [16, 3.68, 155.42],
  [10, 0.76, 18849.23],
  [9, 2.06, 77713.77],
  [7, 0.83, 775.52],
  [5, 4.66, 1577.34],
  [4, 1.03, 7.11],
  [4, 3.44, 5573.14],
  [3, 5.14, 796.3],
  [3, 6.05, 5507.55],
  [3, 1.19, 242.73],
  [3, 6.12, 529.69],
  [3, 0.31, 398.15],
  [3, 2.28, 553.57],
  [2, 4.38, 5223.69],
  [2, 3.75, 0.98],
];

/** L3 项 */
const EARTH_L3: [number, number, number][] = [
  [289, 5.844, 6283.076],
  [35, 0, 0],
  [17, 5.49, 12566.15],
  [3, 5.2, 155.42],
  [1, 4.72, 3.52],
  [1, 5.3, 18849.23],
  [1, 5.97, 242.73],
];

/** L4 项 */
const EARTH_L4: [number, number, number][] = [
  [114, 3.142, 0],
  [8, 4.13, 6283.08],
  [1, 3.84, 12566.15],
];

/** L5 项 */
const EARTH_L5: [number, number, number][] = [
  [1, 3.14, 0],
];

/**
 * 计算 VSOP87 级数求和
 */
function vsopSum(terms: [number, number, number][], T: number): number {
  let sum = 0;
  for (const [A, B, C] of terms) {
    sum += A * Math.cos(B + C * T);
  }
  return sum;
}

/**
 * 计算地球日心黄经 (VSOP87 理论)
 * @param T - 儒略千年数（相对于 J2000.0，注意是千年不是世纪）
 * @returns 日心黄经（弧度）
 */
function earthHeliocentricLongitude(tau: number): number {
  const L0 = vsopSum(EARTH_L0, tau);
  const L1 = vsopSum(EARTH_L1, tau);
  const L2 = vsopSum(EARTH_L2, tau);
  const L3 = vsopSum(EARTH_L3, tau);
  const L4 = vsopSum(EARTH_L4, tau);
  const L5 = vsopSum(EARTH_L5, tau);

  // L 单位为 10^-8 弧度
  const L = (L0 + L1 * tau + L2 * tau * tau + L3 * tau ** 3 + L4 * tau ** 4 + L5 * tau ** 5) / 1e8;

  return L;
}

/** 地球日心纬度 B0 项 */
const EARTH_B0: [number, number, number][] = [
  [280, 3.199, 84334.662],
  [102, 5.422, 5507.553],
  [80, 3.88, 5223.69],
  [44, 3.7, 2352.87],
  [32, 4, 1577.34],
];

/** B1 项 */
const EARTH_B1: [number, number, number][] = [
  [9, 3.9, 5507.55],
  [6, 1.73, 5223.69],
];

/**
 * 计算地球日心纬度 (VSOP87 理论)
 */
function earthHeliocentricLatitude(tau: number): number {
  const B0 = vsopSum(EARTH_B0, tau);
  const B1 = vsopSum(EARTH_B1, tau);
  return (B0 + B1 * tau) / 1e8;
}

/** 地球日距 R0 项 */
const EARTH_R0: [number, number, number][] = [
  [100013989, 0, 0],
  [1670700, 3.0984635, 6283.07585],
  [13956, 3.05525, 12566.1517],
  [3084, 5.1985, 77713.7715],
  [1628, 1.1739, 5753.3849],
  [1576, 2.8469, 7860.4194],
  [925, 5.453, 11506.77],
  [542, 4.564, 3930.21],
  [472, 3.661, 5884.927],
  [346, 0.964, 5507.553],
  [329, 5.9, 5223.694],
  [307, 0.299, 5573.143],
  [243, 4.273, 11790.629],
  [212, 5.847, 1577.344],
  [186, 5.022, 10977.079],
  [175, 3.012, 18849.228],
  [110, 5.055, 5486.778],
  [98, 0.89, 6069.78],
  [86, 5.69, 15720.84],
  [86, 1.27, 161000.69],
  [65, 0.27, 17260.15],
  [63, 0.92, 529.69],
  [57, 2.01, 83996.85],
  [56, 5.24, 71430.7],
  [49, 3.25, 2544.31],
  [47, 2.58, 775.52],
  [45, 5.54, 9437.76],
  [43, 6.01, 6275.96],
  [39, 5.36, 4694],
  [38, 2.39, 8827.39],
  [37, 0.83, 19651.05],
  [37, 4.9, 12139.55],
  [36, 1.67, 12036.46],
  [35, 1.84, 2942.46],
  [33, 0.24, 7084.9],
  [32, 0.18, 5088.63],
  [32, 1.78, 398.15],
  [28, 1.21, 6286.6],
  [28, 1.9, 6279.55],
  [26, 4.59, 10447.39],
];

/** R1 项 */
const EARTH_R1: [number, number, number][] = [
  [103019, 1.10749, 6283.07585],
  [1721, 1.0644, 12566.1517],
  [702, 3.142, 0],
  [32, 1.02, 18849.23],
  [31, 2.84, 5507.55],
  [25, 1.32, 5223.69],
  [18, 1.42, 1577.34],
  [10, 5.91, 10977.08],
  [9, 1.42, 6275.96],
  [9, 0.27, 5486.78],
];

/** R2 项 */
const EARTH_R2: [number, number, number][] = [
  [4359, 5.7846, 6283.0758],
  [124, 5.579, 12566.152],
  [12, 3.14, 0],
  [9, 3.63, 77713.77],
  [6, 1.87, 5573.14],
  [3, 5.47, 18849.23],
];

/**
 * 计算地球日距 (VSOP87 理论)
 */
function earthRadius(tau: number): number {
  const R0 = vsopSum(EARTH_R0, tau);
  const R1 = vsopSum(EARTH_R1, tau);
  const R2 = vsopSum(EARTH_R2, tau);
  return (R0 + R1 * tau + R2 * tau * tau) / 1e8;
}

/**
 * 章动计算所需的系数表
 * 格式: [D, M, M', F, Ω, sinψ系数1, sinψ系数2, cosε系数1, cosε系数2]
 * D: 月球平距角, M: 太阳平近点角, M': 月球平近点角, F: 月球纬度参数, Ω: 月球升交点黄经
 */
const NUTATION_TABLE: number[][] = [
  [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
  [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
  [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
  [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
  [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
  [0, 0, 1, 0, 0, 712, 0.1, -7, 0],
  [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
  [0, 0, 0, 2, 1, -386, -0.4, 200, 0],
  [0, 0, 1, 2, 2, -301, 0, 129, -0.1],
  [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
  [-2, 0, 1, 0, 0, -158, 0, 0, 0],
  [-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
  [0, 0, -1, 2, 2, 123, 0, -53, 0],
  [2, 0, 0, 0, 0, 63, 0, 0, 0],
  [0, 0, 1, 0, 1, 63, 0.1, -33, 0],
  [2, 0, -1, 2, 2, -59, 0, 26, 0],
  [0, 0, -1, 0, 1, -58, -0.1, 32, 0],
  [0, 0, 1, 2, 1, -51, 0, 27, 0],
  [-2, 0, 2, 0, 0, 48, 0, 0, 0],
  [0, 0, -2, 2, 1, 46, 0, -24, 0],
  [2, 0, 0, 2, 2, -38, 0, 16, 0],
  [0, 0, 2, 2, 2, -31, 0, 13, 0],
  [0, 0, 2, 0, 0, 29, 0, 0, 0],
  [-2, 0, 1, 2, 2, 29, 0, -12, 0],
  [0, 0, 0, 2, 0, 26, 0, 0, 0],
  [-2, 0, 0, 2, 0, -22, 0, 0, 0],
  [0, 0, -1, 2, 1, 21, 0, -10, 0],
  [0, 2, 0, 0, 0, 17, -0.1, 0, 0],
  [2, 0, -1, 0, 1, 16, 0, -8, 0],
  [-2, 2, 0, 2, 2, -16, 0.1, 7, 0],
  [0, 1, 0, 0, 1, -15, 0, 9, 0],
  [-2, 0, 1, 0, 1, -13, 0, 7, 0],
  [0, -1, 0, 0, 1, -12, 0, 6, 0],
  [0, 0, 2, -2, 0, 11, 0, 0, 0],
  [2, 0, -1, 2, 1, -10, 0, 5, 0],
  [2, 0, 1, 2, 2, -8, 0, 3, 0],
  [0, 1, 0, 2, 2, 7, 0, -3, 0],
  [-2, 1, 1, 0, 0, -7, 0, 0, 0],
  [0, -1, 0, 2, 2, -7, 0, 3, 0],
  [2, 0, 0, 2, 1, -7, 0, 3, 0],
  [2, 0, 1, 0, 0, -8, 0, 0, 0],
  [-2, 0, 2, 2, 2, 6, 0, -3, 0],
  [-2, 0, 1, 2, 1, 6, 0, -3, 0],
  [2, 0, -2, 0, 1, -6, 0, 3, 0],
  [2, 0, 0, 0, 1, -6, 0, 3, 0],
  [0, -1, 1, 0, 0, 5, 0, 0, 0],
  [-2, -1, 0, 2, 1, -5, 0, 3, 0],
  [-2, 0, 0, 0, 1, -5, 0, 3, 0],
  [0, 0, 2, 2, 1, -5, 0, 3, 0],
  [-2, 0, 2, 0, 1, 4, 0, 0, 0],
  [-2, 1, 0, 2, 1, 4, 0, 0, 0],
  [0, 0, 1, -2, 0, 4, 0, 0, 0],
  [-1, 0, 1, 0, 0, -4, 0, 0, 0],
  [-2, 1, 0, 0, 0, -4, 0, 0, 0],
  [1, 0, 0, 0, 0, -4, 0, 0, 0],
  [0, 0, 1, 2, 0, 3, 0, 0, 0],
  [0, 0, -2, 2, 2, -3, 0, 0, 0],
  [-1, -1, 1, 0, 0, -3, 0, 0, 0],
  [0, 1, 1, 0, 0, -3, 0, 0, 0],
  [0, -1, 1, 2, 2, -3, 0, 0, 0],
  [2, -1, -1, 2, 2, -3, 0, 0, 0],
  [0, 0, 3, 2, 2, -3, 0, 0, 0],
  [2, -1, 0, 2, 2, -3, 0, 0, 0],
];

/**
 * 高精度章动计算
 * 基于 Meeus 第 22 章 IAU 1980 章动理论
 * @param T - 儒略世纪数（相对于 J2000.0）
 * @returns [Δψ（角秒）, Δε（角秒）]
 */
function nutationHighPrecision(T: number): [number, number] {
  // 基本参数（度）
  const D = mod360(297.85036 + 445267.11148 * T - 0.0019142 * T * T + T * T * T / 189474);
  const M = mod360(357.52772 + 35999.05034 * T - 0.0001603 * T * T - T * T * T / 300000);
  const Mp = mod360(134.96298 + 477198.867398 * T + 0.0086972 * T * T + T * T * T / 56250);
  const F = mod360(93.27191 + 483202.017538 * T - 0.0036825 * T * T + T * T * T / 327270);
  const omega = mod360(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000);

  let deltaPsi = 0; // 黄经章动（0.0001角秒）
  let deltaEpsilon = 0; // 交角章动（0.0001角秒）

  for (const row of NUTATION_TABLE) {
    const arg = toRad(row[0] * D + row[1] * M + row[2] * Mp + row[3] * F + row[4] * omega);
    deltaPsi += (row[5] + row[6] * T) * Math.sin(arg);
    deltaEpsilon += (row[7] + row[8] * T) * Math.cos(arg);
  }

  // 转换为角秒（表中系数单位为 0.0001 角秒）
  return [deltaPsi / 10000, deltaEpsilon / 10000];
}

/**
 * 计算太阳视黄经（高精度 VSOP87 + 章动 + 光行差）
 * @param jd - 儒略日（力学时 TDT）
 * @returns 太阳视黄经（度）
 */
function sunApparentLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0; // 儒略世纪
  const tau = T / 10; // 儒略千年

  // 地球日心黄经（弧度）
  let L = earthHeliocentricLongitude(tau);
  // 地球日心纬度（弧度）
  const B = earthHeliocentricLatitude(tau);
  // 地球日距（AU）
  const R = earthRadius(tau);

  // 转换为太阳地心黄经（加 180°）
  let theta = L * 180 / Math.PI + 180;
  theta = mod360(theta);

  // 地心纬度（本模块仅需黄经，纬度保留供未来扩展）
  void (-B * 180 / Math.PI);

  // FK5 修正
  const Lp = theta - 1.397 * T - 0.00031 * T * T;
  const deltaTheta = -0.09033 / 3600;
  // deltaBeta 用于纬度修正，本模块仅需黄经
  void ((0.03916 / 3600) * (Math.cos(toRad(Lp)) - Math.sin(toRad(Lp))));

  theta += deltaTheta;

  // 光行差修正（约 -20.4898″/R）
  const aberration = -20.4898 / 3600 / R;

  // 章动修正
  const [deltaPsi] = nutationHighPrecision(T);

  // 太阳视黄经 = 地心黄经 + 章动 + 光行差
  let apparent = theta + deltaPsi / 3600 + aberration;
  apparent = mod360(apparent);

  return apparent;
}

// ==================== ΔT 计算 ====================

/**
 * 计算 ΔT（力学时与世界时之差），单位：秒
 * 基于多项式近似（NASA / Meeus）
 * @param year - 年份（含小数）
 */
function deltaT(year: number): number {
  const t = year - 2000;

  if (year < 1900) {
    const u = (year - 1820) / 100;
    return -20 + 32 * u * u;
  } else if (year < 1920) {
    const t1 = year - 1900;
    return 3.21 + 0.5547 * t1 - 0.0748 * t1 * t1;
  } else if (year < 1941) {
    const t1 = year - 1920;
    return 24.02 + 1.3066 * t1 - 0.0598 * t1 * t1;
  } else if (year < 1961) {
    const t1 = year - 1950;
    return 29.07 + 0.407 * t1 - t1 * t1 / 233 + t1 * t1 * t1 / 2547;
  } else if (year < 1986) {
    const t1 = year - 1975;
    return 45.45 + 1.067 * t1 - t1 * t1 / 260 - t1 * t1 * t1 / 718;
  } else if (year < 2005) {
    const t1 = year - 2000;
    return (
      63.86 +
      0.3345 * t1 -
      0.060374 * t1 * t1 +
      0.0017275 * t1 * t1 * t1 +
      0.000651814 * t1 * t1 * t1 * t1 +
      0.00002373599 * t1 * t1 * t1 * t1 * t1
    );
  } else if (year < 2050) {
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  } else if (year < 2150) {
    return -20 + 32 * ((year - 1820) / 100) ** 2 - 0.5628 * (2150 - year);
  } else {
    const u = (year - 1820) / 100;
    return -20 + 32 * u * u;
  }
}

// ==================== 核心求解函数 ====================

/**
 * 估算某年某节气的近似儒略日（力学时）
 * 用于牛顿迭代的初始值
 */
function estimateSolarTermJDE(year: number, termIndex: number): number {
  // 使用 JDE 近似公式
  // 小寒大约在 1 月 5-7 日
  const k = year + (termIndex * 15.2184 + 3) / 365.25;
  // 简单估算：以春分为基准
  // JDE0 备用：const JDE0 = 2451259.428 + 365.242189623 * (k - 2000);
  void k; // 保留 k 的计算用于未来精度优化

  // 更精确的初始估算
  const baseJD = dateToJD(new Date(Date.UTC(year, 0, 1, 0, 0, 0)));
  const daysPerTerm = 365.25 / 24;
  return baseJD + 5 + termIndex * daysPerTerm;
}

/**
 * 使用牛顿迭代法求解太阳视黄经等于目标角度的时刻
 * @param targetLon - 目标太阳黄经（度）
 * @param jd0 - 初始估算的儒略日
 * @returns 精确的儒略日（力学时 TDT）
 */
function findSolarTermJDE(targetLon: number, jd0: number): number {
  let jd = jd0;

  for (let i = 0; i < 50; i++) {
    const lon = sunApparentLongitude(jd);

    // 计算差值，处理 0°/360° 跨越
    let diff = targetLon - lon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    // 收敛判断：差值小于 0.00001°（约 0.86 秒精度）
    if (Math.abs(diff) < 0.00001) {
      break;
    }

    // 太阳每天移动约 360/365.25 ≈ 0.9856°
    jd += diff / 360 * 365.25;
  }

  return jd;
}

// ==================== 导出函数 ====================

/**
 * 计算指定年份指定节气的精确时刻
 *
 * @param year - 年份（1900-2100）
 * @param termIndex - 节气序号 0-23
 *   0=小寒, 1=大寒, 2=立春, 3=雨水, 4=惊蛰, 5=春分,
 *   6=清明, 7=谷雨, 8=立夏, 9=小满, 10=芒种, 11=夏至,
 *   12=小暑, 13=大暑, 14=立秋, 15=处暑, 16=白露, 17=秋分,
 *   18=寒露, 19=霜降, 20=立冬, 21=小雪, 22=大雪, 23=冬至
 * @returns 节气精确时刻（北京时间，存储为 UTC 偏移后的 Date）
 */
export function getSolarTermMoment(year: number, termIndex: number): Date {
  if (termIndex < 0 || termIndex > 23) {
    throw new Error(`无效的节气序号: ${termIndex}，应为 0-23`);
  }

  const targetLon = SOLAR_TERM_LONGITUDES[termIndex];

  // 估算初始儒略日
  const jd0 = estimateSolarTermJDE(year, termIndex);

  // 牛顿迭代求解精确时刻（力学时 TDT/JDE）
  const jde = findSolarTermJDE(targetLon, jd0);

  // 将力学时转换为世界时（JD = JDE - ΔT）
  const yearFrac = year + (termIndex * 15.22) / 365.25;
  const dt = deltaT(yearFrac);
  const jd = jde - dt / 86400;

  // 转换为 UTC Date
  const utcDate = jdToDate(jd);

  // 转换为北京时间（UTC+8）
  const beijingDate = new Date(utcDate.getTime() + 8 * 3600 * 1000);

  return beijingDate;
}

/**
 * 返回指定年份的全部 24 个节气
 *
 * @param year - 年份（1900-2100）
 * @returns 24 个节气数组，按时间顺序排列
 */
export function getAllSolarTerms(year: number): SolarTerm[] {
  const terms: SolarTerm[] = [];

  for (let i = 0; i < 24; i++) {
    const moment = getSolarTermMoment(year, i);
    terms.push({
      name: SOLAR_TERM_NAMES[i],
      index: i,
      moment,
      longitude: SOLAR_TERM_LONGITUDES[i],
    });
  }

  // 按时间排序
  terms.sort((a, b) => a.moment.getTime() - b.moment.getTime());

  return terms;
}

/**
 * 查找给定日期前后最近的"节"（不是"气"）
 *
 * 12 个"节"：小寒、立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪
 * 12 个"气"：大寒、雨水、春分、谷雨、小满、夏至、大暑、处暑、秋分、霜降、小雪、冬至
 *
 * @param date - 给定日期
 * @returns 前一个"节"和后一个"节"
 */
export function findPrevNextJieQi(date: Date): { prev: SolarTerm; next: SolarTerm } {
  const year = date.getFullYear();
  const timestamp = date.getTime();

  // 收集前一年、当年、后一年的所有"节"
  const allJie: SolarTerm[] = [];
  for (let y = year - 1; y <= year + 1; y++) {
    const terms = getAllSolarTerms(y);
    for (const term of terms) {
      if (JIE_INDICES.includes(term.index)) {
        allJie.push(term);
      }
    }
  }

  // 按时间排序
  allJie.sort((a, b) => a.moment.getTime() - b.moment.getTime());

  // 查找前后最近的"节"
  let prev: SolarTerm | null = null;
  let next: SolarTerm | null = null;

  for (let i = 0; i < allJie.length; i++) {
    if (allJie[i].moment.getTime() <= timestamp) {
      prev = allJie[i];
    } else {
      next = allJie[i];
      break;
    }
  }

  if (!prev || !next) {
    throw new Error('无法找到前后节气，日期可能超出支持范围');
  }

  return { prev, next };
}

/**
 * 判断节气序号是否为"节"（而非"气"）
 * @param termIndex - 节气序号 0-23
 * @returns 是否为"节"
 */
export function isJie(termIndex: number): boolean {
  return JIE_INDICES.includes(termIndex);
}

/** 导出节气名称数组供外部使用 */
export { SOLAR_TERM_NAMES, SOLAR_TERM_LONGITUDES, JIE_INDICES };
