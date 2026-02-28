# Requirements Document

## Introduction

本文档定义了一个纯前端在线八字排盘（BaZi / Four Pillars of Destiny）系统的功能需求。该系统在浏览器端完成所有计算，零后端依赖，使用 localStorage 持久化数据，可直接部署到 GitHub Pages。技术栈为 React 18 + TypeScript + Vite + Tailwind CSS，支持中文/English 双语切换。

## Glossary

- **Input_Panel**: 用户输入面板，用于收集出生日期、时间、性别、出生地点等排盘所需信息的 UI 组件
- **Calendar_Engine**: 历法转换引擎，负责节气计算、真太阳时转换、公历农历互转、夏令时处理的核心模块
- **Pillars_Engine**: 八字推算引擎，负责根据历法数据推算年柱、月柱、日柱、时柱及相关命理要素的核心模块
- **Luck_Engine**: 大运流年引擎，负责计算大运排列、流年干支、命宫、胎元、身宫的模块
- **WuXing_Analyzer**: 五行分析器，负责五行计数、力量评分和日主旺衰判断的模块
- **Result_Display**: 排盘结果展示界面，以卡片式布局展示四柱及相关命理信息的 UI 组件
- **Storage_Manager**: 数据存储管理器，负责 localStorage 读写、历史记录管理和数据导入导出的模块
- **Share_Manager**: 分享与导出管理器，负责 URL 分享、图片导出和打印功能的模块
- **I18n_Manager**: 国际化管理器，负责中英双语切换和术语翻译的模块
- **Theme_Manager**: 主题管理器，负责深色/浅色主题切换和五行配色的模块
- **Solar_Term**: 节气，一年中24个特定时刻，由太阳黄经决定
- **True_Solar_Time**: 真太阳时，根据出生地经度和时差方程修正后的实际太阳时间
- **EoT**: 时差方程（Equation of Time），真太阳时与平太阳时之间的差值
- **Heavenly_Stem**: 天干，甲乙丙丁戊己庚辛壬癸十个符号
- **Earthly_Branch**: 地支，子丑寅卯辰巳午未申酉戌亥十二个符号
- **Pillar**: 柱，由一个天干和一个地支组成的干支对
- **Ten_Gods**: 十神，根据日干与其他天干的五行生克关系推算出的十种关系
- **NaYin**: 纳音，六十甲子中每对干支对应的五行纳音
- **Shen_Sha**: 神煞，根据特定规则推算的吉凶星煞
- **Da_Yun**: 大运，以月柱为基础按顺序或逆序排列的十年运程
- **Liu_Nian**: 流年，每一年对应的干支
- **DST**: 夏令时（Daylight Saving Time），中国在1986-1991年间实施的夏令时制度

## Requirements

### Requirement 1: 出生日期输入

**User Story:** As a 用户, I want 输入出生日期（支持公历和农历）, so that 系统可以基于准确的日期进行排盘计算。

#### Acceptance Criteria

1. THE Input_Panel SHALL 提供公历和农历两种日期输入模式，公历为默认模式
2. THE Input_Panel SHALL 提供日历选择器组件供用户选择日期
3. THE Input_Panel SHALL 将年份选择范围限制为 1900 年至 2100 年
4. WHEN 用户选择农历输入模式, THE Input_Panel SHALL 显示农历月份列表（含闰月标识）
5. WHEN 用户输入的日期超出 1900-2100 范围, THE Input_Panel SHALL 禁用提交并显示"日期超出支持范围"提示

### Requirement 2: 出生时间输入

**User Story:** As a 用户, I want 输入精确到分钟的出生时间, so that 系统可以准确确定时柱。

#### Acceptance Criteria

1. THE Input_Panel SHALL 提供小时（0-23）和分钟（0-59）选择器
2. THE Input_Panel SHALL 提供"北京标准时间"和"已经是真太阳时"两个时间类型选项，"北京标准时间"为默认选项
3. WHEN 用户选择"北京标准时间", THE Calendar_Engine SHALL 根据出生地经度和时差方程将输入时间转换为真太阳时

### Requirement 3: 性别输入

**User Story:** As a 用户, I want 选择性别, so that 系统可以正确判断大运顺逆排方向。

#### Acceptance Criteria

1. THE Input_Panel SHALL 提供"男"和"女"两个性别选项

### Requirement 4: 出生地点输入

**User Story:** As a 用户, I want 选择或输入出生地点, so that 系统可以获取经度用于真太阳时计算。

#### Acceptance Criteria

