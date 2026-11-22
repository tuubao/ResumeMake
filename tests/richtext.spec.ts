import { describe, it, expect } from 'vitest'
import { normalizeFontTags } from '@/utils/richtext'

describe('normalizeFontTags', () => {
  it('font[size=7] 转换为指定 px 的 span', () => {
    const root = document.createElement('div')
    root.innerHTML = '<p>a<font size="7">bc</font>d</p>'
    normalizeFontTags(root, 20)
    const span = root.querySelector('span')!
    expect(span.style.fontSize).toBe('20px')
    expect(span.textContent).toBe('bc')
    expect(root.querySelector('font')).toBeNull()
    expect(root.textContent).toBe('abcd')
  })

  it('新字号覆盖选区内旧字号', () => {
    const root = document.createElement('div')
    root.innerHTML = '<font size="7"><span style="font-size: 18px;">x</span></font>'
    normalizeFontTags(root, 20)
    expect(root.querySelectorAll('span').length).toBe(1)
    expect(root.querySelector('span')!.style.fontSize).toBe('20px')
  })

  it('px 为 null 时清除字号并展开 font', () => {
    const root = document.createElement('div')
    root.innerHTML = '<p><font size="7"><span style="font-size: 18px;">x</span>y</font></p>'
    normalizeFontTags(root, null)
    expect(root.querySelector('font')).toBeNull()
    expect(root.querySelector('span')).toBeNull()
    expect(root.textContent).toBe('xy')
  })
})