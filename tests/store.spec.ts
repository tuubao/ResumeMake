import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { saveResume, loadResume } from '@/utils/storage'
import { createSampleResume } from '@/data/sampleResume'

describe('resume store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('无持久化数据时初始化示例简历', () => {
    const store = useResumeStore()
    expect(store.resume.basics.name).toBe('张三')
    expect(store.resume.modules.length).toBeGreaterThan(0)
  })

  it('优先加载已保存的简历', () => {
    const saved = createSampleResume()
    saved.basics.name = '李四'
    saveResume(saved)
    const store = useResumeStore()
    expect(store.resume.basics.name).toBe('李四')
  })

  it('切换模板不改动内容数据', () => {
    const store = useResumeStore()
    const before = JSON.parse(JSON.stringify({ basics: store.resume.basics, modules: store.resume.modules }))
    store.setTemplate('modern')
    expect(store.resume.templateId).toBe('modern')
    expect({ basics: store.resume.basics, modules: store.resume.modules }).toEqual(before)
  })

  it('模块增删与条目更新', () => {
    const store = useResumeStore()
    const count = store.resume.modules.length
    store.addModule('work')
    expect(store.resume.modules.length).toBe(count + 1)
    const work = store.resume.modules.find((m) => m.type === 'work')!
    expect(work.title).toBe('工作经历')
    expect(work.items.length).toBe(1)

    store.updateItem(work.id, work.items[0].id, { title: '某科技公司' })
    expect(work.items[0].title).toBe('某科技公司')

    store.addItem(work.id)
    expect(work.items.length).toBe(2)
    store.removeItem(work.id, work.items[0].id)
    expect(work.items.length).toBe(1)

    store.removeModule(work.id)
    expect(store.resume.modules.length).toBe(count)
  })

  it('样式与基本信息局部更新', () => {
    const store = useResumeStore()
    store.updateStyle({ fontSize: 16 })
    expect(store.resume.style.fontSize).toBe(16)
    expect(store.resume.style.themeColor).toBe('#2563eb')
    store.updateBasics({ jobTitle: '前端工程师' })
    expect(store.resume.basics.jobTitle).toBe('前端工程师')
    expect(store.resume.basics.name).toBe('张三')
  })

  it('重置恢复示例数据', () => {
    const store = useResumeStore()
    store.updateBasics({ name: '王五' })
    store.resetToSample()
    expect(store.resume.basics.name).toBe('张三')
  })

  describe('防抖自动保存', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('编辑后 400ms 自动写入 localStorage', async () => {
      const store = useResumeStore()
      store.updateBasics({ name: '赵六' })
      await nextTick()
      vi.advanceTimersByTime(500)
      expect(loadResume()?.basics.name).toBe('赵六')
    })
  })
})