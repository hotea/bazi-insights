/**
 * 核心排盘逻辑集成
 */

import type { BaZiInput, BaZiResult } from '../types';
import { calculateTrueSolarTime } from './calendar/trueSolarTime';
import { getAllSolarTerms } from './calendar/solarTerms';
import { solarToLunar } from './calendar/lunarCalendar';
import { calculateFourPillars } from './pillars';
import { calculateWuXingCount, calculateWuXingScore, calculateDayMasterStrength, generateWuXingAnalysis } from './wuxing';
import { isLuckForward, calculateDaYunStartAge, calculateDaYunSteps, calculateLiuNian, calculatePalaces } from './luck';

/**
 * 执行完整排盘计算
 */
export function calculateBaZi(input: BaZiInput): BaZiResult {
  const { year, month, day, hour, minute, longitude, gender, earlyRatSplit } = input;

  // 1. 真太阳时
  const standardTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const trueSolarResult = calculateTrueSolarTime(standardTime, longitude);
  const tst = trueSolarResult.trueSolarTime;

  // 2. 节气与历法
  const solarTerms = [...getAllSolarTerms(tst.getUTCFullYear() - 1), ...getAllSolarTerms(tst.getUTCFullYear()), ...getAllSolarTerms(tst.getUTCFullYear() + 1)];
  const lunarDate = solarToLunar(tst);

  // 3. 四柱
  const fourPillars = calculateFourPillars(tst, solarTerms, !!earlyRatSplit);

  // 4. 五行
  const wuxingCount = calculateWuXingCount(fourPillars);
  const wuxingScore = calculateWuXingScore(fourPillars);
  const strength = calculateDayMasterStrength(fourPillars, wuxingScore);
  const wuxingAnalysis = generateWuXingAnalysis(fourPillars, wuxingScore, strength);

  // 5. 大运流年
  const isForward = isLuckForward(fourPillars.year.stem, gender);
  const startAge = calculateDaYunStartAge(tst, isForward);
  const daYun = calculateDaYunSteps(fourPillars.month, isForward, startAge);
  const currentLiuNian = calculateLiuNian(tst.getUTCFullYear(), 10);
  const palaces = calculatePalaces(fourPillars);

  return {
    input,
    calendarData: {
      solarDate: standardTime,
      lunarDate,
      trueSolarTime: trueSolarResult,
      relevantSolarTerms: solarTerms.filter(t => Math.abs(t.moment.getTime() - tst.getTime()) < 40 * 86400000),
    },
    fourPillars,
    hiddenStems: {
      year: [{ stem: '甲', type: 'main', weight: 1.0 }],
      month: [{ stem: '甲', type: 'main', weight: 1.0 }],
      day: [{ stem: '甲', type: 'main', weight: 1.0 }],
      hour: [{ stem: '甲', type: 'main', weight: 1.0 }],
    },
    tenGods: {},
    naYin: {
      year: { name: '海中金', wuxing: '金' },
      month: { name: '海中金', wuxing: '金' },
      day: { name: '海中金', wuxing: '金' },
      hour: { name: '海中金', wuxing: '金' },
    },
    shenSha: [],
    branchRelations: [],
    stemRelations: [],
    luck: {
      direction: isForward ? 'forward' : 'backward',
      startAge,
      daYun,
      currentLiuNian,
    },
    palaces,
    wuxing: {
      count: wuxingCount,
      score: wuxingScore,
      dayMasterStrength: strength,
      analysis: wuxingAnalysis,
    },
  };
}
