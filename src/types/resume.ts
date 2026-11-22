export type ModuleType = 'education' | 'skills' | 'work' | 'projects' | 'selfEvaluation' | 'custom'

export type HeaderIcon = 'none' | 'phone' | 'mail' | 'briefcase' | 'at' | 'education' | 'location' | 'link' | 'user'

/** 头部自定义信息行条目 */
export interface CustomField {
  id: string
  icon: HeaderIcon
  value: string
}

/** 通用条目：教育/工作/项目/自定义用 title+subtitle+日期，技能/自评仅用 content */
export interface ModuleItem {
  id: string
  title?: string
  subtitle?: string
  startDate?: string
  endDate?: string
  /** 富文本 HTML（仅加粗/列表等轻量标签） */
  content?: string
}

export interface ResumeModule {
  id: string
  type: ModuleType
  title: string
  items: ModuleItem[]
}

export interface ResumeBasics {
  name: string
  phone: string
  email: string
  jobTitle: string
  /** dataURL，空串表示无头像（头部留空不占位） */
  avatar: string
  /** 一行补充信息：城市 / 工作年限等 */
  extra: string
  customFields: CustomField[]
}

export interface ResumeStyle {
  fontFamily: string
  /** 正文字号 px（IT 岗规范约 10–12pt ≈ 13–16px） */
  fontSize: number
  /** 姓名字号 px（规范约 16–24pt ≈ 21–32px） */
  nameSize: number
  themeColor: string
  lineHeight: number
  /** 页边距 mm */
  pageMargin: number
}

export interface Resume {
  templateId: string
  basics: ResumeBasics
  modules: ResumeModule[]
  style: ResumeStyle
}

export const MODULE_TYPE_LABELS: Record<ModuleType, string> = {
  education: '教育背景',
  skills: '专业技能',
  work: '工作经历',
  projects: '项目经历',
  selfEvaluation: '自我评价',
  custom: '自定义模块'
}

export const DEFAULT_STYLE: ResumeStyle = {
  fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
  fontSize: 14,
  nameSize: 26,
  themeColor: '#2563eb',
  lineHeight: 1.5,
  pageMargin: 15
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function createItem(): ModuleItem {
  return { id: uid(), title: '', subtitle: '', startDate: '', endDate: '', content: '' }
}

/** 兼容旧版存档：补齐新增字段默认值 */
export function normalizeResume(r: Resume): Resume {
  return {
    ...r,
    basics: {
      ...r.basics,
      customFields: Array.isArray(r.basics.customFields) ? r.basics.customFields : []
    },
    style: { ...DEFAULT_STYLE, ...r.style }
  }
}