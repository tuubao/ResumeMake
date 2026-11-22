import type { Resume } from '@/types/resume'
import { DEFAULT_STYLE, uid } from '@/types/resume'

/** 每次调用返回全新对象，避免共享引用 */
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
            content: '<ul><li>GPA 3.7/4.0，专业排名前 10%</li><li>校级一等奖学金、优秀学生干部</li></ul>'
          }
        ]
      },
      {
        id: uid(),
        type: 'skills',
        title: '专业技能',
        items: [
          { id: uid(), content: '熟悉 Java 核心 API 与集合框架，了解多线程基础与常见线程安全问题' },
          { id: uid(), content: '熟悉 Spring Boot、MyBatis，了解 IOC 与 AOP 设计思想' },
          { id: uid(), content: '熟悉 MySQL 常用 SQL 编写与索引原理，了解 Redis 常见缓存场景' }
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
              '<p><b>技术栈：</b>Spring Boot、MySQL、Redis</p><ul><li>设计商品发布与搜索接口，引入 Redis 缓存热点数据，接口响应缩短 50%</li><li>基于拦截器 + JWT 实现登录鉴权，支撑 2000+ 注册用户</li></ul>'
          }
        ]
      },
      {
        id: uid(),
        type: 'selfEvaluation',
        title: '自我评价',
        items: [
          { id: uid(), content: '热爱技术，具备扎实的计算机基础与良好的自驱力，善于团队协作与沟通。' }
        ]
      }
    ],
    style: { ...DEFAULT_STYLE }
  }
}