# Implementation Plan: 八字排盘系统 (BaZi Calculator)

## Overview

基于 React 18 + TypeScript + Vite + Tailwind CSS 构建纯前端八字排盘系统。按照"基础设施 → 核心计算引擎 → 静态数据表 → UI 组件 → 国际化 → 数据存储与分享 → 部署"的顺序增量实现，每个阶段结束后进行检查点验证。

## Tasks

- [x] 1. 项目初始化与基础设施
  - [x] 1.1 初始化 Vite + React 18 + TypeScript 项目
    - 使用 `npm create vite@latest` 创建项目，选择 react-ts 模板
    - 在 tsconfig.json 中启用 `strict: true`
    - 安装 Tailwind CSS 并配置 `tailwind.config.ts` 和 `postcss.config.js`
    - 安装 Zustand 状态管理库
    - 安装 Vitest 和 fast-check 测试框架
    - _Requirements: 38.1, 38.2, 39.1_

  - [x] 1.2 创建 TypeScript 类型定义文件
    - 在 `src/types/index.ts` 中定义所有核心类型：HeavenlyStem、EarthlyBranch、WuXing、TenGod、Gender、Locale、Theme
    - 定义核心数据结构：Pillar、HiddenStem、SolarTerm、LunarDate、TrueSolarTimeResult、FourPillars
    - 定义纳音、神煞、干支关系、大运、流年、五行相关接口
    - 定义输入/输出数据结构：BaZiInput、BaZiResult、BaZiRecord、UserPreferences、ExportData、ImportResult
    - 定义静态数据表结构：CityData、DSTEntry、NaYinTable、HiddenStemsTable、GlossaryEntry
    - _Requirements: 38.1, 38.2_

  - [x] 1.3 创建目录结构
    - 按照设计文档创建 `src/core/calendar/`、`src/core/pillars/`、`src/core/luck/`、`src/core/wuxing/` 目录
    - 创建 `src/data/`、`src/i18n/`、`src/store/`、`src/utils/`、`src/components/` 目录
    - _Requirements: 38.1_

- [ ] 2. 核心计算引擎 — 历法转换
  - [x] 2.1 实现节气计算模块 `src/core/calendar/solarTerms.ts`
    - 实现 `getSolarTermMoment(year, termIndex)` 函数，基于天文算法计算节气精确时刻
    - 实现 `getAllSolarTerms(year)` 返回一年 24 个节气
    - 实现 `findPrevNextJieQi(date)` 查找前后节气
    - 节气精度控制在 1 分钟以内
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.2 编写节气计算属性测试
    - **Property 6: 节气覆盖完整性** — 验证 1900-2100 年每年返回恰好 24 个节气且精确到秒
    - **Validates: Requirements 7.2, 7.4**

  - [x] 2.3 实现真太阳时计算模块 `src/core/calendar/trueSolarTime.ts`
    - 实现 `calculateEoT(dayOfYear)` 计算时差方程修正值
    - 实现 `calculateTrueSolarTime(standardTime, longitude)` 计算真太阳时
    - 公式：trueSolarTime = standardTime + (longitude - 120) × 4分钟 + EoT
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 2.4 编写真太阳时属性测试
    - **Property 5: 真太阳时计算正确性** — 验证计算公式和结果对象完整性
    - **Validates: Requirements 2.3, 8.1, 8.2, 8.3, 8.4**

  - [x] 2.5 实现夏令时处理模块 `src/core/calendar/dst.ts`
    - 实现 `isDSTActive(date)` 判断是否处于夏令时生效期间
    - 实现 `applyDSTCorrection(date, userConfirmedDST)` 修正夏令时
    - 内置 1986-1991 年精确起止时刻表
    - _Requirements: 5.1, 5.3, 10.1, 10.2_

  - [ ]* 2.6 编写夏令时属性测试
    - **Property 4: 夏令时检测与修正** — 验证 1986-1991 年间夏令时判断和修正逻辑
    - **Validates: Requirements 5.1, 5.3, 10.2**

  - [x] 2.7 实现农历转换模块 `src/core/calendar/lunarCalendar.ts`
    - 实现 `solarToLunar(date)` 公历转农历
    - 实现 `lunarToSolar(lunarDate)` 农历转公历
    - 实现 `getLeapMonth(year)` 获取闰月信息
    - 正确处理闰月标识和区分
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 2.8 编写农历转换属性测试
    - **Property 7: 农历公历往返一致性** — 验证公历→农历→公历往返一致
    - **Validates: Requirements 9.1, 9.2, 9.4**
    - **Property 8: 农历闰月显示正确性** — 验证闰月年份的闰月标识
    - **Validates: Requirements 1.4, 9.3**

