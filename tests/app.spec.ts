import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '@/App.vue'

describe('应用骨架', () => {
  it('App 可正常挂载', async () => {
    const { createRouter, createMemoryHistory } = await import('vue-router')
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>ok</div>' } }]
    })
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [createPinia(), router] } })
    expect(wrapper.html()).toContain('ok')
  })
})