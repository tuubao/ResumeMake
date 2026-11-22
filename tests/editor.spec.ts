import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import RichText from '@/components/editor/RichText.vue'
import BasicsForm from '@/components/editor/BasicsForm.vue'
import StylePanel from '@/components/editor/StylePanel.vue'
import ModuleEditor from '@/components/editor/ModuleEditor.vue'
import ItemEditor from '@/components/editor/ItemEditor.vue'
import EditorView from '@/views/EditorView.vue'
import { useResumeStore } from '@/stores/resume'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('RichText', () => {
  it('输入时向父组件同步 HTML', async () => {
    const wrapper = mount(RichText, { props: { modelValue: '<p>hi</p>' } })
    const editable = wrapper.find('[contenteditable]')
    expect(editable.element.innerHTML).toBe('<p>hi</p>')
    editable.element.innerHTML = '<p>changed</p>'
    await editable.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['<p>changed</p>'])
  })

  it('外部值变化时更新编辑区', async () => {
    const wrapper = mount(RichText, { props: { modelValue: 'a' } })
    await wrapper.setProps({ modelValue: '<b>b</b>' })
    expect(wrapper.find('[contenteditable]').element.innerHTML).toBe('<b>b</b>')
  })
})

describe('BasicsForm', () => {
  it('输入同步到 store', async () => {
    const store = useResumeStore()
    const wrapper = mount(BasicsForm)
    await wrapper.find('[data-field="name"]').setValue('李四')
    expect(store.resume.basics.name).toBe('李四')
  })
})

describe('StylePanel', () => {
  it('字号滑杆与主题色切换生效', async () => {
    const store = useResumeStore()
    const wrapper = mount(StylePanel)
    await wrapper.find('[data-field="fontSize"]').setValue('16')
    expect(store.resume.style.fontSize).toBe(16)
    await wrapper.find('[data-testid="swatch-#0d9488"]').trigger('click')
    expect(store.resume.style.themeColor).toBe('#0d9488')
  })
})

describe('ModuleEditor / ItemEditor', () => {
  it('添加与删除条目、删除模块', async () => {
    const store = useResumeStore()
    const module = store.resume.modules[0]
    const wrapper = mount(ModuleEditor, { props: { module } })
    await wrapper.find('[data-testid="add-item"]').trigger('click')
    expect(store.resume.modules[0].items.length).toBe(2)
    await wrapper.findAll('[data-testid="remove-item"]')[0].trigger('click')
    expect(store.resume.modules[0].items.length).toBe(1)
    const count = store.resume.modules.length
    await wrapper.find('[data-testid="remove-module"]').trigger('click')
    expect(store.resume.modules.length).toBe(count - 1)
  })

  it('教育类条目显示学校字段，技能类只显示内容', () => {
    const store = useResumeStore()
    const edu = store.resume.modules.find((m) => m.type === 'education')!
    const skills = store.resume.modules.find((m) => m.type === 'skills')!
    const eduWrapper = mount(ItemEditor, { props: { moduleId: edu.id, item: edu.items[0], type: edu.type } })
    expect(eduWrapper.text()).toContain('学校')
    const skillsWrapper = mount(ItemEditor, { props: { moduleId: skills.id, item: skills.items[0], type: skills.type } })
    expect(skillsWrapper.text()).not.toContain('学校')
    expect(skillsWrapper.find('[contenteditable]').exists()).toBe(true)
  })

  it('条目标题输入同步 store', async () => {
    const store = useResumeStore()
    const edu = store.resume.modules.find((m) => m.type === 'education')!
    const wrapper = mount(ItemEditor, { props: { moduleId: edu.id, item: edu.items[0], type: edu.type } })
    await wrapper.find('[data-field="item-title"]').setValue('清华大学')
    expect(edu.items[0].title).toBe('清华大学')
  })
})

describe('EditorView 集成', () => {
  it('编辑姓名后预览实时更新', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div/>' } }, { path: '/editor', component: EditorView }]
    })
    router.push('/editor')
    await router.isReady()
    const store = useResumeStore()
    const wrapper = mount(EditorView, { global: { plugins: [router] } })
    await wrapper.find('[data-field="name"]').setValue('王五')
    await nextTick()
    expect(wrapper.find('.resume-sheet').text()).toContain('王五')
    expect(store.resume.basics.name).toBe('王五')
  })
})