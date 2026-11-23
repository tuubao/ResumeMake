import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { CustomField, ModuleItem, ModuleType, Resume, ResumeBasics, ResumeModule, ResumeStyle, TextStyle } from '@/types/resume'
import { MODULE_TYPE_LABELS, createItem, uid } from '@/types/resume'
import { createSampleResume } from '@/data/sampleResume'
import { loadResume, saveResume } from '@/utils/storage'

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<Resume>(loadResume() ?? createSampleResume())

  // 防抖自动保存
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    resume,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => saveResume(resume.value), 400)
    },
    { deep: true }
  )

  function findModule(id: string): ResumeModule | undefined {
    return resume.value.modules.find((m) => m.id === id)
  }

  /** 切换模板只改 templateId，内容数据不动 */
  function setTemplate(id: string) {
    resume.value.templateId = id
  }

  function updateBasics(patch: Partial<ResumeBasics>) {
    Object.assign(resume.value.basics, patch)
  }

  /** 基本信息字段级字体覆盖；style 为空时移除覆盖 */
  function updateBasicStyle(key: string, style?: TextStyle) {
    const styles = { ...(resume.value.basics.styles ?? {}) }
    if (style) styles[key] = style
    else delete styles[key]
    resume.value.basics.styles = styles
  }

  function updateStyle(patch: Partial<ResumeStyle>) {
    Object.assign(resume.value.style, patch)
  }

  function addModule(type: ModuleType) {
    resume.value.modules.push({ id: uid(), type, title: MODULE_TYPE_LABELS[type], items: [createItem()] })
  }

  function removeModule(id: string) {
    resume.value.modules = resume.value.modules.filter((m) => m.id !== id)
  }

  function updateModule(id: string, patch: Partial<Omit<ResumeModule, 'id'>>) {
    const m = findModule(id)
    if (m) Object.assign(m, patch)
  }

  function addItem(moduleId: string) {
    findModule(moduleId)?.items.push(createItem())
  }

  function removeItem(moduleId: string, itemId: string) {
    const m = findModule(moduleId)
    if (m) m.items = m.items.filter((i) => i.id !== itemId)
  }

  function updateItem(moduleId: string, itemId: string, patch: Partial<ModuleItem>) {
    const item = findModule(moduleId)?.items.find((i) => i.id === itemId)
    if (item) Object.assign(item, patch)
  }

  function resetToSample() {
    resume.value = createSampleResume()
  }

  /** 载入一份完整简历（如模板自带场景示例），整体替换数据 */
  function applyResume(r: Resume) {
    resume.value = r
  }

  function addCustomField() {
    resume.value.basics.customFields.push({ id: uid(), icon: 'user', value: '' })
  }

  function removeCustomField(id: string) {
    resume.value.basics.customFields = resume.value.basics.customFields.filter((f) => f.id !== id)
  }

  function updateCustomField(id: string, patch: Partial<Omit<CustomField, 'id'>>) {
    const f = resume.value.basics.customFields.find((x) => x.id === id)
    if (f) Object.assign(f, patch)
  }

  return {
    resume,
    setTemplate,
    updateBasics,
    updateBasicStyle,
    updateStyle,
    addModule,
    removeModule,
    updateModule,
    addItem,
    removeItem,
    updateItem,
    resetToSample,
    applyResume,
    addCustomField,
    removeCustomField,
    updateCustomField
  }
})