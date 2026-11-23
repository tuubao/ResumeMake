import type { CustomField, ModuleItem, ModuleType, Resume, ResumeModule } from '@/types/resume'
import { DEFAULT_STYLE, uid } from '@/types/resume'
import { createSampleResume } from './sampleResume'

/** 场景示例构造辅助：轻量富文本段落（仅 b/p/ul/li，渲染前经 sanitizeHtml 净化） */
const ul = (...lis: string[]) => `<ul>${lis.map((l) => `<li>${l}</li>`).join('')}</ul>`
const p = (label: string, text = '') => `<p><b>${label}：</b>${text}</p>`
const item = (fields: Omit<ModuleItem, 'id'>): ModuleItem => ({ id: uid(), ...fields })
const mod = (type: ModuleType, title: string, items: ModuleItem[]): ResumeModule => ({ id: uid(), type, title, items })
const eduField = (value: string): CustomField => ({ id: uid(), icon: 'education', value })
const linkField = (value: string): CustomField => ({ id: uid(), icon: 'link', value })

interface SampleOptions {
  templateId: string
  jobTitle: string
  extra: string
  customFields?: CustomField[]
  modules: ResumeModule[]
  themeColor?: string
}

function makeResume(opts: SampleOptions): Resume {
  return {
    templateId: opts.templateId,
    basics: {
      name: '张三',
      phone: '138-0000-8888',
      email: 'zhangsan@example.com',
      jobTitle: opts.jobTitle,
      avatar: '',
      extra: opts.extra,
      customFields: opts.customFields ?? []
    },
    modules: opts.modules,
    style: { ...DEFAULT_STYLE, ...(opts.themeColor ? { themeColor: opts.themeColor } : {}) }
  }
}

