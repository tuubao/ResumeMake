import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ModuleItem, ModuleType, Resume, ResumeBasics, ResumeModule, ResumeStyle } from '@/types/resume'
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

  return {
    resume,
    setTemplate,
    updateBasics,
    updateStyle,
    addModule,
    removeModule,
    updateModule,
    addItem,
    removeItem,
    updateItem,
    resetToSample
  }
})