1. THE Input_Panel SHALL 提供中国省、市、区三级联动选择器，内置不少于 340 个城市的经纬度数据
2. WHEN 用户选择一个城市, THE Input_Panel SHALL 自动填入该城市对应的经度值
3. THE Input_Panel SHALL 提供手动输入经度的文本框，允许用户直接输入经度值
4. WHEN 用户手动输入的经度值超出 -180 至 180 范围, THE Input_Panel SHALL 显示"经度值无效"提示并禁用提交

### Requirement 5: 夏令时提醒

**User Story:** As a 用户, I want 在输入1986-1991年间的日期时收到夏令时提醒, so that 我可以确认出生时间是否包含夏令时偏移。

#### Acceptance Criteria

1. WHEN 用户输入的出生日期在 1986 年至 1991 年的夏令时生效期间内, THE Input_Panel SHALL 自动弹出夏令时提醒对话框
2. THE Input_Panel SHALL 在夏令时提醒对话框中提供"已包含夏令时（减1小时）"和"未包含夏令时（保持原样）"两个选项
3. WHEN 用户确认出生时间包含夏令时, THE Calendar_Engine SHALL 将输入时间减去 1 小时后再进行后续计算

### Requirement 6: 流派选项设置

**User Story:** As a 用户, I want 配置子时划分等流派选项, so that 排盘结果符合我所遵循的命理流派。

#### Acceptance Criteria

1. THE Input_Panel SHALL 提供可折叠的高级设置面板
2. THE Input_Panel SHALL 在高级设置面板中提供子时划分选项（早子时/晚子时是否分属不同日柱）


### Requirement 7: 节气计算

**User Story:** As a 排盘系统, I want 精确计算24节气时刻, so that 年柱和月柱的分界点准确无误。

#### Acceptance Criteria

1. THE Calendar_Engine SHALL 基于 VSOP87 理论或 Jean Meeus 天文算法计算 24 节气对应的太阳黄经时刻
2. THE Calendar_Engine SHALL 预计算 1900 年至 2100 年所有节气的精确时刻
3. THE Calendar_Engine SHALL 将节气计算精度控制在与紫金山天文台公布数据误差 1 分钟以内
4. THE Calendar_Engine SHALL 将节气时刻精确到秒

### Requirement 8: 真太阳时计算

**User Story:** As a 排盘系统, I want 将北京标准时间转换为真太阳时, so that 时柱推算基于出生地的实际太阳位置。

#### Acceptance Criteria

1. WHEN 用户选择"北京标准时间"模式, THE Calendar_Engine SHALL 计算出生地经度与东经 120 度的经度时差
2. WHEN 用户选择"北京标准时间"模式, THE Calendar_Engine SHALL 计算出生日期对应的时差方程（EoT）修正值
3. THE Calendar_Engine SHALL 将经度时差和时差方程修正值叠加到输入时间上，得出真太阳时
4. THE Calendar_Engine SHALL 在结果中同时显示原始输入时间和转换后的真太阳时

### Requirement 9: 农历转换

**User Story:** As a 排盘系统, I want 实现公历与农历的互相转换, so that 支持农历输入模式和农历日期显示。

#### Acceptance Criteria

1. THE Calendar_Engine SHALL 支持 1900 年至 2100 年范围内公历日期到农历日期的转换
2. THE Calendar_Engine SHALL 支持 1900 年至 2100 年范围内农历日期到公历日期的转换
3. THE Calendar_Engine SHALL 正确处理农历闰月（标识闰月并区分闰月与非闰月同名月份）
4. FOR ALL 1900-2100 范围内的有效公历日期, 公历转农历再转回公历 SHALL 得到与原始日期相同的结果（往返一致性）

### Requirement 10: 夏令时处理

**User Story:** As a 排盘系统, I want 内置中国夏令时精确时刻表, so that 1986-1991年间的出生时间可以正确修正。

#### Acceptance Criteria

1. THE Calendar_Engine SHALL 内置 1986 年至 1991 年中国夏令时的精确起止时刻表
2. WHEN 出生日期时间落在夏令时生效期间且用户确认包含夏令时, THE Calendar_Engine SHALL 将时间减去 1 小时

### Requirement 11: 年柱推算

**User Story:** As a 排盘系统, I want 根据立春精确时刻推算年柱, so that 年柱在立春交接时正确切换。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 以立春精确时刻作为年柱的分界点
2. WHEN 出生时间在某年立春之前, THE Pillars_Engine SHALL 将年柱设为上一年的干支
3. WHEN 出生时间在某年立春之后（含立春时刻）, THE Pillars_Engine SHALL 将年柱设为当年的干支

### Requirement 12: 月柱推算

