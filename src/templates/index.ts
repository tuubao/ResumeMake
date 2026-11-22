import type { Component } from 'vue'
import ClassicTemplate from './ClassicTemplate.vue'
import ModernTemplate from './ModernTemplate.vue'
import MinimalTemplate from './MinimalTemplate.vue'

export interface TemplateMeta {
  id: string
  name: string
  description: string
  category: '校招' | '社招' | '通用'
  component: Component
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic', name: '经典蓝', description: '稳重居中版式，教育背景前置，校招生首选', category: '校招', component: ClassicTemplate },
  { id: 'modern', name: '现代青', description: '清爽撞色版式，突出技能与项目成果', category: '社招', component: ModernTemplate },
  { id: 'minimal', name: '极简黑', description: '黑白极简版式，内容为王，全岗位通用', category: '通用', component: MinimalTemplate }
]

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}