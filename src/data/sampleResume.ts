import type { Resume } from '@/types/resume'
import { DEFAULT_STYLE, uid } from '@/types/resume'

/** 每次调用返回全新对象，避免共享引用。
 *  默认示例为完整校招简历：教育/技能/实习/项目/自评，量化成果 + 结构化项目段落 */
export function createSampleResume(): Resume {
  return {
    templateId: 'classic',
    basics: {
      name: '张三',
      phone: '138-0000-8888',
      email: 'zhangsan@example.com',
      jobTitle: 'Java后端开发工程师',
      avatar: '',
      extra: '应届生 · 南昌',
      customFields: [{ id: uid(), icon: 'education', value: '某某大学 · 本科 · 2026 届' }]
    },
    modules: [
      {
        id: uid(),
        type: 'education',
        title: '教育背景',
        items: [
          {
            id: uid(),
            title: '某某大学',
            subtitle: '计算机科学与技术 · 本科',
            startDate: '2022.09',
            endDate: '2026.06',
            content:
              '<ul><li>GPA 3.7/4.0，专业排名前 10%，校级一等奖学金、优秀学生干部</li><li>英语：CET-4（590 分）、CET-6（540 分），可流畅阅读英文技术文档</li></ul>'
          }
        ]
      },
      {
        id: uid(),
        type: 'skills',
        title: '专业技能',
        items: [
          { id: uid(), content: '熟悉 Java 核心 API 与集合框架，了解常用集合底层数据结构，熟悉多线程基础与常见线程安全问题' },
          { id: uid(), content: '熟悉 Spring Boot、MyBatis，了解 Spring 的 IOC 与 AOP 设计思想及常见应用场景' },
          { id: uid(), content: '熟悉 MySQL 常用 SQL 编写与执行计划分析，了解事务与索引基本原理，有慢查询优化经验' },
          { id: uid(), content: '熟悉 Redis 常见数据类型与缓存场景，了解缓存穿透、缓存击穿与缓存雪崩等基本概念' },
          { id: uid(), content: '熟悉 TCP/IP 网络基础与 Linux 常用命令，能独立完成日常服务部署与问题排查' }
        ]
      },
      {
        id: uid(),
        type: 'work',
        title: '实习经历',
        items: [
          {
            id: uid(),
            title: '某头部电商互联网公司',
            subtitle: '后端开发实习生',
            startDate: '2025.06',
            endDate: '2025.09',
            content:
              '<p><b>个人职责：</b>参与营销卡券模块后端开发，负责发券与核销链路的接口开发与性能优化。</p>' +
              '<ul><li>引入 MQ 将耗时的短信与站内信逻辑从主链路异步剥离，<b>发券核心接口平均响应时间从 300ms 降至 50ms 以内</b></li>' +
              '<li>针对第三方超时导致的发券失败，基于 XXL-Job 设计定时重试补偿机制，<b>大促期间整体发券成功率提升至 99.9% 以上</b></li>' +
              '<li>针对卡券明细查询慢 SQL 报警，分析执行计划并建立联合索引，<b>慢查询耗时降低 80%</b></li></ul>'
          }
        ]
      },
      {
        id: uid(),
        type: 'projects',
        title: '项目经历',
        items: [
          {
            id: uid(),
            title: '校园二手交易平台',
            subtitle: '后端负责人',
            startDate: '2025.03',
            endDate: '2025.08',
            content:
              '<p><b>项目简介：</b>面向高校学生的二手交易平台，涵盖商品发布、搜索、私信与订单管理，服务某高校 2000+ 注册用户。</p>' +
              '<p><b>技术栈：</b>Spring Boot、MySQL、Redis、MyBatis-Plus</p>' +
              '<p><b>技术亮点：</b></p>' +
              '<ul><li>设计商品发布与搜索接口，引入 Redis 缓存热点数据，<b>接口响应缩短 50%</b></li>' +
              '<li>基于拦截器 + JWT 实现登录鉴权，支撑 <b>2000+ 注册用户</b>的日常访问</li>' +
              '<li>统一异常处理与参数校验规范接口返回，降低前后端联调成本</li></ul>'
          },
          {
            id: uid(),
            title: '在线营销抽奖平台',
            subtitle: '后端开发',
            startDate: '2024.05',
            endDate: '2025.01',
            content:
              '<p><b>项目简介：</b>为营销活动提供抽奖支持的在线平台，涵盖活动配置、奖品管理、用户抽奖与中奖记录派发完整业务闭环。</p>' +
              '<p><b>技术栈：</b>Spring Boot、MyBatis、MySQL、Redis</p>' +
              '<p><b>技术亮点：</b></p>' +
              '<ul><li>Redis 预热缓存活动详情与奖品列表等高频数据，<b>核心接口响应时间缩短一半以上</b></li>' +
              '<li>Redis 递减指令预扣减库存防止高并发超发，保证数据一致性的同时大幅提升吞吐量</li>' +
              '<li>Redis 互斥锁限制单用户频繁请求，唯一业务流水号保证兑奖幂等，杜绝重复派发</li></ul>'
          }
        ]
      },
      {
        id: uid(),
        type: 'selfEvaluation',
        title: '自我评价',
        items: [
          { id: uid(), content: '乐于接受挑战，实习中主动跟进慢 SQL、接口性能等问题并完成优化，善于复盘总结经验' },
          { id: uid(), content: '沟通协作能力强，做事踏实靠谱，能快速适应开发节奏并高效完成交付任务' }
        ]
      }
    ],
    style: { ...DEFAULT_STYLE }
  }
}