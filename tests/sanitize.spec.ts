import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '@/utils/sanitize'

describe('sanitizeHtml', () => {
  it('保留合法排版标签', () => {
    const html = '<p><b>技术栈：</b>Vue</p><ul><li>条目</li></ul>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('剔除 script 标签及内容', () => {
    expect(sanitizeHtml('<p>a</p><script>alert(1)</script>')).toBe('<p>a</p>')
  })

  it('剔除事件属性', () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain('onerror')
  })

  it('剔除 javascript: 协议', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:')
  })

  it('剔除 iframe', () => {
    expect(sanitizeHtml('<iframe src="https://evil"></iframe><p>ok</p>')).toBe('<p>ok</p>')
  })

  it('保留字号 style，剔除危险 style', () => {
    expect(sanitizeHtml('<span style="font-size: 18px;">x</span>')).toBe('<span style="font-size: 18px;">x</span>')
    expect(sanitizeHtml('<span style="background: url(javascript:alert(1))">x</span>')).not.toContain('style=')
    expect(sanitizeHtml('<span style="width: expression(alert(1))">x</span>')).not.toContain('style=')
  })
})