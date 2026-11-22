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

  it('工具栏提供逐字字号下拉与加粗按钮', () => {
    const wrapper = mount(RichText, { props: { modelValue: '' } })
    const select = wrapper.find('[data-testid="rich-size"]')
    expect(select.exists()).toBe(true)
    expect(select.findAll('option').length).toBeGreaterThanOrEqual(8)
    expect(wrapper.find('button[title="加粗（选中文字）"]').exists()).toBe(true)
  })
})

describe('BasicsForm', () => {
  it('输入同步到 store', async () => {
    const store = useResumeStore()
    const wrapper = mount(BasicsForm)
    await wrapper.find('[data-field="name"]').setValue('李四')
    expect(store.resume.basics.name).toBe('李四')
  })

  it('自定义信息增删改', async () => {
    const store = useResumeStore()
    const wrapper = mount(BasicsForm)
    const before = store.resume.basics.customFields.length
    await wrapper.find('[data-testid="add-custom-field"]').trigger('click')
    expect(store.resume.basics.customFields.length).toBe(before + 1)
    const inputs = wrapper.findAll('[data-field="custom-value"]')
    await inputs[inputs.length - 1].setValue('英语 CET-6')
    expect(store.resume.basics.customFields[before].value).toBe('英语 CET-6')
    const removes = wrapper.findAll('[data-testid="remove-custom-field"]')
    await removes[removes.length - 1].trigger('click')
    expect(store.resume.basics.customFields.length).toBe(before)
  })
})

describe('StylePanel', () => {
  it('字号滑杆与主题色切换生效', async () => {
    const store = useResumeStore()
    const wrapper = mount(StylePanel)
    await wrapper.find('[data-field="fontSize"]').setValue('16')
    expect(store.resume.style.fontSize).toBe(16)
    await wrapper.find('[data-field="nameSize"]').setValue('32')
    expect(store.resume.style.nameSize).toBe(32)
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

  it('自定义模块条目显示标题字段', () => {
    const store = useResumeStore()
    store.addModule('custom')
    const m = store.resume.modules.find((x) => x.type === 'custom')!
    const wrapper = mount(ItemEditor, { props: { moduleId: m.id, item: m.items[0], type: m.type } })
    expect(wrapper.text()).toContain('标题')
    expect(wrapper.find('[data-field="item-title"]').exists()).toBe(true)
  })

  it('项目经历条目显示项目地址输入并同步 store，其他类型不显示', async () => {
    const store = useResumeStore()
    const proj = store.resume.modules.find((m) => m.type === 'projects')!
    const wrapper = mount(ItemEditor, { props: { moduleId: proj.id, item: proj.items[0], type: proj.type } })
    expect(wrapper.text()).toContain('项目地址')
    await wrapper.find('[data-field="item-link"]').setValue('https://github.com/zhangsan/campus-market')
    expect(proj.items[0].link).toBe('https://github.com/zhangsan/campus-market')
    const edu = store.resume.modules.find((m) => m.type === 'education')!
    const eduWrapper = mount(ItemEditor, { props: { moduleId: edu.id, item: edu.items[0], type: edu.type } })
    expect(eduWrapper.find('[data-field="item-link"]').exists()).toBe(false)
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