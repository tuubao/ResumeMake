import type { Component } from 'vue'
import type { Resume } from '@/types/resume'
import ClassicTemplate from './ClassicTemplate.vue'
import ModernTemplate from './ModernTemplate.vue'
import MinimalTemplate from './MinimalTemplate.vue'
import BannerTemplate from './BannerTemplate.vue'
import SidebarTemplate from './SidebarTemplate.vue'
import TimelineTemplate from './TimelineTemplate.vue'
import FreshTemplate from './FreshTemplate.vue'
import { TEMPLATE_SAMPLES } from '@/data/samples'

export interface TemplateMeta {
  id: string
  name: string
  description: string
  category: '校招' | '社招' | '通用'
  /** 岗位/场景标签，模板中心展示用 */
  tags: string[]
  component: Component
  /** 模板自带的完整场景示例（仅「使用示例内容」时载入，切换模板不影响用户数据） */
  sample: () => Resume
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic', name: '经典蓝', description: '稳重居中版式，教育背景前置，校招生首选', category: '校招', tags: ['Java后端', '校招', '实习'], component: ClassicTemplate, sample: TEMPLATE_SAMPLES.classic },
  { id: 'modern', name: '现代青', description: '清爽撞色版式，突出技能与项目成果', category: '社招', tags: ['Java后端', '社招'], component: ModernTemplate, sample: TEMPLATE_SAMPLES.modern },
  { id: 'minimal', name: '极简黑', description: '黑白极简版式，内容为王，全岗位通用', category: '通用', tags: ['通用', '全岗位'], component: MinimalTemplate, sample: TEMPLATE_SAMPLES.minimal },
  { id: 'banner', name: '色块横幅', description: '主题色横幅头部 + 色块标题分区，硕本双学历校招叙事', category: '校招', tags: ['Java后端', '校招', '硕士'], component: BannerTemplate, sample: TEMPLATE_SAMPLES.banner },
  { id: 'fresh', name: '清新分区', description: '浅色色块分区设计，清爽活泼，前端校招首选', category: '校招', tags: ['前端开发', '校招', '实习'], component: FreshTemplate, sample: TEMPLATE_SAMPLES.fresh },
  { id: 'ai-campus', name: '智研校招', description: '教育-技能-项目-科研论文黄金结构，算法岗专属', category: '校招', tags: ['大模型算法', '校招', '科研'], component: BannerTemplate, sample: TEMPLATE_SAMPLES['ai-campus'] },
  { id: 'test-campus', name: '测开校招', description: '色块高亮分区，职责与成果拆分，测开岗校招专属', category: '校招', tags: ['测试开发', '校招', 'Python'], component: FreshTemplate, sample: TEMPLATE_SAMPLES['test-campus'] },
  { id: 'sidebar', name: '商务双栏', description: '左侧栏技能/教育/自评 + 主栏履历项目，商务稳重', category: '社招', tags: ['Java后端', '社招', '高级'], component: SidebarTemplate, sample: TEMPLATE_SAMPLES.sidebar },
  { id: 'timeline', name: '时光轴', description: '左对齐头部 + 经历时间轴点缀，履历脉络一目了然', category: '社招', tags: ['Go后端', '社招', '高级'], component: TimelineTemplate, sample: TEMPLATE_SAMPLES.timeline },
  { id: 'cpp-senior', name: '硬核时光轴', description: '时间轴版式，突出高性能/分布式硬核成果', category: '社招', tags: ['C++', '社招', 'Linux'], component: TimelineTemplate, sample: TEMPLATE_SAMPLES['cpp-senior'] },
  { id: 'fe-senior', name: '前端双栏', description: '双栏版式，AI 应用方向前端社招，技能与履历并重', category: '社招', tags: ['前端开发', '社招', 'AI应用'], component: SidebarTemplate, sample: TEMPLATE_SAMPLES['fe-senior'] },
  { id: 'ops-campus', name: '运营校招', description: '清新分区版式，增长/活动/数据成果量化呈现', category: '校招', tags: ['运营', '市场', '校招'], component: FreshTemplate, sample: TEMPLATE_SAMPLES['ops-campus'] }
]

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}