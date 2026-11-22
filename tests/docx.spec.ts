import { describe, it, expect } from 'vitest'
import { htmlToDocxBlocks, buildResumeDocx } from '@/utils/docx'
import { createSampleResume } from '@/data/sampleResume'

describe('htmlToDocxBlocks', () => {
  it('解析段落与加粗', () => {
    const blocks = htmlToDocxBlocks('<p><b>技术栈：</b>Vue</p>')
    expect(blocks.length).toBe(1)
    expect(blocks[0].runs[0]).toEqual({ text: '技术栈：', bold: true })
    expect(blocks[0].runs[1].text).toBe('Vue')
  })

  it('解析列表为 bullet 块', () => {
    const blocks = htmlToDocxBlocks('<ul><li>a</li><li>b</li></ul>')
    expect(blocks.length).toBe(2)
    expect(blocks.every((b) => b.bullet)).toBe(true)
  })

  it('剔除脚本内容', () => {
    const blocks = htmlToDocxBlocks('<script>alert(1)</script><p>ok</p>')
    expect(blocks.length).toBe(1)
    expect(blocks[0].runs[0].text).toBe('ok')
  })

  it('空内容返回空数组', () => {
    expect(htmlToDocxBlocks('')).toEqual([])
  })
})

describe('buildResumeDocx', () => {
  it('生成非空 docx Blob', async () => {
    const blob = await buildResumeDocx(createSampleResume())
    expect(blob.size).toBeGreaterThan(1000)
  })
})