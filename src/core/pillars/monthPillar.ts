/**
 * 月柱推算模块
 *
 * 根据真太阳时、年干和节气数据推算月柱干支。
 *
 * 算法：
 *   1. 月柱地支以 12 个"节"（偶数索引节气）的精确时刻为分界点
 *   2. 月柱天干根据五虎遁月口诀由年干推算
 *
 * 12 个"节"与月支对应关系：
 *   立春(2)→寅, 惊蛰(4)→卯, 清明(6)→辰, 立夏(8)→巳,
 *   芒种(10)→午, 小暑(12)→未, 立秋(14)→申, 白露(16)→酉,
 *   寒露(18)→戌, 立冬(20)→亥, 大雪(22)→子, 小寒(0)→丑
 *
 * 五虎遁月口诀：
 *   甲己之年丙作首 → 寅月起丙寅（天干偏移 2）
 *   乙庚之年戊为头 → 寅月起戊寅（天干偏移 4）
 *   丙辛之岁寻庚上 → 寅月起庚寅（天干偏移 6）
 *   丁壬壬寅顺水流 → 寅月起壬寅（天干偏移 8）
 *   若问戊癸何处觅 → 寅月起甲寅（天干偏移 0）
 */

import type { HeavenlyStem, EarthlyBranch, Pillar, SolarTerm } from '../../types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './yearPillar';

// ==================== 常量定义 ====================

/**
 * "节"的索引到月支的映射
 * 月支顺序从寅月开始：寅卯辰巳午未申酉戌亥子丑
 * 对应"节"索引：2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0
 */
const JIE_TO_MONTH_BRANCH: Record<number, EarthlyBranch> = {
  2: '寅',   // 立春 → 寅月
  4: '卯',   // 惊蛰 → 卯月
  6: '辰',   // 清明 → 辰月
  8: '巳',   // 立夏 → 巳月
  10: '午',  // 芒种 → 午月
  12: '未',  // 小暑 → 未月
  14: '申',  // 立秋 → 申月
  16: '酉',  // 白露 → 酉月
  18: '戌',  // 寒露 → 戌月
  20: '亥',  // 立冬 → 亥月
  22: '子',  // 大雪 → 子月
  0: '丑',   // 小寒 → 丑月
};

/**
 * 月支顺序（从寅月开始，共 12 个月）
 * 用于计算月干偏移
 */
const MONTH_BRANCHES: EarthlyBranch[] = [
  '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑',
];

/**
 * 五虎遁月口诀：年干 → 寅月天干在 HEAVENLY_STEMS 中的索引偏移
 * 甲/己 → 丙(2), 乙/庚 → 戊(4), 丙/辛 → 庚(6), 丁/壬 → 壬(8), 戊/癸 → 甲(0)
 */
const YEAR_STEM_TO_MONTH_START: Record<HeavenlyStem, number> = {
  '甲': 2, '己': 2,
  '乙': 4, '庚': 4,
  '丙': 6, '辛': 6,
  '丁': 8, '壬': 8,
  '戊': 0, '癸': 0,
};

/**
 * "节"的索引数组（偶数索引），按月支顺序排列
 * 从寅月(立春)开始到丑月(小寒)
 */
const JIE_INDICES_ORDERED: number[] = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0];

// ==================== 核心函数 ====================

/**
 * 从节气数组中提取所有"节"（偶数索引节气），按时间排序
 *
 * @param solarTerms - 节气数组（应包含出生年份及相邻年份的节气数据）
 * @returns 按时间排序的"节"数组
 */
function extractJieTerms(solarTerms: SolarTerm[]): SolarTerm[] {
  return solarTerms
    .filter((term) => term.index % 2 === 0)
    .sort((a, b) => a.moment.getTime() - b.moment.getTime());
}

/**
 * 根据真太阳时确定当前所处的月支
 *
 * 遍历所有"节"，找到最后一个时刻 <= 出生时间的"节"，
 * 该"节"对应的月支即为当前月支。
 *
 * @param trueSolarTime - 真太阳时
 * @param jieTerms - 按时间排序的"节"数组
 * @returns 当前月支和对应的月偏移量（从寅月=0开始）
 */
function determineMonthBranch(
  trueSolarTime: Date,
  jieTerms: SolarTerm[],
): { branch: EarthlyBranch; monthOffset: number } {
  const timestamp = trueSolarTime.getTime();

  // 从后往前找到最后一个 <= 出生时间的"节"
  let currentJie: SolarTerm | null = null;
  for (let i = jieTerms.length - 1; i >= 0; i--) {
    if (jieTerms[i].moment.getTime() <= timestamp) {
      currentJie = jieTerms[i];
      break;
    }
  }

  if (!currentJie) {
    throw new Error('无法确定月支，请确保节气数据覆盖出生时间前后');
  }

  const branch = JIE_TO_MONTH_BRANCH[currentJie.index];
  if (!branch) {
    throw new Error(`无效的节气索引: ${currentJie.index}，不是"节"`);
  }

  // 计算月偏移量（寅=0, 卯=1, ..., 丑=11）
  const monthOffset = MONTH_BRANCHES.indexOf(branch);

  return { branch, monthOffset };
}

/**
 * 根据五虎遁月口诀计算月柱天干
 *
 * @param yearStem - 年干
 * @param monthOffset - 月偏移量（寅月=0, 卯月=1, ..., 丑月=11）
 * @returns 月柱天干
 */
function calculateMonthStem(yearStem: HeavenlyStem, monthOffset: number): HeavenlyStem {
  const startStemIndex = YEAR_STEM_TO_MONTH_START[yearStem];
  const stemIndex = (startStemIndex + monthOffset) % 10;
  return HEAVENLY_STEMS[stemIndex];
}

// ==================== 导出函数 ====================

/**
 * 推算月柱
 *
 * 以 12 个"节"的精确时刻为月柱地支分界点，
 * 根据五虎遁月口诀由年干推算月柱天干。
 *
 * 当出生时间恰好在节气交接时刻时，月柱设为新月份的干支（Requirements 12.3）。
 *
 * @param trueSolarTime - 真太阳时（Date 对象，UTC 存储北京时间值）
 * @param yearStem - 年干（由年柱推算得出）
 * @param solarTerms - 节气数组（应包含出生年份及相邻年份的节气数据）
 * @returns 月柱（天干 + 地支）
 */
export function calculateMonthPillar(
  trueSolarTime: Date,
  yearStem: HeavenlyStem,
  solarTerms: SolarTerm[],
): Pillar {
  // 提取所有"节"并按时间排序
  const jieTerms = extractJieTerms(solarTerms);

  if (jieTerms.length === 0) {
    throw new Error('节气数据中未找到任何"节"，请确保 solarTerms 包含有效数据');
  }

  // 确定月支和月偏移
  const { branch, monthOffset } = determineMonthBranch(trueSolarTime, jieTerms);

  // 根据五虎遁月口诀计算月干
  const stem = calculateMonthStem(yearStem, monthOffset);

  return { stem, branch };
}

// 导出辅助函数供测试使用
export {
  extractJieTerms,
  determineMonthBranch,
  calculateMonthStem,
  YEAR_STEM_TO_MONTH_START,
  MONTH_BRANCHES,
  JIE_TO_MONTH_BRANCH,
};