/** Java 后端社招（3-5 年）：技能-履历-项目黄金三段式，职责与成果拆分 */
export function createJavaSeniorSample(): Resume {
  return makeResume({
    templateId: 'modern',
    jobTitle: 'Java高级后端工程师',
    extra: '5年经验 · 南昌',
    customFields: [eduField('某某大学（本科-2020.6 毕业）')],
    modules: [
      mod('skills', '专业技能', [
        item({ content: '具备扎实的 Java 并发编程基础，深入理解 JVM 内存模型、类加载机制与垃圾回收算法，有丰富的线上 OOM 与 GC 调优实战排障经验' }),
        item({ content: '精通 MySQL InnoDB 存储引擎与 MVCC 机制，具备千万级表分库分表与复杂慢 SQL 深度调优经验；精通 Redis 高可用架构与分布式锁，能解决缓存雪崩与穿透问题' }),
        item({ content: '精通 Spring Boot 与 Spring Cloud Alibaba 微服务生态，熟悉 Nacos 注册、Sentinel 限流降级与 Gateway 网关底层逻辑，具备二次开发经验' }),
        item({ content: '精通 Kafka/RocketMQ 消息队列，具备消息防丢失、防重复消费与海量堆积的成熟方法论；熟悉 Elasticsearch 倒排索引与聚合查询优化' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '高级后端开发工程师',
          startDate: '2023.05',
          endDate: '至今',
          content: ul(
            '担任核心交易链路技术骨干，主导电商大促期间订单与支付模块的微服务架构演进与容量规划',
            '主导交易系统从单体向微服务的平滑迁移，实现核心链路与边缘业务彻底解耦',
            '对订单表进行分库分表改造，<b>支撑 500 万笔订单的峰值写入</b>',
            '带领 3 名初中级研发攻克分布式锁性能瓶颈，引入分段锁机制<b>将秒杀接口吞吐量提升 40%</b>',
            '制定并落地团队代码规范与 Code Review 机制，线上故障率显著下降'
          )
        }),
        item({
          title: '某高速成长独角兽企业',
          subtitle: 'Java研发工程师',
          startDate: '2020.07',
          endDate: '2023.03',
          content: ul(
            '负责泛娱乐社交平台消息触达与用户激励系统后端研发，对接海量用户签到与积分发放业务',
            '协助架构师完成底层监控大盘搭建，参与制定线上故障定级与快速应急响应预案'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '全链路高并发交易营销平台',
          subtitle: '后端负责人',
          startDate: '2024.01',
          endDate: '2026.01',
          content:
            p('项目介绍', '支撑上亿级用户的电商核心交易平台，涵盖大促秒杀、分布式库存扣减、营销卡券叠加结算与异步订单履约等核心链路。') +
            p('个人职责') +
            ul(
              '负责秒杀抢购网关层的限流降级设计与底层库存安全扣减方案落地',
              '主导订单支付成功后的履约状态机开发，处理跨微服务的数据最终一致性问题'
            ) +
            p('技术亮点') +
            ul(
              '构建多级缓存防线：Nginx+Lua 前置限流、Redis 集群热点预热、本地缓存拦截无效请求，<b>抗住每秒 10 万次峰值查询</b>',
              'Redis+Lua 脚本原子性预扣减库存，消息队列异步驱动 MySQL 最终落盘，<b>整体交易吞吐量提升 5 倍以上</b>',
              'RocketMQ 事务消息结合本地消息表与定时重试补偿，<b>实现 99.99% 的分布式数据最终一致性</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '专注高并发分布式系统建设，精通电商大促场景技术落地，具备强技术攻坚力与跨团队协同推进能力' })
      ])
    ]
  })
}

/** 通用综合示例（1-3 年研发）：教育/技能/工作/项目/自评均衡结构，全岗位可参考 */
export function createGeneralSample(): Resume {
  return makeResume({
    templateId: 'minimal',
    jobTitle: '软件研发工程师',
    extra: '3年经验 · 南昌',
    customFields: [eduField('某某大学（本科-2022.6 毕业）')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '软件工程 · 本科',
          startDate: '2018.09',
          endDate: '2022.06',
          content: ul('GPA 3.6/4.0，专业排名前 15%，获校级奖学金', '英语：CET-6（520 分）')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '熟练掌握 Java/Python 等主流开发语言，具备扎实的数据结构与算法基础，编码习惯良好' }),
        item({ content: '熟悉 MySQL 等关系型数据库，能独立完成表结构设计与常见 SQL 优化' }),
        item({ content: '熟悉 Linux 开发环境与 Git 协作流程，了解 CI/CD 与容器化部署基础' }),
        item({ content: '具备良好的文档编写与跨团队沟通能力，能快速理解业务并独立交付' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '软件研发工程师',
          startDate: '2022.07',
          endDate: '至今',
          content: ul(
            '负责核心业务模块的设计、开发与维护，参与需求评审到上线的全流程',
            '主导某查询接口性能优化，通过索引优化与缓存<b>将响应耗时降低 60%</b>',
            '编写技术文档与单元测试，模块测试覆盖率提升至 70% 以上'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '企业信息化管理系统',
          subtitle: '核心开发',
          startDate: '2023.03',
          endDate: '2023.12',
          content:
            p('项目简介', '面向企业内部的信息管理系统，涵盖审批流、报表统计与权限管理等模块，服务 500+ 员工。') +
            p('技术栈', 'Spring Boot、Vue、MySQL、Redis') +
            p('技术亮点') +
            ul(
              '设计可配置审批流引擎，新流程接入时间从 3 天缩短至半天',
              '引入 Redis 缓存报表热点数据，<b>报表加载耗时缩短 70%</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '责任心强，执行力好，注重工程质量，能独立推进模块并与团队高效协作' })
      ])
    ]
  })
}

/** Java 后端校招（硕本双学历）：教育前置，实习 + 双项目量化成果 */
export function createJavaMasterCampusSample(): Resume {
  return makeResume({
    templateId: 'banner',
    jobTitle: 'Java后端开发工程师',
    extra: '应届生 · 南昌',
    customFields: [eduField('某某大学 · 硕士 · 2027 届')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 硕士',
          startDate: '2024.09',
          endDate: '2027.06',
          content: ul('GPA 3.8/4.0，排名 3/60，硕士国家奖学金、优秀研究生', '研究方向：分布式系统、高并发架构')
        }),
        item({
          title: '某某大学',
          subtitle: '软件工程 · 本科',
          startDate: '2020.09',
          endDate: '2024.06',
          content: ul('GPA 3.7/4.0，专业排名前 10%，获本科生国家励志奖学金')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '熟悉 Java 核心 API，掌握常用集合底层实现数据结构，了解多线程基础使用与常见线程安全问题' }),
        item({ content: '熟悉 Spring、Spring Boot、MyBatis，了解 Spring 的 IOC 与 AOP 设计思想及常见应用场景' }),
        item({ content: '熟悉 MySQL 核心概念，掌握常见 SQL 编写与执行计划查看，了解事务与索引基本原理' }),
        item({ content: '了解 Redis 基本数据类型，熟悉其在缓存场景中的日常使用，了解缓存穿透与缓存雪崩等基本概念' }),
        item({ content: '了解 TCP/IP 基础网络协议，熟悉 Linux 常见目录结构与日常排查服务状态的命令' })
      ]),
      mod('work', '实习经历', [
        item({
          title: '某头部互联网公司',
          subtitle: '后端开发实习生',
          startDate: '2025.06',
          endDate: '2025.09',
          content:
            p('个人职责') +
            ul(
              '参与内容管理中台后端开发，负责视频上传与审核模块的接口开发',
              '协助搭建消息队列异步处理链路，完成转码与审核任务的联调上线'
            ) +
            p('工作成果') +
            ul(
              '优化分片上传合并逻辑，<b>大文件上传成功率提升至 99% 以上</b>',
              '引入 Redis 缓存审核状态热点数据，<b>审核列表查询响应缩短 60%</b>'
            )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '短视频内容管理中台',
          subtitle: '后端开发',
          startDate: '2025.01',
          endDate: '2025.06',
          content:
            p('项目简介', '面向运营人员的短视频内容审核与数据管理后台，涵盖视频管理、多级分类、内容审核与数据统计等功能。') +
            p('技术栈', 'Spring Boot、MySQL、MyBatis-Plus、Redis、MinIO、RabbitMQ') +
            p('技术亮点') +
            ul(
              'MinIO 对象存储 + 分片上传与断点续传，<b>上传成功率 99%+，单文件最大支持 10GB</b>',
              'RabbitMQ 异步解耦转码与审核流程，<b>系统吞吐量达 1000+ QPS，峰值延迟小于 5s</b>',
              'Redis 缓存分类树形结构替代数据库递归查询，<b>菜单加载响应小于 10ms</b>'
            )
        }),
        item({
          title: '种草内容社交微服务平台',
          subtitle: '后端开发',
          startDate: '2024.05',
          endDate: '2024.12',
          content:
            p('项目简介', '基于微服务架构的图文分享种草社区，涵盖内容发布、评论互动、关注推送与全文检索等功能。') +
            p('技术栈', 'Spring Cloud Gateway、Redis、RabbitMQ、ElasticSearch、MySQL') +
            p('技术亮点') +
            ul(
              '统一网关鉴权结合 JWT 与路由级权限控制，<b>日均拦截非法请求 10w+</b>',
              '推拉结合 Feed 流架构，<b>大 V 发文延迟小于 1 秒，Feed 流加载稳定在 200ms 内</b>',
              'ElasticSearch 全文检索支持多条件查询与高亮，<b>检索响应小于 500ms</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '计算机基础扎实，关注高并发后端技术，善于将科研思路转化为工程落地，具备良好的文档与沟通能力' })
      ])
    ]
  })
}

/** 前端开发校招：React 技术栈 + 实习成果 + 中台项目（附项目地址） */
export function createFrontendCampusSample(): Resume {
  return makeResume({
    templateId: 'fresh',
    jobTitle: '前端开发工程师',
    extra: '应届生 · 南昌',
    themeColor: '#15803d',
    customFields: [eduField('某某大学 · 本科 · 2026 届'), linkField('github.com/zhangsan')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 本科',
          startDate: '2022.09',
          endDate: '2026.06',
          content: ul('GPA 3.9/4.0，专业排名前 5%，国家奖学金、连续两年校级三好学生', '英语：CET-4（590 分）、CET-6（540 分）')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '熟悉 HTML5 与 CSS3 规范，熟练使用 Sass/Less 等 CSS 预处理语言，具备较强的设计稿高保真还原能力' }),
        item({ content: '熟悉 JavaScript 核心运行机制，理解 this 指向与异步编程模型，熟练运用 async/await 处理复杂异步请求' }),
        item({ content: '掌握 React 技术栈，熟练使用 React Hooks 进行状态逻辑复用，熟悉 Redux 与 React Router 等核心生态工具' }),
        item({ content: '了解 React 底层原理，熟悉虚拟 DOM、Fiber 架构与合成事件机制' }),
        item({ content: '熟悉前端工程化基础，了解浏览器渲染原理与常见性能优化手段' })
      ]),
      mod('work', '实习经历', [
        item({
          title: '某知名 SaaS 科技公司',
          subtitle: '前端开发实习生',
          startDate: '2025.06',
          endDate: '2025.09',
          content:
            p('个人职责') +
            ul(
              '参与公司官网及核心 SaaS 控制台迭代开发，使用 React 与 Next.js 完成业务页面组件化重构',
              '协助团队搭建 SEO 与数据埋点体系，实现用户行为精准追踪'
            ) +
            p('工作成果') +
            ul(
              '基于 Tailwind CSS 重构 10 余个历史页面，抽离可复用组件，<b>页面整体加载速度提升约 15%</b>',
              '优化服务端渲染首屏请求与静态资源按需加载，<b>核心落地页搜索收录量提升 40%</b>'
            )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '星图企业级中台管理系统',
          subtitle: '前端开发',
          startDate: '2025.01',
          endDate: '2025.06',
          link: 'https://github.com/zhangsan/xingtu-admin',
          content:
            p('项目介绍', '综合性 B 端后台管理系统，涵盖多角色权限控制、动态数据看板与海量商品管理模块。') +
            p('技术栈', 'React 18、TypeScript、Zustand、React Query、Tailwind CSS') +
            p('技术亮点') +
            ul(
              '基于角色的访问控制结合动态路由按需加载菜单，组件层封装权限校验拦截器阻断越权访问',
              'React Query 接管服务端状态，自动缓存与定时重试，<b>过滤 30% 以上重复网络请求</b>',
              '复合组件模式封装搜索表格与模态框组件，<b>代码复用率提升 40%</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '不满足于框架的简单调用，业余通读 Vue3 核心响应式源码，在个人博客输出 5 篇深度源码解析文章' }),
        item({ content: '具备清晰的前端工程化思维，善于平衡业务需求与技术优化，学习能力强且沟通顺畅' })
      ])
    ]
  })
}

/** 大模型算法校招：教育-技能-项目-科研论文叙事结构 */
export function createAiCampusSample(): Resume {
  return makeResume({
    templateId: 'ai-campus',
    jobTitle: '大模型算法工程师',
    extra: '应届生 · 南昌',
    themeColor: '#0d9488',
    customFields: [eduField('某某大学 · 硕士 · 2027 届')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 硕士',
          startDate: '2024.09',
          endDate: '2027.06',
          content: ul('GPA 3.8/4.0，排名 3/60，硕士国家奖学金、优秀研究生', '研究方向：大模型微调、提示工程、检索增强生成（RAG）')
        }),
        item({
          title: '某某大学',
          subtitle: '软件工程 · 本科',
          startDate: '2020.09',
          endDate: '2024.06',
          content: ul('GPA 3.7/4.0，专业排名前 10%，获本科生国家励志奖学金')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '熟悉大模型基础理论与 Transformer 架构，掌握预训练与微调范式，掌握 LoRA、QLoRA 等高效微调技术' }),
        item({ content: '熟悉 Llama、Qwen、GLM 等主流大模型，能独立完成模型选型、二次开发与部署优化' }),
        item({ content: '精通 RAG 全流程：文档解析、向量化、向量库检索与上下文增强，具备检索准确率优化经验' }),
        item({ content: '熟练使用 PyTorch、HuggingFace Transformers、LangChain 等工具，具备提示词工程与模型评估能力' })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '多模态内容生成与审核平台',
          subtitle: '算法开发',
          startDate: '2025.10',
          endDate: '2026.02',
          content:
            p('项目简介', '为内容平台提供 AI 辅助创作与违规内容审核能力，支持文本、图片多模态输入，提升内容生产效率与平台安全性。') +
            p('个人职责') +
            ul(
              '负责文本生成模块的提示词工程与模型蒸馏，优化生成内容的合规性与多样性',
              '开发多模态审核算法，结合文本语义与图像特征实现违规内容自动识别与拦截'
            ) +
            p('技术亮点') +
            ul(
              '基于 Llama-2-7B 蒸馏出 3B 轻量化版本，<b>推理速度提升 3 倍，同时保持 95% 生成质量</b>',
              '多模态审核模型<b>精确率达 94%、召回率达 91%</b>，有效拦截违规内容',
              '平台<b>日均生成内容 8000+ 条，审核效率提升 70%</b>，成为内容运营核心工具'
            )
        })
      ]),
      mod('custom', '科研论文', [
        item({
          title: '《基于自适应检索增强的大模型知识更新方法研究》（一作）',
          subtitle: 'CCF B 类会议 · 2026.03 投稿',
          content:
            p('研究内容') +
            ul(
              '针对大模型静态知识过时问题，提出自适应检索增强框架，动态调整检索阈值与上下文窗口，提升知识更新的准确性与时效性',
              '设计基于用户意图的检索排序模型，结合 BM25 与向量相似度优化召回结果与模型输出的相关性'
            ) +
            p('技术亮点') +
            ul(
              '在公开问答数据集上<b>将知识型问题回答准确率提升 12%，幻觉率降低 8%</b>',
              '检索与生成端到端优化，<b>单条查询响应控制在 2 秒以内，支持百万级文档秒级检索</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '具备扎实的大模型与多模态算法研究功底，善于将科研成果高效落地为业务可用的系统方案' })
      ])
    ]
  })
}

