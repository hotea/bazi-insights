// ============================================================
// 八字排盘系统 — 核心类型定义
// ============================================================

// -------------------- 基础类型 --------------------

/** 天干 */
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 地支 */
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 五行 */
export type WuXing = '金' | '木' | '水' | '火' | '土';

/** 十神 */
export type TenGod = '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财' | '偏官' | '正官' | '偏印' | '正印';

/** 性别 */
export type Gender = 'male' | 'female';

/** 语言 */
export type Locale = 'zh' | 'en';

/** 主题 */
export type Theme = 'light' | 'dark';

// -------------------- 核心数据结构 --------------------

/** 干支柱 */
export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

/** 藏干 */
export interface HiddenStem {
  stem: HeavenlyStem;
  /** 本气 | 中气 | 余气 */
  type: 'main' | 'middle' | 'residual';
  /** 权重（用于五行力量计算） */
  weight: number;
}

/** 节气 */
export interface SolarTerm {
  name: string;
  /** 节气序号 0-23 */
  index: number;
  /** 精确时刻 */
  moment: Date;
  /** 太阳黄经度数 */
  longitude: number;
}

/** 农历日期 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

/** 真太阳时计算结果 */
export interface TrueSolarTimeResult {
  originalTime: Date;
  trueSolarTime: Date;
  /** 经度时差（分钟） */
  longitudeDiff: number;
  /** EoT 修正值（分钟） */
  eotCorrection: number;
}

/** 四柱 */
export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

/** 纳音结果 */
export interface NaYinResult {
  /** 如 "海中金" */
  name: string;
  /** 对应五行 */
  wuxing: WuXing;
}

/** 神煞结果 */
export interface ShenShaResult {
  /** 神煞名称 */
  name: string;
  pillarPosition: 'year' | 'month' | 'day' | 'hour';
  description: string;
}

/** 地支关系 */
export interface BranchRelation {
  type: 'sixCombine' | 'threeHarmony' | 'threeAssembly' | 'sixClash' | 'sixHarm' | 'threePunish' | 'destruction';
  branches: EarthlyBranch[];
  positions: ('year' | 'month' | 'day' | 'hour')[];
  description: string;
}

/** 天干关系 */
export interface StemRelation {
  type: 'fiveCombine' | 'clash';
  stems: HeavenlyStem[];
  positions: ('year' | 'month' | 'day' | 'hour')[];
}

/** 大运步 */
export interface DaYunStep {
  pillar: Pillar;
  startAge: number;
  endAge: number;
}

/** 大运起运年龄 */
export interface DaYunStartAge {
  years: number;
  months: number;
  days: number;
}

/** 流年条目 */
export interface LiuNianEntry {
  year: number;
  pillar: Pillar;
}

/** 五行计数 */
export interface WuXingCount {
  /** 金 */
  metal: number;
  /** 木 */
  wood: number;
  /** 水 */
  water: number;
  /** 火 */
  fire: number;
  /** 土 */
  earth: number;
}

/** 五行力量评分 */
export interface WuXingScore {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
  total: number;
}

/** 五行权重配置 */
export interface WuXingWeights {
  /** 天干权重，如 1.0 */
  heavenlyStem: number;
  /** 本气权重，如 0.7 */
  mainQi: number;
  /** 中气权重，如 0.3 */
  middleQi: number;
  /** 余气权重，如 0.1 */
  residualQi: number;
}

/** 日主旺衰 */
export interface DayMasterStrength {
  status: 'strong' | 'weak' | 'neutral';
  score: number;
  analysis: string;
}

// -------------------- 输入/输出数据结构 --------------------

/** 用户输入 */
export interface BaZiInput {
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  /** 仅农历模式 */
  isLeapMonth?: boolean;
  hour: number;
  minute: number;
  timeType: 'standard' | 'trueSolar';
  gender: Gender;
  longitude: number;
  cityCode?: string;
  /** 夏令时确认 */
  dstConfirmed?: boolean;
  /** 早子时/晚子时分属不同日柱 */
  earlyRatSplit: boolean;
}

/** 排盘完整结果 */
export interface BaZiResult {
  input: BaZiInput;
  calendarData: {
    solarDate: Date;
    lunarDate: LunarDate;
    trueSolarTime: TrueSolarTimeResult;
    relevantSolarTerms: SolarTerm[];
  };
  fourPillars: FourPillars;
  hiddenStems: Record<'year' | 'month' | 'day' | 'hour', HiddenStem[]>;
  /** key: 位置标识 */
  tenGods: Record<string, TenGod>;
  naYin: Record<'year' | 'month' | 'day' | 'hour', NaYinResult>;
  shenSha: ShenShaResult[];
  branchRelations: BranchRelation[];
  stemRelations: StemRelation[];
  luck: {
    direction: 'forward' | 'backward';
    startAge: DaYunStartAge;
    daYun: DaYunStep[];
    currentLiuNian: LiuNianEntry[];
  };
  palaces: {
    /** 命宫 */
    mingGong: Pillar;
    /** 胎元 */
    taiYuan: Pillar;
    /** 身宫 */
    shenGong: Pillar;
  };
  wuxing: {
    count: WuXingCount;
    score: WuXingScore;
    dayMasterStrength: DayMasterStrength;
  };
}

/** 历史记录 */
export interface BaZiRecord {
  id: string;
  timestamp: number;
  input: BaZiInput;
  result: BaZiResult;
  label?: string;
}

/** 用户偏好 */
export interface UserPreferences {
  theme: Theme;
  locale: Locale;
  earlyRatSplit: boolean;
  defaultCityCode?: string;
  defaultLongitude?: number;
}

/** 导出数据 */
export interface ExportData {
  version: string;
  exportTime: number;
  records: BaZiRecord[];
  preferences: UserPreferences;
}

/** 导入结果 */
export interface ImportResult {
  success: boolean;
  error?: string;
  recordCount?: number;
}

// -------------------- 静态数据表结构 --------------------

/** 城市数据 */
export interface CityData {
  code: string;
  province: string;
  city: string;
  district?: string;
  longitude: number;
  latitude: number;
}

/** 夏令时时刻表条目 */
export interface DSTEntry {
  year: number;
  /** 夏令时开始时刻 */
  start: Date;
  /** 夏令时结束时刻 */
  end: Date;
}

/** 纳音表（60甲子 → 纳音名称） */
export type NaYinTable = Record<string, NaYinResult>;

/** 藏干表 */
export type HiddenStemsTable = Record<EarthlyBranch, HiddenStem[]>;

/** 术语解释 */
export interface GlossaryEntry {
  key: string;
  zh: string;
  en: string;
  description_zh: string;
  description_en: string;
}
