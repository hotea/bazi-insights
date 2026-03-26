/**
 * 五行力量分析模块
 *
 * 计算八字中五行的分布计数和力量评分。
 */

import type { WuXing, HeavenlyStem, EarthlyBranch, FourPillars, WuXingCount, WuXingScore, DayMasterStrength, Pillar, WuXingAnalysis } from '../../types';

/**
 * 干支到五行的映射
 */
export const STEM_TO_WUXING: Record<HeavenlyStem, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

export const BRANCH_TO_WUXING: Record<EarthlyBranch, WuXing> = {
  '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土',
  '亥': '水', '子': '水', '丑': '土',
};

/**
 * 五行生克关系
 */
const WUXING_RELATIONS = {
  '木': { producing: '火', controlling: '土', producedBy: '水', controlledBy: '金' },
  '火': { producing: '土', controlling: '金', producedBy: '木', controlledBy: '水' },
  '土': { producing: '金', controlling: '水', producedBy: '火', controlledBy: '木' },
  '金': { producing: '水', controlling: '木', producedBy: '土', controlledBy: '火' },
  '水': { producing: '木', controlling: '火', producedBy: '金', controlledBy: '土' },
} as const;

/**
 * 转换五行键名为输出格式
 */
function getWuXingKey(wuxing: WuXing): keyof WuXingCount {
  const map: Record<WuXing, keyof WuXingCount> = {
    '金': 'metal',
    '木': 'wood',
    '水': 'water',
    '火': 'fire',
    '土': 'earth',
  };
  return map[wuxing];
}

/**
 * 计算五行计数（简单统计八字中的五行出现次数）
 */
export function calculateWuXingCount(fourPillars: FourPillars): WuXingCount {
  const count: WuXingCount = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
  const pillars: Pillar[] = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  for (const pillar of pillars) {
    count[getWuXingKey(STEM_TO_WUXING[pillar.stem])]++;
    count[getWuXingKey(BRANCH_TO_WUXING[pillar.branch])]++;
  }

  return count;
}

/**
 * 计算五行力量评分
 * 简单的启发式算法：天干计 1.2 分，地支计 1.0 分，月令地支计 2.0 分（权重增强）
 */
export function calculateWuXingScore(fourPillars: FourPillars): WuXingScore {
  const score: WuXingScore = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, total: 0 };

  // 天干权重
  const stems: HeavenlyStem[] = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.day.stem, fourPillars.hour.stem];
  for (const stem of stems) {
    const s = 1.2;
    score[getWuXingKey(STEM_TO_WUXING[stem])] += s;
    score.total += s;
  }

  // 地支权重
  const branches: EarthlyBranch[] = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  for (let i = 0; i < branches.length; i++) {
    // 月令（index 1）权重增强
    const s = i === 1 ? 2.0 : 1.0;
    score[getWuXingKey(BRANCH_TO_WUXING[branches[i]])] += s;
    score.total += s;
  }

  return score;
}

/**
 * 判断日主旺衰
 */
export function calculateDayMasterStrength(
  fourPillars: FourPillars,
  score: WuXingScore
): DayMasterStrength {
  const dayStem = fourPillars.day.stem;
  const dayWuXing = STEM_TO_WUXING[dayStem];

  // 同类：比劫 (Self) + 印枭 (Resource)
  const resourceWuXing = WUXING_RELATIONS[dayWuXing].producedBy;

  const selfScore = score[getWuXingKey(dayWuXing)];
  const resourceScore = score[getWuXingKey(resourceWuXing)];

  const supportiveScore = selfScore + resourceScore;
  const percentage = (supportiveScore / score.total) * 100;

  let status: 'strong' | 'weak' | 'neutral' = 'neutral';
  if (percentage > 45) status = 'strong';
  else if (percentage < 35) status = 'weak';

  return {
    status,
    score: Math.round(percentage),
    analysis: `日主为${dayStem}${dayWuXing}。同类力量（日主及印星）占比约 ${Math.round(percentage)}%，${
      status === 'strong' ? '全局得令得助，力量较强' :
      status === 'weak' ? '全局克泄较多，力量较弱' :
      '力量适中，趋于平衡'
    }。`,
  };
}

/**
 * 生成五行深度解读
 */
export function generateWuXingAnalysis(
  fourPillars: FourPillars,
  score: WuXingScore,
  strength: DayMasterStrength
): WuXingAnalysis {
  const wuxings: WuXing[] = ['木', '火', '土', '金', '水'];
  const details: Partial<WuXingAnalysis['details']> = {};

  const meanings = {
    '木': {
      personality: '仁慈、正直、有上进心',
      excessive: '固执、容易冲动',
      deficient: '意志薄弱、缺乏决断力',
      health: '注意肝胆、视力健康'
    },
    '火': {
      personality: '热情、爽朗、尊礼守道',
      excessive: '性急、易怒、做事不持久',
      deficient: '缺乏活力、意志消沉',
      health: '注意心脏、血液、眼目健康'
    },
    '土': {
      personality: '诚信、稳重、宽厚包容',
      excessive: '固执偏激、反应较慢',
      deficient: '言行不一、缺乏信用',
      health: '注意脾胃、消化系统健康'
    },
    '金': {
      personality: '刚毅、果断、为人义气',
      excessive: '好勇斗狠、刚愎自用',
      deficient: '优柔寡断、缺乏进取心',
      health: '注意肺部、呼吸系统、大肠健康'
    },
    '水': {
      personality: '聪明、灵活、学识过人',
      excessive: '随波逐流、阴晴不定',
      deficient: '胆小怕事、反应迟钝',
      health: '注意肾脏、膀胱、泌尿系统健康'
    },
  };

  wuxings.forEach(wx => {
    const s = score[getWuXingKey(wx)];
    const p = (s / score.total) * 100;

    let status = '中和';
    let personality = meanings[wx].personality;

    if (p > 35) {
      status = '过旺';
      personality += '。且' + meanings[wx].excessive;
    } else if (p > 25) {
      status = '强';
    } else if (p < 10) {
      status = '极弱';
      personality = meanings[wx].deficient;
    } else if (p < 15) {
      status = '弱';
      personality = meanings[wx].deficient;
    }

    details[wx] = {
      status,
      personality,
      health: meanings[wx].health,
    };
  });

  const dayWuXing = STEM_TO_WUXING[fourPillars.day.stem];
  const relations = WUXING_RELATIONS[dayWuXing];

  let favorableElements = '';
  let unfavorableElements = '';

  if (strength.status === 'strong') {
    favorableElements = `${relations.controlling}（财）、${relations.producing}（食伤）、${WUXING_RELATIONS[dayWuXing].controlledBy}（官杀）`;
    unfavorableElements = `${dayWuXing}（比劫）、${relations.producedBy}（印星）`;
  } else if (strength.status === 'weak') {
    favorableElements = `${dayWuXing}（比劫）、${relations.producedBy}（印星）`;
    unfavorableElements = `${relations.controlling}（财）、${relations.producing}（食伤）、${WUXING_RELATIONS[dayWuXing].controlledBy}（官杀）`;
  } else {
    favorableElements = '五行趋于中和，需结合流年大运微调';
    unfavorableElements = '忌讳五行极端失衡';
  }

  return {
    overview: `本命局五行以${wuxings.sort((a, b) => score[getWuXingKey(b)] - score[getWuXingKey(a)])[0]}气最盛。${strength.analysis}`,
    details: details as WuXingAnalysis['details'],
    favorableElements,
    unfavorableElements,
  };
}