- [ ] 3. 检查点 — 历法引擎验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. 核心计算引擎 — 四柱推算
  - [x] 4.1 实现年柱推算 `src/core/pillars/yearPillar.ts`
    - 实现 `calculateYearPillar(trueSolarTime, solarTerms)` 函数
    - 以立春精确时刻为年柱分界点
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 4.2 编写年柱属性测试
    - **Property 9: 年柱立春分界** — 验证立春前后年柱正确切换
    - **Validates: Requirements 11.1, 11.2, 11.3**

  - [x] 4.3 实现月柱推算 `src/core/pillars/monthPillar.ts`
    - 实现 `calculateMonthPillar(trueSolarTime, yearStem, solarTerms)` 函数
    - 以 12 个"节"的精确时刻为月柱地支分界点
    - 根据五虎遁月口诀由年干推算月柱天干
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 4.4 编写月柱属性测试
    - **Property 10: 月柱推算正确性** — 验证节气分界和五虎遁月映射
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [-] 4.5 实现日柱推算 `src/core/pillars/dayPillar.ts`
    - 实现 `calculateDayPillar(trueSolarTime, earlyRatSplit)` 函数
    - 使用基准日推算法（1900-01-31 甲子日）
    - 支持早子时/晚子时分属不同日柱选项
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ]* 4.6 编写日柱属性测试
    - **Property 11: 日柱推算正确性** — 验证基准日推算和早子时分界
    - **Validates: Requirements 13.1, 13.2, 13.3**

  - [~] 4.7 实现时柱推算 `src/core/pillars/hourPillar.ts`
    - 实现 `calculateHourPillar(trueSolarTime, dayStem)` 函数
    - 将真太阳时映射到十二时辰
    - 根据五鼠遁时口诀由日干推算时柱天干
    - _Requirements: 14.1, 14.2_

  - [ ]* 4.8 编写时柱属性测试
    - **Property 12: 时柱推算正确性** — 验证时辰映射和五鼠遁时映射
    - **Validates: Requirements 14.1, 14.2**

  - [~] 4.9 实现四柱综合计算 `src/core/pillars/` 中的 `calculateFourPillars`
    - 整合年柱、月柱、日柱、时柱计算
    - 接收 CalendarData 输出 FourPillars
    - _Requirements: 11.1, 12.1, 13.1, 14.1_

- [ ] 5. 核心计算引擎 — 命理要素
  - [~] 5.1 实现藏干模块 `src/core/pillars/hiddenStems.ts`
    - 实现 `getHiddenStems(branch)` 函数
    - 返回本气、中气、余气分类和权重
    - _Requirements: 15.1_

  - [ ]* 5.2 编写藏干属性测试
    - **Property 13: 藏干查表正确性** — 验证 12 地支的藏干与标准表一致
    - **Validates: Requirements 15.1**

  - [~] 5.3 实现十神推算模块 `src/core/pillars/tenGods.ts`
    - 实现 `calculateTenGod(dayStem, targetStem)` 函数
    - 根据五行生克关系和阴阳属性推算十神
    - 正确区分正/偏（正印 vs 偏印等）
    - _Requirements: 16.1, 16.2_

  - [ ]* 5.4 编写十神属性测试
    - **Property 14: 十神推算正确性** — 验证 10×10=100 种组合的十神结果
    - **Validates: Requirements 16.1, 16.2**

  - [~] 5.5 实现纳音模块 `src/core/pillars/naYin.ts`
    - 实现 `getNaYin(pillar)` 函数
    - 基于六十甲子纳音表查询
    - _Requirements: 17.1_

  - [ ]* 5.6 编写纳音属性测试
    - **Property 15: 纳音查表正确性** — 验证 60 甲子纳音与标准表一致
    - **Validates: Requirements 17.1**

  - [~] 5.7 实现神煞推算模块 `src/core/pillars/shenSha.ts`
    - 实现 `calculateShenSha(fourPillars)` 函数
    - 覆盖天乙贵人、文昌、驿马、桃花、华盖、将星、空亡、羊刃、禄神 9 种神煞
    - _Requirements: 18.1_

  - [ ]* 5.8 编写神煞属性测试
    - **Property 16: 神煞推算确定性** — 验证四柱组合的神煞推算确定性和完整性
    - **Validates: Requirements 18.1**

  - [~] 5.9 实现地支关系检测模块 `src/core/pillars/relations.ts`
    - 实现 `detectBranchRelations(branches)` 函数
    - 检测六合、三合、三会、六冲、六害、三刑、相破全部 7 种关系
    - 实现 `detectStemRelations(stems)` 函数
    - 检测天干五合和相克关系
    - _Requirements: 19.1-19.7, 20.1, 20.2_

  - [ ]* 5.10 编写干支关系属性测试
    - **Property 17: 地支关系检测正确性** — 验证四地支组合的关系检测无遗漏无误报
    - **Validates: Requirements 19.1-19.7**
    - **Property 18: 天干关系检测正确性** — 验证四天干组合的关系检测无遗漏无误报
    - **Validates: Requirements 20.1, 20.2**