**User Story:** As a 排盘系统, I want 根据节气和五虎遁月口诀推算月柱, so that 月柱在节气交接时正确切换且天干正确。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 以12个"节"（立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪、小寒）的精确时刻作为月柱地支的分界点
2. THE Pillars_Engine SHALL 根据五虎遁月口诀，由年干推算月柱天干
3. WHEN 出生时间恰好在节气交接时刻, THE Pillars_Engine SHALL 将月柱设为新月份的干支

### Requirement 13: 日柱推算

**User Story:** As a 排盘系统, I want 准确推算日柱, so that 日柱干支正确无误。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 使用基准日推算法计算任意日期的日柱干支
2. THE Pillars_Engine SHALL 以真太阳时 0 时（子时初）作为日柱切换的默认分界点
3. WHEN 用户选择"早子时晚子时分属不同日柱"选项, THE Pillars_Engine SHALL 以真太阳时 23:00 作为日柱切换分界点

### Requirement 14: 时柱推算

**User Story:** As a 排盘系统, I want 根据真太阳时和五鼠遁时口诀推算时柱, so that 时柱干支准确反映出生时辰。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 将真太阳时映射到对应的十二时辰（地支）
2. THE Pillars_Engine SHALL 根据五鼠遁时口诀，由日干推算时柱天干


### Requirement 15: 地支藏干

**User Story:** As a 用户, I want 查看每个地支的藏干信息, so that 我可以分析命盘中的隐藏五行力量。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 为每个地支计算本气、中气、余气三类藏干
2. THE Result_Display SHALL 在每个柱的地支下方展示对应的藏干信息

### Requirement 16: 十神推算

**User Story:** As a 用户, I want 查看十神信息, so that 我可以分析命盘中各干支与日主的关系。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 以日干为基准，根据五行生克关系推算其余七个天干（年干、月干、时干及四个地支藏干本气）的十神
2. THE Pillars_Engine SHALL 正确区分正印与偏印、正官与偏官、正财与偏财、食神与伤官、比肩与劫财
3. THE Result_Display SHALL 在每个天干上方展示对应的十神名称

### Requirement 17: 纳音推算

**User Story:** As a 用户, I want 查看四柱的纳音信息, so that 我可以了解每柱的纳音五行属性。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 根据六十甲子纳音表为每个柱计算对应的纳音五行
2. THE Result_Display SHALL 在每个柱下方展示纳音名称

### Requirement 18: 神煞推算

**User Story:** As a 用户, I want 查看命盘中的神煞信息, so that 我可以了解命盘中的吉凶星煞。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 推算以下神煞：天乙贵人、文昌、驿马、桃花、华盖、将星、空亡、羊刃、禄神
2. THE Result_Display SHALL 列出命盘中存在的所有神煞及其所在柱位

### Requirement 19: 地支关系推算

**User Story:** As a 用户, I want 查看四柱地支之间的关系, so that 我可以分析命盘中的合冲刑害。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 检测四柱地支之间的六合关系
2. THE Pillars_Engine SHALL 检测四柱地支之间的三合局关系
3. THE Pillars_Engine SHALL 检测四柱地支之间的三会方关系
4. THE Pillars_Engine SHALL 检测四柱地支之间的六冲关系
5. THE Pillars_Engine SHALL 检测四柱地支之间的六害关系
6. THE Pillars_Engine SHALL 检测四柱地支之间的三刑关系（含相刑和自刑）
7. THE Pillars_Engine SHALL 检测四柱地支之间的相破关系
8. THE Result_Display SHALL 以可视化方式标注四柱地支之间存在的所有关系

### Requirement 20: 天干关系推算

**User Story:** As a 用户, I want 查看四柱天干之间的关系, so that 我可以分析命盘中的天干合克。

#### Acceptance Criteria

1. THE Pillars_Engine SHALL 检测四柱天干之间的五合关系
2. THE Pillars_Engine SHALL 检测四柱天干之间的相克关系
3. THE Result_Display SHALL 标注四柱天干之间存在的合克关系

### Requirement 21: 大运计算

**User Story:** As a 用户, I want 查看大运排列, so that 我可以了解人生各阶段的运势走向。

#### Acceptance Criteria

1. THE Luck_Engine SHALL 根据性别和年干阴阳属性判断大运顺排或逆排方向
2. THE Luck_Engine SHALL 精确计算起运年龄（精确到年、月、日）
3. THE Luck_Engine SHALL 以月柱为基础，按顺序或逆序排列 8 至 9 步大运
4. THE Result_Display SHALL 展示每步大运的干支和对应的起止年龄