/** 测试开发校招：测试理论 + 自动化框架 + 压测成果 */
export function createTestCampusSample(): Resume {
  return makeResume({
    templateId: 'test-campus',
    jobTitle: '测试开发工程师',
    extra: '应届生 · 南昌',
    themeColor: '#ea580c',
    customFields: [eduField('某某大学 · 本科 · 2026 届')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 本科',
          startDate: '2022.09',
          endDate: '2026.06',
          content: ul('GPA 3.6/4.0，专业排名前 15%，获校级一等奖学金', '英语：CET-6（520 分）')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '掌握软件测试全生命周期与基本理论，熟悉黑盒/白盒测试方法，能熟练运用等价类划分、边界值分析与场景法编写测试用例' }),
        item({ content: '熟悉 Python 编程，具备良好的面向对象开发基础，能编写日常测试辅助脚本' }),
        item({ content: '熟悉接口自动化测试流程，掌握 Requests 与 Pytest；熟悉 Web 自动化，能熟练使用 Selenium 或 Playwright 编写自动化脚本' }),
        item({ content: '熟练使用 Postman 与 Apifox 进行接口验证与参数联调，掌握 JMeter 开展基础接口压力测试' }),
        item({ content: '熟悉 MySQL 多表联查与 SQL 编写，熟悉 Linux 常用命令，了解 Docker 与 Jenkins 持续集成流程' })
      ]),
      mod('work', '实习经历', [
        item({
          title: '某头部安全科技公司',
          subtitle: '测试开发实习生',
          startDate: '2025.06',
          endDate: '2025.09',
          content:
            p('个人职责') +
            ul(
              '参与内部核心测试框架的日常维护，协助开发基于多线程并发的测试调度脚本',
              '协助搭建压测环境，编写基于多线程与消息队列的压力测试方案，运用 Shell 脚本监控服务器核心指标'
            ) +
            p('工作成果') +
            ul(
              '引入线程池机制优化串行测试脚本，实现专项任务并行执行，<b>整体回归效率显著提升</b>',
              '协助开发基于 Redis 的测试数据调度工具，Lua 脚本保障读取原子性，解决多任务并发脏读问题',
              '压测摸底中<b>精准定位 2 处严重数据库慢查询瓶颈</b>，为架构优化提供数据支撑'
            )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '优选生鲜社区团购平台',
          subtitle: '测试开发',
          startDate: '2025.01',
          endDate: '2025.06',
          content:
            p('项目简介', '社区团购全端应用，涵盖用户小程序、团长端 App 与后台供应链管理系统，业务覆盖秒杀、订单履约与佣金结算等复杂链路。') +
            p('技术栈', 'Python、Pytest、Appium、JMeter、Charles、MySQL') +
            p('项目职责') +
            ul(
              '参与核心秒杀业务测试需求评审，编写覆盖用户下单与库存扣减的<b>测试用例 150 余条</b>',
              '基于 Appium 与 PO 设计模式搭建移动端 UI 自动化框架，编写并维护 <b>50 个核心业务场景</b>的自动化脚本'
            ) +
            p('项目成果') +
            ul(
              '自动化脚本覆盖 App 端核心回归链路，<b>发版前回归测试从半天缩短至 1 小时内</b>',
              '压测期间定位库存预扣减接口性能瓶颈，协助开发<b>将响应时间从 3 秒优化至 500 毫秒以内</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '严谨细致，质量意识强，善于从用户视角定位问题并推动闭环修复，能高效协同开发保障交付质量' })
      ])
    ]
  })
}

