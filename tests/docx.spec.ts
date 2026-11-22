import { describe, it, expect } from 'vitest'
import { unzipSync, strFromU8 } from 'fflate'
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

  it('解析逐字字号与 style 加粗为 run 属性', () => {
    const blocks = htmlToDocxBlocks('<p><span style="font-size: 18px; font-weight: bold;">大</span>普通</p>')
    expect(blocks[0].runs[0]).toEqual({ text: '大', bold: true, size: 27 })
    expect(blocks[0].runs[1].text).toBe('普通')
    expect(blocks[0].runs[1].size).toBeUndefined()
  })
})

/** jsdom 的 Blob 无 arrayBuffer()，用 FileReader 读取后解包 document.xml */
async function docxXml(blob: Blob): Promise<string> {
  const buf = await new Promise<ArrayBuffer>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as ArrayBuffer)
    fr.onerror = () => reject(fr.error)
    fr.readAsArrayBuffer(blob)
  })
  return strFromU8(unzipSync(new Uint8Array(buf))['word/document.xml'])
}

describe('buildResumeDocx', () => {
  it('生成非空 docx Blob', async () => {
    const blob = await buildResumeDocx(createSampleResume())
    expect(blob.size).toBeGreaterThan(1000)
  })

  it('项目地址写入 Word 文档', async () => {
    const resume = createSampleResume()
    const proj = resume.modules.find((m) => m.type === 'projects')!
    proj.items[0].link = 'https://github.com/zhangsan/campus-market'
    const xml = await docxXml(await buildResumeDocx(resume))
    expect(xml).toContain('项目地址：')
    expect(xml).toContain('https://github.com/zhangsan/campus-market')
  })

  it('逐字字号写入 Word 文档', async () => {
    const resume = createSampleResume()
    resume.modules[0].items[0].content = '<p><span style="font-size: 18px;">强调</span></p>'
    const xml = await docxXml(await buildResumeDocx(resume))
    expect(xml).toContain('w:val="27"')
    expect(xml).toContain('强调')
  })
})