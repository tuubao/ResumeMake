import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TEMPLATES, getTemplate } from '@/templates'
import ResumeSheet from '@/components/ResumeSheet.vue'
import { createSampleResume } from '@/data/sampleResume'
import { TEMPLATE_SAMPLES } from '@/data/samples'

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

  it('字段级字号与加粗覆盖渲染到头部与模块', () => {
    const resume = createSampleResume()
    resume.basics.styles = { name: { size: 36, bold: false } }
    resume.modules[0].titleStyle = { size: 20 }
    resume.modules[0].items[0].subtitleStyle = { bold: true }
    const wrapper = mount(getTemplate('classic').component, { props: { resume } })
    const h1 = wrapper.find('h1')
    expect(h1.attributes('style')).toContain('font-size: 36px')
    expect(h1.attributes('style')).toContain('font-weight: 400')
    expect(wrapper.find('.resume-module h2').attributes('style')).toContain('font-size: 20px')
    const subtitle = wrapper.findAll('.resume-item header span')[1]
    expect(subtitle.attributes('style')).toContain('font-weight: 700')
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

describe('模板库扩展（12 套场景模板）', () => {
  it('12 套模板均注册标签与场景示例，id 唯一', () => {
    expect(TEMPLATES.length).toBe(12)
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(12)
    for (const t of TEMPLATES) {
      expect(t.tags.length).toBeGreaterThan(0)
      expect(t.sample().templateId).toBe(t.id)
    }
    expect(Object.keys(TEMPLATE_SAMPLES).sort()).toEqual(TEMPLATES.map((t) => t.id).sort())
  })

  for (const tpl of TEMPLATES) {
    it(`${tpl.name}：渲染自带场景示例的全部模块`, () => {
      const resume = tpl.sample()
      const wrapper = mount(tpl.component, { props: { resume } })
      const text = wrapper.text()
      expect(text).toContain(resume.basics.name)
      expect(text).toContain(resume.basics.jobTitle)
      for (const m of resume.modules) {
        expect(text).toContain(m.title)
      }
      expect(wrapper.findAll('.resume-module').length).toBe(resume.modules.length)
    })
  }

  it('色块横幅：头部渲染联系方式与头像，字段覆盖生效', () => {
    const resume = TEMPLATE_SAMPLES.banner()
    resume.basics.avatar = 'data:image/png;base64,AAAA'
    resume.basics.styles = { name: { size: 30, bold: false } }
    const wrapper = mount(getTemplate('banner').component, { props: { resume } })
    const h1 = wrapper.find('h1')
    expect(h1.attributes('style')).toContain('font-size: 30px')
    expect(h1.attributes('style')).toContain('font-weight: 400')
    expect(wrapper.find('img[alt="头像"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('138-0000-8888')
    expect(wrapper.find('header').attributes('style')).toContain('background-color')
  })

  it('商务双栏：侧栏渲染技能/教育/自评与联系方式，主栏渲染姓名/工作/项目', () => {
    const resume = TEMPLATE_SAMPLES.sidebar()
    const wrapper = mount(getTemplate('sidebar').component, { props: { resume } })
    const aside = wrapper.find('aside')
    expect(aside.text()).toContain('专业技能')
    expect(aside.text()).toContain('教育背景')
    expect(aside.text()).toContain('自我评价')
    expect(aside.text()).toContain('138-0000-8888')
    expect(aside.text()).not.toContain('工作经历')
    const main = wrapper.find('aside + div')
    expect(main.text()).toContain('工作经历')
    expect(main.text()).toContain('项目经历')
    expect(main.find('h1').text()).toBe('张三')
  })

  it('时光轴：经历模块带类型装饰类与主题色变量', () => {
    const resume = TEMPLATE_SAMPLES.timeline()
    const wrapper = mount(getTemplate('timeline').component, { props: { resume } })
    expect(wrapper.find('.module-work').exists()).toBe(true)
    expect(wrapper.find('.module-projects').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--tl-theme')
  })

  it('清新分区：每个模块包裹色块容器', () => {
    const resume = TEMPLATE_SAMPLES.fresh()
    const wrapper = mount(getTemplate('fresh').component, { props: { resume } })
    expect(wrapper.findAll('.fresh-block').length).toBe(resume.modules.length)
  })

  it('新模板字段级覆盖与项目链接渲染', () => {
    const resume = TEMPLATE_SAMPLES.fresh()
    resume.modules[0].titleStyle = { size: 20 }
    const wrapper = mount(getTemplate('fresh').component, { props: { resume } })
    expect(wrapper.find('.resume-module h2').attributes('style')).toContain('font-size: 20px')
    const proj = resume.modules.find((m) => m.type === 'projects')!
    expect(wrapper.find(`a[href="${proj.items[0].link}"]`).exists()).toBe(true)
  })
})