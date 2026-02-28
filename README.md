# 八字排盘 BaZi Insights

> 纯前端在线八字排盘系统 | A pure client-side Chinese Four Pillars of Destiny calculator

[![Deploy to GitHub Pages](https://github.com/hotea/bazi-insights/actions/workflows/deploy.yml/badge.svg)](https://github.com/hotea/bazi-insights/actions/workflows/deploy.yml)

🔗 **在线体验 / Live Demo**: [https://hotea.github.io/bazi-insights/](https://hotea.github.io/bazi-insights/)

---

## 简介

八字排盘（BaZi / Four Pillars of Destiny）是中国传统命理学的核心工具。本项目基于天文算法实现精确的节气计算和四柱推算，所有计算均在浏览器端完成，零后端依赖。

## Introduction

BaZi (Four Pillars of Destiny) is a fundamental tool in Chinese traditional astrology. This project implements precise solar term calculations and Four Pillars derivation based on astronomical algorithms. All computations run entirely in the browser with zero backend dependencies.

## 功能特性 / Features

- 🌏 **精确节气计算 / Precise Solar Terms** — 基于 VSOP87 天文算法，精度 < 1 分钟
- 🕐 **真太阳时转换 / True Solar Time** — 经度修正 + 时差方程（EoT）
- 📅 **农历转换 / Lunar Calendar** — 公历 ↔ 农历互转，支持闰月（1900-2100）
- 🏛️ **四柱推算 / Four Pillars** — 年柱（立春分界）、月柱（节气分界）、日柱、时柱
- 🔮 **命理分析 / Destiny Analysis** — 藏干、十神、纳音、神煞、干支关系
- 📊 **大运流年 / Luck Periods** — 大运排列、流年干支、命宫/胎元/身宫
- ⚖️ **五行分析 / Five Elements** — 五行力量评分与日主旺衰判断
- ⏰ **夏令时处理 / DST Handling** — 内置 1986-1991 年中国夏令时数据
- 🌙 **深色/浅色主题 / Dark & Light Theme**
- 🌐 **中英双语 / Bilingual (Chinese & English)**
- 💾 **本地存储 / Local Storage** — 历史记录、偏好设置、数据导出导入
- 🔗 **URL 分享 / URL Sharing** — 通过链接分享排盘结果

## 技术栈 / Tech Stack

| 类别 / Category | 技术 / Technology |
|---|---|
| 框架 / Framework | React 18 + TypeScript |
| 构建 / Build | Vite 6 |
| 样式 / Styling | Tailwind CSS v4 |
| 状态管理 / State | Zustand |
| 测试 / Testing | Vitest + fast-check |
| 部署 / Deploy | GitHub Pages |

## 本地开发 / Development

```bash
# 克隆仓库 / Clone
git clone https://github.com/hotea/bazi-insights.git
cd bazi-insights

# 安装依赖 / Install
npm install

# 启动开发服务器 / Dev server
npm run dev

# 运行测试 / Run tests
npm test

# 构建 / Build
npm run build
```

## 项目结构 / Project Structure

```
src/
├── core/                # 核心计算引擎（纯函数）/ Core calculation engine
│   ├── calendar/        # 历法转换 / Calendar conversion
│   │   ├── solarTerms.ts    # 节气计算 / Solar terms
│   │   ├── trueSolarTime.ts # 真太阳时 / True solar time
│   │   ├── lunarCalendar.ts # 农历转换 / Lunar calendar
│   │   └── dst.ts           # 夏令时 / DST handling
│   ├── pillars/         # 四柱推算 / Four pillars
│   ├── luck/            # 大运流年 / Luck periods
│   └── wuxing/          # 五行分析 / Five elements
├── components/          # React 组件 / UI components
├── data/                # 静态数据表 / Static data tables
├── i18n/                # 国际化 / Internationalization
├── store/               # 状态管理 / State management
├── utils/               # 工具函数 / Utilities
└── types/               # TypeScript 类型 / Type definitions
```

## 算法说明 / Algorithm Notes

- **节气计算**: 采用 VSOP87 行星理论计算太阳黄经，结合 IAU 1980 章动修正和 ΔT 校正
- **年柱分界**: 以立春精确时刻为界，非公历元旦或农历春节
- **月柱分界**: 以 12 个"节"（非"气"）的精确时刻为界
- **日柱推算**: 以 1900-01-31（甲子日）为基准的六十甲子循环
- **农历转换**: 基于紫金山天文台历表的压缩查找表算法

---

- **Solar Terms**: VSOP87 planetary theory for solar longitude, with IAU 1980 nutation and ΔT corrections
- **Year Pillar**: Bounded by the exact moment of Lichun (Start of Spring), not Jan 1st or Lunar New Year
- **Month Pillar**: Bounded by 12 "Jie" (not "Qi") solar terms at their exact moments
- **Day Pillar**: Sexagenary cycle based on the reference date 1900-01-31 (Jiazi day)
- **Lunar Calendar**: Compressed lookup table algorithm based on Purple Mountain Observatory data

## 许可证 / License

MIT