### Requirement 22: 流年计算

**User Story:** As a 用户, I want 查看当前大运内的流年干支, so that 我可以分析每年的运势变化。

#### Acceptance Criteria

1. THE Luck_Engine SHALL 计算当前大运周期内每一年的流年干支
2. THE Result_Display SHALL 在大运下方展示对应的流年干支列表

### Requirement 23: 命宫、胎元、身宫计算

**User Story:** As a 用户, I want 查看命宫、胎元和身宫, so that 我可以获得更完整的命理分析信息。

#### Acceptance Criteria

1. THE Luck_Engine SHALL 根据月柱和时柱计算命宫干支
2. THE Luck_Engine SHALL 根据月柱计算胎元干支
3. THE Luck_Engine SHALL 根据月柱和时柱计算身宫干支
4. THE Result_Display SHALL 展示命宫、胎元、身宫的干支信息


### Requirement 24: 五行计数与力量评分

**User Story:** As a 用户, I want 查看命盘的五行分布和力量评分, so that 我可以直观了解五行的强弱格局。

#### Acceptance Criteria

1. THE WuXing_Analyzer SHALL 统计命盘中金、木、水、火、土五行各自出现的天干和地支藏干数量
2. THE WuXing_Analyzer SHALL 根据天干、地支本气、中气、余气的不同权重计算五行力量评分
3. THE Result_Display SHALL 以可视化图表（柱状图或雷达图）展示五行力量分布

### Requirement 25: 日主旺衰判断

**User Story:** As a 用户, I want 了解日主的旺衰状态, so that 我可以初步判断命局的强弱。

#### Acceptance Criteria

1. THE WuXing_Analyzer SHALL 根据月令、五行力量分布和生克关系对日主旺衰进行初步判断
2. THE Result_Display SHALL 展示日主旺衰判断结果及简要分析依据

### Requirement 26: 排盘结果展示

**User Story:** As a 用户, I want 以清晰美观的方式查看排盘结果, so that 我可以方便地阅读和分析命盘信息。

#### Acceptance Criteria

1. THE Result_Display SHALL 以卡片式布局展示年柱、月柱、日柱、时柱四柱信息
2. THE Result_Display SHALL 为每个天干和地支使用对应五行的配色（金-白/金、木-绿、水-蓝/黑、火-红、土-黄/棕）
3. THE Result_Display SHALL 采用响应式设计，在桌面端（宽度 >= 768px）和移动端（宽度 < 768px）均可正常浏览
4. THE Result_Display SHALL 融入东方美学设计元素

### Requirement 27: 术语解释

**User Story:** As a 用户, I want 点击命理术语查看解释, so that 我可以理解不熟悉的专业术语。

#### Acceptance Criteria

1. WHEN 用户点击排盘结果中的命理术语, THE Result_Display SHALL 弹出该术语的中英文解释说明
2. THE Result_Display SHALL 为所有十神、神煞、地支关系类型提供术语解释

### Requirement 28: 主题切换

**User Story:** As a 用户, I want 在深色和浅色主题之间切换, so that 我可以选择舒适的视觉模式。

#### Acceptance Criteria

1. THE Theme_Manager SHALL 提供深色主题和浅色主题两种模式
2. WHEN 用户切换主题, THE Theme_Manager SHALL 在 200ms 内完成主题切换渲染
3. THE Theme_Manager SHALL 将用户的主题偏好保存到 localStorage

### Requirement 29: 中英双语切换

**User Story:** As a 用户, I want 在中文和英文之间切换界面语言, so that 不同语言背景的用户都可以使用系统。

#### Acceptance Criteria

1. THE I18n_Manager SHALL 支持中文和英文两种界面语言
2. THE I18n_Manager SHALL 为所有命理术语（天干、地支、十神、神煞、纳音等）提供学术界公认的英文翻译
3. WHEN 用户切换语言, THE I18n_Manager SHALL 在不刷新页面的情况下切换所有界面文本
4. THE I18n_Manager SHALL 将用户的语言偏好保存到 localStorage

### Requirement 30: 排盘历史记录

**User Story:** As a 用户, I want 保存和查看历史排盘记录, so that 我可以方便地回顾之前的排盘结果。

#### Acceptance Criteria

1. WHEN 用户完成一次排盘, THE Storage_Manager SHALL 自动将排盘参数和结果保存到 localStorage
2. THE Storage_Manager SHALL 将历史记录数量限制为最多 50 条
3. WHEN 历史记录达到 50 条上限且新增一条记录, THE Storage_Manager SHALL 删除最早的一条记录
4. WHEN 用户点击历史记录中的某条记录, THE Storage_Manager SHALL 恢复该记录的输入参数并重新展示排盘结果