- [ ] 6. 检查点 — 四柱推算与命理要素验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. 核心计算引擎 — 大运流年与五行分析
  - [~] 7.1 实现大运计算模块 `src/core/luck/daYun.ts`
    - 实现 `calculateDaYunDirection(yearStem, gender)` 判断顺逆排方向
    - 实现 `calculateStartAge(birthTime, monthPillar, direction, solarTerms)` 计算起运年龄
    - 实现 `calculateDaYun(monthPillar, direction, steps)` 排列 8-9 步大运
    - _Requirements: 21.1, 21.2, 21.3_

  - [ ]* 7.2 编写大运属性测试
    - **Property 19: 大运顺逆排方向** — 验证性别+年干阴阳的方向判断
    - **Validates: Requirements 21.1**
    - **Property 20: 大运序列正确性** — 验证大运按六十甲子顺/逆序排列
    - **Validates: Requirements 21.3**

  - [~] 7.3 实现流年计算模块 `src/core/luck/liuNian.ts`
    - 实现 `calculateLiuNian(startYear, count)` 函数
    - 按六十甲子循环排列流年干支
    - _Requirements: 22.1_

  - [ ]* 7.4 编写流年属性测试
    - **Property 21: 流年干支循环** — 验证流年干支 = (year - 4) mod 60
    - **Validates: Requirements 22.1**

  - [~] 7.5 实现命宫、胎元、身宫计算模块 `src/core/luck/palaces.ts`
    - 实现 `calculateMingGong(monthPillar, hourBranch)` 命宫
    - 实现 `calculateTaiYuan(monthPillar)` 胎元
    - 实现 `calculateShenGong(monthPillar, hourBranch)` 身宫
    - _Requirements: 23.1, 23.2, 23.3_

  - [ ]* 7.6 编写命宫胎元身宫属性测试
    - **Property 22: 命宫胎元身宫计算确定性** — 验证计算结果唯一确定，胎元公式正确
    - **Validates: Requirements 23.1, 23.2, 23.3**

  - [~] 7.7 实现五行分析模块 `src/core/wuxing/analyzer.ts`
    - 实现 `countWuXing(fourPillars)` 五行计数
    - 实现 `calculateWuXingScore(fourPillars, weights)` 五行力量评分
    - 实现 `judgeDayMasterStrength(fourPillars, monthBranch, wuxingScore)` 日主旺衰判断
    - _Requirements: 24.1, 24.2, 25.1_

  - [ ]* 7.8 编写五行分析属性测试
    - **Property 23: 五行计数与评分一致性** — 验证五行计数和加权评分的正确性
    - **Validates: Requirements 24.1, 24.2**

- [ ] 8. 检查点 — 大运流年与五行分析验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. 静态数据表
  - [~] 9.1 创建城市经纬度数据 `src/data/cities.ts`
    - 内置不少于 340 个中国城市的省、市、区、经度、纬度数据
    - 按省份分组，支持三级联动查询
    - _Requirements: 4.1_

  - [ ]* 9.2 编写城市数据属性测试
    - **Property 3: 城市经度自动填充** — 验证城市选择后返回的经度与数据库一致
    - **Validates: Requirements 4.2**

  - [~] 9.3 创建纳音表 `src/data/naYinTable.ts`
    - 完整的六十甲子纳音映射表（60 条记录）
    - _Requirements: 17.1_

  - [~] 9.4 创建藏干表 `src/data/hiddenStemsTable.ts`
    - 十二地支对应的本气、中气、余气藏干及权重
    - _Requirements: 15.1_

  - [~] 9.5 创建神煞规则表 `src/data/shenShaRules.ts`
    - 天乙贵人、文昌、驿马、桃花、华盖、将星、空亡、羊刃、禄神的推算规则
    - _Requirements: 18.1_

  - [~] 9.6 创建夏令时时刻表 `src/data/dst.ts`
    - 1986-1991 年中国夏令时精确起止时刻
    - _Requirements: 10.1_

  - [~] 9.7 创建术语解释表 `src/data/glossary.ts`
    - 所有十神、神煞、地支关系类型的中英文解释
    - _Requirements: 27.2, 29.2_

  - [ ]* 9.8 编写术语解释完整性属性测试
    - **Property 25: 术语解释完整性** — 验证所有十神、神煞、关系类型均有中英文解释
    - **Validates: Requirements 27.2, 29.2**