/** Java 高级社招（双栏版式）：侧栏技能/教育/自评，主栏履历与项目 */
export function createJavaSidebarSeniorSample(): Resume {
  return makeResume({
    templateId: 'sidebar',
    jobTitle: 'Java高级后端工程师',
    extra: '5年经验 · 南昌',
    themeColor: '#111827',
    customFields: [eduField('某某大学（本科-2020.6 毕业）'), linkField('github.com/zhangsan')],
    modules: [
      mod('skills', '专业技能', [
        item({ content: '精通 Java 并发编程与 JVM 调优，有丰富的线上 OOM、GC 与线程池问题排障经验' }),
        item({ content: '精通 MySQL 索引优化、事务隔离与分库分表方案，具备千万级表慢 SQL 治理经验' }),
        item({ content: '精通 Spring Cloud 微服务生态，熟悉服务注册、配置中心、限流降级与链路追踪，具备架构演进经验' }),
        item({ content: '精通 Redis 高可用架构与分布式锁实战，熟悉 Kafka/RocketMQ 可靠投递与堆积治理' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '高级后端开发工程师',
          startDate: '2023.05',
          endDate: '至今',
          content: ul(
            '主导订单与支付模块微服务架构演进，完成大促容量规划与压测方案',
            '对订单表分库分表改造，<b>支撑 500 万笔订单峰值写入</b>',
            '引入分段锁攻克分布式锁瓶颈，<b>秒杀接口吞吐量提升 40%</b>',
            '制定团队代码规范与 Code Review 机制，带教 3 名初中级研发'
          )
        }),
        item({
          title: '某高速成长独角兽企业',
          subtitle: 'Java研发工程师',
          startDate: '2020.07',
          endDate: '2023.03',
          content: ul(
            '负责消息触达与用户激励系统后端研发，对接海量用户签到与积分发放业务',
            '协助搭建监控大盘与故障应急响应预案，参与多次容量压测与扩容'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '全链路高并发交易营销平台',
          subtitle: '后端负责人',
          startDate: '2024.01',
          endDate: '2026.01',
          content:
            p('项目介绍', '支撑上亿级用户的电商核心交易平台，涵盖秒杀、分布式库存扣减与营销卡券叠加结算等核心场景。') +
            p('技术亮点') +
            ul(
              'Nginx+Lua 前置限流与 Redis 热点预热的多级缓存防线，<b>抗住每秒 10 万次峰值查询</b>',
              'Redis+Lua 原子预扣减结合 MQ 异步落盘，<b>交易吞吐量提升 5 倍以上</b>',
              'RocketMQ 事务消息 + 本地消息表 + 定时补偿，<b>最终一致性达 99.99%</b>'
            )
        })
      ]),
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 本科',
          startDate: '2016.09',
          endDate: '2020.06',
          content: ul('GPA 3.5/4.0，获校级奖学金')
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '5 年高并发交易场景后端经验，擅长架构设计与性能调优，注重工程质量与团队协作' })
      ])
    ]
  })
}

