import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TEMPLATES, getTemplate } from '@/templates'
import ResumeSheet from '@/components/ResumeSheet.vue'
import { createSampleResume } from '@/data/sampleResume'

describe('模板渲染', () => {
  for (const tpl of TEMPLATES) {
    it(`${tpl.name}：渲染基本信息与全部模块`, () => {
      const resume = createSampleResume()
      const wrapper = mount(tpl.component, { props: { resume } })
      const text = wrapper.text()
      expect(text).toContain('张三')
      expect(text).toContain('138-0000-8888')
      expect(text).toContain('zhangsan@example.com')
      expect(text).toContain('Java后端开发工程师')
      for (const m of resume.modules) {
        expect(text).toContain(m.title)
      }
      expect(text).toContain('某某大学')
      expect(text).toContain('2022.09 - 2026.06')
      expect(text).toContain('校园二手交易平台')
      expect(wrapper.findAll('.resume-module').length).toBe(resume.modules.length)
    })
  }

  it('头像存在时渲染 img', () => {
    const resume = createSampleResume()
    resume.basics.avatar = 'data:image/png;base64,AAAA'
    const wrapper = mount(getTemplate('classic').component, { props: { resume } })
    expect(wrapper.find('img[alt="头像"]').attributes('src')).toBe('data:image/png;base64,AAAA')
  })

  it('样式配置应用到根节点', () => {
    const resume = createSampleResume()
    resume.style.fontSize = 16
    resume.style.lineHeight = 1.8
    const wrapper = mount(getTemplate('modern').component, { props: { resume } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('font-size: 16px')
    expect(style).toContain('line-height: 1.8')
  })

  it('未知模板 id 回退到第一个模板', () => {
    expect(getTemplate('not-exist').id).toBe(TEMPLATES[0].id)
  })

  it('头部：图标信息行渲染自定义信息，无头像不占位', () => {
    const resume = createSampleResume()
    const wrapper = mount(getTemplate('classic').component, { props: { resume } })
    expect(wrapper.find('img[alt="头像"]').exists()).toBe(false)
    expect(wrapper.findAll('header svg').length).toBeGreaterThanOrEqual(4)
    expect(wrapper.text()).toContain('某某大学 · 本科 · 2026 届')
  })

  it('姓名字号独立可调', () => {
    const resume = createSampleResume()
    resume.style.nameSize = 32
    const wrapper = mount(getTemplate('modern').component, { props: { resume } })
    expect(wrapper.find('h1').attributes('style')).toContain('font-size: 32px')
  })

  it('ResumeSheet 应用页边距并渲染对应模板', () => {
    const resume = createSampleResume()
    resume.style.pageMargin = 20
    resume.templateId = 'minimal'
    const wrapper = mount(ResumeSheet, { props: { resume } })
    expect(wrapper.attributes('style')).toContain('padding: 20mm')
    expect(wrapper.text()).toContain('张三')
  })

  it('项目地址渲染为链接行；未填写不占位；危险协议不生成 href', () => {
    const resume = createSampleResume()
    const proj = resume.modules.find((m) => m.type === 'projects')!
    const bare = mount(getTemplate('classic').component, { props: { resume } })
    expect(bare.text()).not.toContain('项目地址')

    proj.items[0].link = 'https://github.com/zhangsan/campus-market'
    const wrapper = mount(getTemplate('modern').component, { props: { resume } })
    expect(wrapper.text()).toContain('项目地址：')
    const a = wrapper.find('a[href="https://github.com/zhangsan/campus-market"]')
    expect(a.exists()).toBe(true)
    expect(a.text()).toBe('https://github.com/zhangsan/campus-market')
    // 与全局元信息同级：灰阶、无默认下划线
    expect(a.classes()).toContain('text-slate-600')
    expect(a.classes()).not.toContain('underline')

    proj.items[0].link = 'javascript:alert(1)'
    const evil = mount(getTemplate('classic').component, { props: { resume } })
    expect(evil.find('a').exists()).toBe(false)
    expect(evil.text()).toContain('javascript:alert(1)')
  })
})