- [ ] 10. 检查点 — 静态数据表与核心引擎集成验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. UI 组件 — 输入面板
  - [~] 11.1 实现输入面板组件 `src/components/InputPanel/`
    - 公历/农历日期输入模式切换（公历为默认）
    - 日历选择器组件，年份范围 1900-2100
    - 农历模式下显示闰月标识的月份列表
    - 小时（0-23）和分钟（0-59）选择器
    - "北京标准时间"/"已经是真太阳时"时间类型选项
    - 性别选择（男/女）
    - 省市区三级联动选择器，选择后自动填入经度
    - 手动经度输入框，范围验证 [-180, 180]
    - 可折叠的高级设置面板（子时划分选项）
    - 表单验证：年份范围、经度范围、必填字段
    - _Requirements: 1.1-1.5, 2.1-2.3, 3.1, 4.1-4.4, 6.1, 6.2_

  - [ ]* 11.2 编写输入验证属性测试
    - **Property 1: 年份范围验证** — 验证 1900-2100 范围内有效，范围外拒绝
    - **Validates: Requirements 1.3, 1.5**
    - **Property 2: 经度范围验证** — 验证 [-180, 180] 范围内有效，范围外拒绝
    - **Validates: Requirements 4.4**

  - [~] 11.3 实现夏令时提醒对话框
    - 当输入 1986-1991 年夏令时期间日期时自动弹出
    - 提供"已包含夏令时（减1小时）"和"未包含夏令时（保持原样）"选项
    - _Requirements: 5.1, 5.2_

- [ ] 12. UI 组件 — 结果展示
  - [~] 12.1 实现四柱展示组件 `src/components/ResultDisplay/`
    - 卡片式布局展示年柱、月柱、日柱、时柱
    - 天干地支使用五行配色（金-白/金、木-绿、水-蓝/黑、火-红、土-黄/棕）
    - 每柱下方展示藏干信息
    - 每天干上方展示十神名称
    - 每柱下方展示纳音名称
    - 响应式设计（桌面端 >= 768px，移动端 < 768px）
    - 东方美学设计元素
    - _Requirements: 15.2, 16.3, 17.2, 26.1, 26.2, 26.3, 26.4_

  - [ ]* 12.2 编写五行配色属性测试
    - **Property 24: 五行配色映射** — 验证天干地支的五行配色与标准映射一致
    - **Validates: Requirements 26.2**

  - [~] 12.3 实现神煞与干支关系展示
    - 列出命盘中所有神煞及所在柱位
    - 可视化标注地支关系（六合、三合、三会、六冲、六害、三刑、相破）
    - 标注天干合克关系
    - _Requirements: 18.2, 19.8, 20.3_

  - [~] 12.4 实现大运流年展示组件 `src/components/LuckDisplay/`
    - 展示每步大运的干支和起止年龄
    - 展示当前大运内的流年干支列表
    - 展示命宫、胎元、身宫干支
    - _Requirements: 21.4, 22.2, 23.4_

  - [~] 12.5 实现五行图表组件 `src/components/WuXingChart/`
    - 柱状图或雷达图展示五行力量分布
    - 展示日主旺衰判断结果及分析依据
    - _Requirements: 24.3, 25.2_

  - [~] 12.6 实现术语解释弹窗
    - 点击命理术语弹出中英文解释
    - 覆盖所有十神、神煞、地支关系类型
    - _Requirements: 27.1, 27.2_

  - [~] 12.7 实现计算详情面板
    - 可展开的面板，分步展示推导过程
    - 包含真太阳时转换步骤、年柱/月柱/日柱/时柱确定依据
    - 显示所引用的节气精确时刻
    - _Requirements: 33.1, 33.2, 33.3_

  - [~] 12.8 实现加载指示器
    - 排盘计算进行时显示加载状态
    - _Requirements: 37.2_