/** Go 高级社招（时光轴版式）：并发/微服务/云原生量化成果 */
export function createGoSeniorSample(): Resume {
  return makeResume({
    templateId: 'timeline',
    jobTitle: 'Go高级开发工程师',
    extra: '5年经验 · 南昌',
    themeColor: '#0d9488',
    customFields: [eduField('某某大学（本科-2020.6 毕业）')],
    modules: [
      mod('skills', '专业技能', [
        item({ content: '精通 Go 语言特性与标准库，深入理解 goroutine 调度、内存模型与并发编程，具备线上性能调优与故障排查经验' }),
        item({ content: '精通微服务架构，熟练使用 Gin、Gorm、Kitex 等 Go 生态组件，熟悉服务注册发现、限流降级与链路追踪等治理能力' }),
        item({ content: '精通 MySQL、Redis、MongoDB 等存储系统，具备分库分表、缓存雪崩治理与慢 SQL 优化经验；熟悉 Kafka、RabbitMQ' }),
        item({ content: '熟悉 Docker、K8s 与 CI/CD 流程，具备云原生应用开发与部署经验，能设计高并发、高可用服务' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '高级 Go 后端开发工程师',
          startDate: '2023.05',
          endDate: '至今',
          content: ul(
            '主导电商交易系统微服务架构演进，<b>支撑每秒 10 万+ 订单处理</b>',
            '制定 Go 代码规范与 Code Review 机制，<b>单元测试覆盖率提升至 80%，线上故障率降低 30%</b>',
            '重构核心服务为异步化架构，<b>核心接口 P99 延迟从 200ms 降至 50ms</b>',
            '带领 3 名初级研发攻克分布式锁瓶颈，<b>秒杀接口吞吐量提升 40%</b>'
          )
        }),
        item({
          title: '某高速成长独角兽企业',
          subtitle: 'Go研发工程师',
          startDate: '2020.07',
          endDate: '2023.03',
          content: ul(
            '负责泛娱乐社交平台用户激励与消息触达系统后端研发',
            '开发用户行为数据采集与上报服务，优化序列化与批量上报，<b>带宽占用降低 40%</b>'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '全链路高并发交易营销平台',
          subtitle: '后端负责人',
          startDate: '2024.01',
          endDate: '2026.01',
          content:
            p('项目介绍', '支撑上亿级用户的电商核心交易平台，涵盖秒杀、分布式库存扣减与营销卡券叠加结算等核心场景。') +
            p('个人职责') +
            ul(
              '负责秒杀网关层限流降级设计与库存安全扣减方案落地',
              '主导订单支付成功后的履约状态机开发，处理跨微服务数据最终一致性问题'
            ) +
            p('技术亮点') +
            ul(
              'Nginx+Lua 前置限流、Redis 集群预热热点商品，<b>抗住每秒 10 万+ 峰值查询</b>',
              'Redis+Lua 原子预扣减，消息队列异步驱动 MySQL 落盘，<b>交易吞吐量提升 5 倍以上</b>',
              'RocketMQ 事务消息结合本地消息表与定时重试，<b>实现 99.99% 数据最终一致性</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '5 年 Go 后端经验，擅长高并发微服务架构设计与性能调优，能快速定位并解决线上复杂问题' }),
        item({ content: '注重工程化与团队协作，善于通过规范与流程提升研发效率，具备从 0 到 1 搭建核心业务系统的实战经验' })
      ])
    ]
  })
}

/** Linux C++ 社招（时光轴版式）：高性能网络/存储/分布式成果 */
export function createCppSeniorSample(): Resume {
  return makeResume({
    templateId: 'cpp-senior',
    jobTitle: 'Linux C/C++开发工程师',
    extra: '5年经验 · 南昌',
    themeColor: '#b91c1c',
    customFields: [eduField('某某大学（本科-2020.6 毕业）')],
    modules: [
      mod('skills', '专业技能', [
        item({ content: '精通 C++11/14/17，深入理解内存模型与多线程编程，具备线上内存泄漏、死锁排查与性能调优经验' }),
        item({ content: '精通 Linux 系统与网络编程，熟练使用 epoll、IPC 与调试/性能工具，能独立进行系统级瓶颈分析与优化' }),
        item({ content: '熟悉 CMake 与 CI/CD 流程，熟练使用 GDB、Valgrind 等调试与性能分析工具' }),
        item({ content: '熟悉 Nginx、Redis、LevelDB 等常见开源组件，能进行二次开发与定制化改造' }),
        item({ content: '具备扎实的算法与数据结构功底，熟悉分布式系统基础，能设计高并发、高可用服务' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '高级 Linux C++ 开发工程师',
          startDate: '2023.05',
          endDate: '至今',
          content: ul(
            '主导分布式消息队列架构演进，<b>支撑每秒 10 万+ 消息吞吐</b>',
            '制定代码规范与 Code Review 机制，<b>线上故障率降低 30%</b>',
            '重构核心服务为异步非阻塞架构，<b>P99 延迟从 200ms 降至 50ms</b>',
            '带领团队优化日志系统，<b>吞吐量提升 2 倍以上</b>'
          )
        }),
        item({
          title: '某高速成长独角兽企业',
          subtitle: 'C++研发工程师',
          startDate: '2020.07',
          endDate: '2023.03',
          content: ul(
            '负责实时音视频传输网关研发，保障百万级同时在线稳定性',
            '搭建底层网络库并完成性能调优，参与制定故障应急响应预案'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '高并发社交消息链路',
          subtitle: 'C++ 核心开发',
          startDate: '2024.01',
          endDate: '2026.01',
          content:
            p('项目介绍', '支撑上亿级用户的社交消息链路，覆盖单聊、群聊与离线同步等场景，面临高并发、低延迟与一致性挑战。') +
            p('技术亮点') +
            ul(
              '网络层零拷贝 + 业务层无锁队列/协程调度，<b>抗住每秒 50 万+ 峰值 QPS</b>',
              '自研 LevelDB 持久化队列，<b>吞吐量提升 5 倍以上</b>',
              'Raft 协议保障元数据强一致，<b>消息可靠性达 99.999%</b>'
            )
        }),
        item({
          title: '高性能网络代理网关',
          subtitle: 'C++ 核心开发',
          startDate: '2025.01',
          endDate: '2025.07',
          content:
            p('项目介绍', '面向高并发场景的四层/七层网络代理网关，提供百万级连接承载、低延迟转发与流量安全防护能力。') +
            p('技术亮点') +
            ul(
              'epoll ET + 共享内存池实现百万级并发连接，<b>单台服务器 QPS 突破 80 万</b>',
              '无锁哈希表与原子操作优化会话查找，<b>转发延迟 P99 控制在 2ms 以内</b>',
              '多级限流与熔断机制，<b>成功抵御峰值流量达 10Gbps 的 DDoS 攻击</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '5 年 Linux C++ 开发经验，擅长高并发、低延迟服务的架构设计与性能调优，能快速定位并解决线上复杂问题' })
      ])
    ]
  })
}

/** 前端社招 AI 方向（双栏版式）：Vue3/React + 大模型应用落地 */
export function createFrontendSeniorSample(): Resume {
  return makeResume({
    templateId: 'fe-senior',
    jobTitle: '前端开发工程师（AI应用方向）',
    extra: '3年经验 · 南昌',
    customFields: [eduField('某某大学（本科-2022.6 毕业）'), linkField('github.com/zhangsan')],
    modules: [
      mod('skills', '专业技能', [
        item({ content: '精通 HTML5/CSS3/JavaScript，熟练使用 Vue3、React 框架，掌握 Pinia、Redux 等状态管理工具' }),
        item({ content: '熟练使用 Webpack、Vite 构建工具，掌握 ES6+ 语法，熟悉 Git 版本控制与 CI/CD 流程' }),
        item({ content: '熟悉大模型 API 对接与 RAG 前端交互开发，能实现智能问答、内容生成等 AI 场景界面与交互' }),
        item({ content: '掌握 Element Plus、Ant Design 等 UI 组件库，懂跨端适配，具备前端性能优化经验' }),
        item({ content: '了解前端监控与异常排查，能独立解决线上前端问题' })
      ]),
      mod('work', '工作经历', [
        item({
          title: '某某科技有限公司',
          subtitle: '前端开发工程师（AI应用方向）',
          startDate: '2024.07',
          endDate: '至今',
          content: ul(
            '负责智能问答、内容生成工具与知识库平台等 AI 类前端项目全流程开发',
            '对接大模型 API 与后端接口，优化请求与加载状态，解决前端缓存与 Token 管控等痛点',
            '负责前端工程化优化，规范代码并提升打包效率'
          )
        }),
        item({
          title: '某互联网公司',
          subtitle: '前端开发工程师',
          startDate: '2022.07',
          endDate: '2024.06',
          content: ul(
            '负责企业级后台管理系统与移动端 H5 开发，使用 Vue2/Vue3 完成页面开发与交互实现',
            '参与前端代码规范制定，优化页面性能，提升系统加载速度与用户体验'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '企业级智能知识库问答平台',
          subtitle: '前端开发',
          startDate: '2024.01',
          endDate: '2026.01',
          link: 'https://github.com/zhangsan/rag-web',
          content:
            p('项目介绍', '基于 RAG 架构的企业内部知识库问答系统，支持多格式文档解析与知识入库，提供准确的业务咨询服务。') +
            p('技术亮点') +
            ul(
              '使用 Vue3 + Element Plus 搭建页面，实现文档上传、切片预览与问答交互等核心功能',
              '对接后端 RAG 接口与大模型 API，处理加载状态与异常提示，优化问答响应体验',
              '实现文档预览懒加载与问答结果缓存，<b>页面加载速度提升 40%，用户使用率 90%+</b>'
            )
        }),
        item({
          title: 'AI 对话助手与智能客服平台',
          subtitle: 'AI应用开发',
          startDate: '2025.01',
          endDate: '2026.01',
          content:
            p('项目介绍', '面向运营与客服场景的 AI 对话助手平台，支持多场景内容创作与智能问答。') +
            p('技术亮点') +
            ul(
              '使用 React + Ant Design 开发前端页面，实现创作模板选择、参数配置与内容预览/导出等功能',
              '对接后端 Python 接口，实现 AI 内容生成异步请求与任务状态展示',
              '优化前端请求缓存策略，<b>日均使用量 5000+，帮助运营提升 80% 创作效率</b>'
            )
        })
      ]),
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '计算机科学与技术 · 本科',
          startDate: '2018.09',
          endDate: '2022.06',
          content: ul('GPA 3.6/4.0，获校级奖学金')
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '3 年前端开发经验，兼具 AI 应用开发与业务落地能力，熟悉大模型调用与 RAG 全流程' }),
        item({ content: '能独立负责 AI 前端项目全流程开发，兼顾交互体验与系统稳定性' })
      ])
    ]
  })
}

/** 运营/市场校招（清新分区版式）：增长/活动/数据成果 */
export function createOpsCampusSample(): Resume {
  return makeResume({
    templateId: 'ops-campus',
    jobTitle: '产品运营专员',
    extra: '应届生 · 南昌',
    themeColor: '#ea580c',
    customFields: [eduField('某某大学 · 本科 · 2026 届')],
    modules: [
      mod('education', '教育背景', [
        item({
          title: '某某大学',
          subtitle: '市场营销 · 本科',
          startDate: '2022.09',
          endDate: '2026.06',
          content: ul('GPA 3.8/4.0，专业排名前 8%，获校级一等奖学金、优秀学生干部', '英语：CET-6（560 分），具备良好的英文文档阅读与跨文化沟通能力')
        })
      ]),
      mod('skills', '专业技能', [
        item({ content: '熟悉用户运营、内容运营、活动运营全流程，能独立完成从策划、执行到复盘的闭环工作' }),
        item({ content: '掌握 Excel、SQL、Python 数据分析基础，可进行用户分层、漏斗转化、ROI 核算与数据驱动决策' }),
        item({ content: '熟练使用剪映、Canva、135 编辑器等工具，具备图文与短视频内容的策划产出能力' }),
        item({ content: '了解小红书、抖音、微信公众号等新媒体平台的流量规则与增长玩法，擅长社群运营与用户增长' }),
        item({ content: '具备良好的沟通协调与项目推进能力，能高效对接产品、研发、设计等跨部门团队' })
      ]),
      mod('work', '实习经历', [
        item({
          title: '某头部互联网公司',
          subtitle: '运营实习生',
          startDate: '2025.06',
          endDate: '至今',
          content: ul(
            '负责社区内容生态运营，通过“选题库 + 创作者扶持计划”优化内容供给，<b>优质内容占比提升 22%，社区互动率提升 15%</b>',
            '主导策划“春日种草季”主题活动，设计内容创作 + 话题挑战 + KOL 联动玩法，<b>话题曝光量破 500 万，带动新用户增长 30%</b>',
            '搭建用户分层运营体系，制定差异化触达策略，<b>核心用户留存率提升 18%，沉默用户唤醒率提升 25%</b>'
          )
        })
      ]),
      mod('projects', '项目经历', [
        item({
          title: '校园生活服务平台',
          subtitle: '运营负责人',
          startDate: '2023.01',
          endDate: '2023.12',
          content:
            p('项目简介', '面向高校学生的校园生活服务平台，涵盖外卖代取、二手交易、拼车出行与校园资讯等功能。') +
            p('个人职责') +
            ul(
              '负责平台整体运营策略制定与落地，主导用户增长、内容生态与商家合作三大核心模块',
              '策划执行“开学季”“毕业季”等系列活动，负责活动策划、资源协调与数据复盘全流程'
            ) +
            p('项目成果') +
            ul(
              '设计“邀请有礼 + 新人专享”裂变玩法，联合校园 KOL 与社团合作，<b>3 个月用户量翻 2.5 倍，日活突破 3000 人</b>',
              '搭建“商家评级 + 流量扶持”体系，<b>引入优质商家 50+，平台 GMV 月均增长 40%</b>',
              '优化首页推荐与活动入口位置，<b>核心转化漏斗提升 20%，活动 ROI 达 1:4.5</b>'
            )
        })
      ]),
      mod('selfEvaluation', '自我评价', [
        item({ content: '数据敏感度高，执行力强，善于通过精细化运营驱动业务增长，具备良好的跨部门协作与复盘总结能力' })
      ])
    ]
  })
}

/** 模板 id → 场景完整示例。classic 使用默认示例（createSampleResume） */
export const TEMPLATE_SAMPLES: Record<string, () => Resume> = {
  classic: createSampleResume,
  modern: createJavaSeniorSample,
  minimal: createGeneralSample,
  banner: createJavaMasterCampusSample,
  fresh: createFrontendCampusSample,
  'ai-campus': createAiCampusSample,
  'test-campus': createTestCampusSample,
  sidebar: createJavaSidebarSeniorSample,
  timeline: createGoSeniorSample,
  'cpp-senior': createCppSeniorSample,
  'fe-senior': createFrontendSeniorSample,
  'ops-campus': createOpsCampusSample
}