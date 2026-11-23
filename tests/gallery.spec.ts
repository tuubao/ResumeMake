import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TemplateGallery from '@/views/TemplateGallery.vue'
import EditorView from '@/views/EditorView.vue'
import { useResumeStore } from '@/stores/resume'
import { TEMPLATES } from '@/templates'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

async function mountGallery() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: TemplateGallery },
      { path: '/editor', component: EditorView }
    ]
  })
  router.push('/')
  await router.isReady()
  const wrapper = mount(TemplateGallery, { global: { plugins: [router] } })
  return { wrapper, router }
}

describe('模板中心', () => {
  it('展示 12 套模板卡片与岗位标签', async () => {
    const { wrapper } = await mountGallery()
    expect(TEMPLATES.length).toBe(12)
    for (const t of TEMPLATES) {
      const card = wrapper.find(`[data-testid="template-card-${t.id}"]`)
      expect(card.exists()).toBe(true)
      for (const tag of t.tags) {
        expect(card.text()).toContain(tag)
      }
    }
  })

  it('分类筛选保持既有行为', async () => {
    const { wrapper } = await mountGallery()
    await wrapper.find('[data-testid="filter-社招"]').trigger('click')
    expect(wrapper.find('[data-testid="template-card-modern"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="template-card-classic"]').exists()).toBe(false)
    await wrapper.find('[data-testid="filter-全部"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="template-card-"]').length).toBe(12)
  })

  it('使用此模板：仅切换 templateId，不改动用户内容', async () => {
    const { wrapper, router } = await mountGallery()
    const store = useResumeStore()
    store.updateBasics({ name: '我的内容' })
    await wrapper.find('[data-testid="use-template-sidebar"]').trigger('click')
    await flushPromises()
    expect(store.resume.templateId).toBe('sidebar')
    expect(store.resume.basics.name).toBe('我的内容')
    expect(router.currentRoute.value.path).toBe('/editor')
  })

  it('使用示例内容：确认后载入场景示例并进入编辑器', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { wrapper, router } = await mountGallery()
    const store = useResumeStore()
    await wrapper.find('[data-testid="use-sample-banner"]').trigger('click')
    await flushPromises()
    expect(confirmSpy).toHaveBeenCalled()
    expect(store.resume.templateId).toBe('banner')
    expect(store.resume.modules.some((m) => m.title === '实习经历')).toBe(true)
    expect(store.resume.modules.find((m) => m.type === 'education')!.items.length).toBe(2)
    expect(router.currentRoute.value.path).toBe('/editor')
    confirmSpy.mockRestore()
  })

  it('使用示例内容：取消确认不改动数据与路由', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { wrapper, router } = await mountGallery()
    const store = useResumeStore()
    store.updateBasics({ name: '我的内容' })
    await wrapper.find('[data-testid="use-sample-banner"]').trigger('click')
    await flushPromises()
    expect(store.resume.basics.name).toBe('我的内容')
    expect(store.resume.templateId).toBe('classic')
    expect(router.currentRoute.value.path).toBe('/')
    confirmSpy.mockRestore()
  })
})