- [ ] 13. 检查点 — UI 组件验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. 主题与国际化
  - [~] 14.1 实现主题管理 `src/store/useStore.ts` 中的主题逻辑
    - 深色/浅色主题切换，200ms 内完成渲染
    - 主题偏好保存到 localStorage
    - _Requirements: 28.1, 28.2, 28.3_

  - [~] 14.2 实现国际化模块 `src/i18n/`
    - 创建中文语言包 `zh.ts` 和英文语言包 `en.ts`
    - 实现 `t(key)`、`setLocale(locale)`、`getLocale()` 函数
    - 所有命理术语提供学术界公认的英文翻译
    - 不刷新页面切换所有界面文本
    - 语言偏好保存到 localStorage
    - _Requirements: 29.1, 29.2, 29.3, 29.4_

- [ ] 15. 数据存储与分享导出
  - [~] 15.1 实现存储管理 `src/utils/storage.ts`
    - 实现 `saveRecord`、`getRecords`、`deleteRecord`、`clearRecords` 函数
    - 历史记录上限 50 条，超出时删除最早记录
    - 实现 `savePreferences`、`getPreferences` 函数
    - localStorage 操作使用 try-catch 包裹，优雅降级
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 31.1, 31.2_

  - [ ]* 15.2 编写存储管理属性测试
    - **Property 26: 用户偏好往返一致性** — 验证偏好保存后读取一致
    - **Validates: Requirements 28.3, 29.4, 31.1, 31.2**
    - **Property 27: 历史记录上限不变量** — 验证记录数量始终 ≤ 50
    - **Validates: Requirements 30.2, 30.3**
    - **Property 28: 历史记录往返一致性** — 验证保存后加载的输入参数一致
    - **Validates: Requirements 30.1, 30.4**

  - [~] 15.3 实现数据导出导入 `src/utils/storage.ts`
    - 实现 `exportData` 导出 JSON 文件
    - 实现 `importData` 导入 JSON 文件，格式校验，无效格式拒绝导入
    - _Requirements: 32.1, 32.2, 32.3, 32.4_

  - [ ]* 15.4 编写数据导出导入属性测试
    - **Property 29: 数据导出导入往返一致性** — 验证导出再导入数据一致
    - **Validates: Requirements 32.1, 32.2, 32.4**
    - **Property 30: 无效 JSON 导入拒绝** — 验证无效 JSON 被拒绝且不修改现有数据
    - **Validates: Requirements 32.3**

  - [~] 15.5 实现 URL 分享 `src/utils/share.ts`
    - 实现 `encodeToHash(params)` 将输入参数编码到 URL hash
    - 实现 `decodeFromHash(hash)` 解析 URL hash 参数
    - 访问带参数 URL 时自动填入输入面板并执行排盘
    - _Requirements: 34.1, 34.2, 34.3_

  - [ ]* 15.6 编写 URL 分享属性测试
    - **Property 31: URL 参数往返一致性** — 验证编码到 URL 再解码参数一致
    - **Validates: Requirements 34.1, 34.2, 34.3**

  - [~] 15.7 实现图片导出和打印 `src/utils/export.ts`
    - 实现 `exportAsImage(elementId)` 将结果区域渲染为 PNG 并下载
    - 实现 `triggerPrint()` 打印功能，专用打印样式表隐藏非内容区域
    - 导出图片包含四柱、十神、纳音和大运信息
    - _Requirements: 35.1, 35.2, 36.1, 36.2_

- [ ] 16. 检查点 — 数据存储与分享功能验证
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. 应用集成与主流程串联
  - [~] 17.1 实现 Zustand Store `src/store/useStore.ts`
    - 管理全局状态：输入参数、排盘结果、主题、语言、历史记录
    - 串联完整排盘流程：输入 → 历法转换 → 四柱推算 → 命理分析 → 大运流年 → 五行分析
    - _Requirements: 37.1_

  - [~] 17.2 实现 App.tsx 主页面布局
    - 整合 InputPanel、ResultDisplay、LuckDisplay、WuXingChart 组件
    - 实现 URL hash 参数解析和自动排盘
    - 实现 React Error Boundary 错误回退界面
    - 实现历史记录侧边栏
    - _Requirements: 26.1, 26.3, 34.2_

- [ ] 18. 部署配置
  - [~] 18.1 配置 GitHub Pages 部署
    - 在 `vite.config.ts` 中配置正确的 `base` path
    - 确保构建产物为纯静态文件
    - _Requirements: 39.1, 39.2, 39.3_

- [ ] 19. 最终检查点 — 全量验证
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 标记 `*` 的任务为可选测试任务，可跳过以加速 MVP 开发
- 每个任务引用了具体的需求编号，确保需求可追溯
- 检查点任务用于阶段性验证，确保增量开发的正确性
- 属性测试验证设计文档中的 31 个正确性属性，确保核心计算逻辑的正确性
- 所有核心计算引擎为纯函数设计，便于独立测试