### Requirement 31: 用户偏好持久化

**User Story:** As a 用户, I want 系统记住我的偏好设置, so that 下次访问时无需重新配置。

#### Acceptance Criteria

1. THE Storage_Manager SHALL 将以下偏好保存到 localStorage：主题模式、语言选择、流派选项、默认出生地点
2. WHEN 用户打开系统, THE Storage_Manager SHALL 从 localStorage 读取并应用已保存的偏好设置

### Requirement 32: 数据导出与导入

**User Story:** As a 用户, I want 导出和导入排盘数据, so that 我可以备份数据或在不同设备间迁移。

#### Acceptance Criteria

1. THE Storage_Manager SHALL 提供将所有历史记录和偏好设置导出为 JSON 文件的功能
2. THE Storage_Manager SHALL 提供从 JSON 文件导入历史记录和偏好设置的功能
3. WHEN 导入的 JSON 文件格式不符合预期结构, THE Storage_Manager SHALL 显示"文件格式无效"提示并拒绝导入
4. FOR ALL 有效的导出数据, 导出再导入 SHALL 得到与原始数据一致的结果（往返一致性）

### Requirement 33: 计算详情面板

**User Story:** As a 用户, I want 查看排盘计算的详细推导过程, so that 我可以验证计算的正确性和透明性。

#### Acceptance Criteria

1. THE Result_Display SHALL 提供可展开的计算详情面板
2. THE Result_Display SHALL 在计算详情面板中分步展示以下推导过程：真太阳时转换步骤、年柱确定依据（立春时刻）、月柱确定依据（节气时刻）、日柱计算过程、时柱确定依据（时辰映射）
3. THE Result_Display SHALL 在计算详情面板中显示所引用的节气精确时刻

### Requirement 34: URL 分享

**User Story:** As a 用户, I want 通过 URL 分享排盘结果, so that 我可以将排盘结果发送给他人查看。

#### Acceptance Criteria

1. WHEN 用户点击分享按钮, THE Share_Manager SHALL 将排盘输入参数编码到 URL 的 hash 部分
2. WHEN 用户通过包含排盘参数的 URL 访问系统, THE Share_Manager SHALL 解析 hash 参数并自动填入输入面板执行排盘
3. FOR ALL 有效的排盘输入参数, 编码到 URL 再解析回参数 SHALL 得到与原始参数一致的结果（往返一致性）

### Requirement 35: 图片导出

**User Story:** As a 用户, I want 将排盘结果导出为图片, so that 我可以保存或分享排盘结果截图。

#### Acceptance Criteria

1. WHEN 用户点击图片导出按钮, THE Share_Manager SHALL 将排盘结果区域渲染为 PNG 图片并触发下载
2. THE Share_Manager SHALL 在导出的图片中包含四柱信息、十神、纳音和大运信息

### Requirement 36: 打印支持

**User Story:** As a 用户, I want 打印排盘结果, so that 我可以获得纸质版的排盘信息。

#### Acceptance Criteria

1. THE Share_Manager SHALL 提供专用的打印样式表
2. WHEN 用户触发打印, THE Share_Manager SHALL 隐藏导航栏、侧边栏等非内容区域，仅打印排盘结果

### Requirement 37: 排盘计算性能

**User Story:** As a 用户, I want 排盘计算快速完成, so that 我无需长时间等待结果。

#### Acceptance Criteria

1. WHEN 用户提交排盘请求, THE Pillars_Engine SHALL 在 500ms 内完成所有计算并返回结果
2. WHILE 排盘计算正在进行, THE Result_Display SHALL 显示加载指示器

### Requirement 38: TypeScript 严格模式

**User Story:** As a 开发者, I want 项目使用 TypeScript strict mode, so that 代码质量和类型安全得到保障。

#### Acceptance Criteria

1. THE 项目 SHALL 在 tsconfig.json 中启用 strict: true 配置
2. THE 项目 SHALL 确保所有源代码文件通过 TypeScript 严格模式编译且无类型错误

### Requirement 39: GitHub Pages 部署

**User Story:** As a 开发者, I want 项目可直接部署到 GitHub Pages, so that 用户可以通过网页访问系统。

#### Acceptance Criteria

1. THE 项目 SHALL 使用 Vite 构建工具生成静态文件
2. THE 项目 SHALL 配置正确的 base path 以支持 GitHub Pages 部署
3. THE 项目 SHALL 确保构建产物为纯静态文件，无需服务端运行环境
