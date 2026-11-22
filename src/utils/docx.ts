import {
  AlignmentType,
  BorderStyle,
  Document,
  LineRuleType,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertMillimetersToTwip
} from 'docx'
import type { Resume, TextStyle } from '@/types/resume'
import { sanitizeHtml } from './sanitize'

export interface DocxRun {
  text: string
  bold?: boolean
  /** 字号（半磅），缺省跟随正文 */
  size?: number
}
export interface DocxBlock {
  runs: DocxRun[]
  bullet?: boolean
}

/** 将受限富文本 HTML（p/b/ul/li/br）解析为 docx 段落块 */
export function htmlToDocxBlocks(html: string): DocxBlock[] {
  const parsed = new DOMParser().parseFromString(sanitizeHtml(html), 'text/html')
  const blocks: DocxBlock[] = []
  let pending: DocxRun[] = []

  const flush = () => {
    if (pending.some((r) => r.text.trim())) blocks.push({ runs: pending })
    pending = []
  }
  const collect = (node: Node, bold: boolean, out: DocxRun[], size?: number) => {
    if (node.nodeType === 3) {
      const t = node.textContent ?? ''
      if (t) out.push({ text: t, bold: bold || undefined, size })
      return
    }
    if (node.nodeType !== 1) return
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') {
      out.push({ text: '\n', size })
      return
    }
    const fw = el.style?.fontWeight ?? ''
    const b = bold || tag === 'b' || tag === 'strong' || fw === 'bold' || Number(fw) >= 600
    let s = size
    const fs = el.style?.fontSize ?? ''
    if (fs.endsWith('px')) {
      const n = parseFloat(fs)
      if (!Number.isNaN(n)) s = Math.round(n * 1.5)
    }
    el.childNodes.forEach((c) => collect(c, b, out, s))
  }
  const pushRuns = (runs: DocxRun[], bullet: boolean) => {
    if (runs.some((r) => r.text.trim())) blocks.push({ runs, bullet: bullet || undefined })
  }

  parsed.body.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      const t = node.textContent ?? ''
      if (t.trim()) pending.push({ text: t })
      return
    }
    if (node.nodeType !== 1) return
    flush()
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (tag === 'ul' || tag === 'ol') {
      el.querySelectorAll(':scope > li').forEach((li) => {
        const runs: DocxRun[] = []
        collect(li, false, runs)
        pushRuns(runs, true)
      })
    } else if (tag === 'p' || tag === 'div' || tag === 'li') {
      const runs: DocxRun[] = []
      collect(el, false, runs)
      pushRuns(runs, tag === 'li')
    } else {
      collect(el, false, pending)
    }
  })
  flush()
  return blocks
}

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const TABLE_BORDERS = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER
}

function fontName(stack: string): string {
  const m = stack.match(/"([^"]+)"/)
  return m ? m[1] : 'Microsoft YaHei'
}

/** 由简历数据生成真正的 .docx（A4、页边距/字体/字号/主题色跟随样式设置） */
export async function buildResumeDocx(resume: Resume): Promise<Blob> {
  const { style, basics } = resume
  const font = fontName(style.fontFamily)
  const bodySize = Math.round(style.fontSize * 1.5) // px → 半磅
  const nameSize = Math.round(style.nameSize * 1.5)
  const headSize = Math.round(bodySize * 1.15)
  const theme = style.themeColor.replace('#', '')
  const line = Math.round(style.lineHeight * 240)
  const margin = convertMillimetersToTwip(style.pageMargin)

  const run = (text: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
    new TextRun({
      text,
      bold: opts.bold,
      size: opts.size ?? bodySize,
      color: opts.color,
      font: { ascii: font, eastAsia: font, hAnsi: font }
    })
  const para = (
    children: TextRun[],
    opts: { align?: (typeof AlignmentType)[keyof typeof AlignmentType]; bullet?: boolean; after?: number } = {}
  ) =>
    new Paragraph({
      children,
      alignment: opts.align,
      bullet: opts.bullet ? { level: 0 } : undefined,
      spacing: { after: opts.after ?? 60, line, lineRule: LineRuleType.AUTO }
    })
  /** 字段级字体覆盖 → run 参数（px → 半磅） */
  const override = (t: TextStyle | undefined, def: { size?: number; bold?: boolean } = {}) => ({
    size: t?.size ? Math.round(t.size * 1.5) : def.size,
    bold: t?.bold ?? def.bold
  })
  const infoRuns = (fields: Array<{ v: string; t?: TextStyle }>) => {
    const runs: TextRun[] = []
    for (const f of fields) {
      if (!f.v) continue
      if (runs.length) runs.push(run('    ', { color: '475569' }))
      runs.push(run(f.v, { color: '475569', ...override(f.t) }))
    }
    return runs
  }

  const children: (Paragraph | Table)[] = []
  children.push(para([run(basics.name, override(basics.styles?.name, { size: nameSize, bold: true }))], { align: AlignmentType.CENTER, after: 120 }))
  const row2 = infoRuns([
    { v: basics.phone, t: basics.styles?.phone },
    { v: basics.email, t: basics.styles?.email }
  ])
  if (row2.length) children.push(para(row2, { align: AlignmentType.CENTER }))
  const row3 = infoRuns([
    { v: basics.extra, t: basics.styles?.extra },
    { v: basics.jobTitle, t: basics.styles?.jobTitle },
    ...basics.customFields.map((f) => ({ v: f.value, t: f.style }))
  ])
  if (row3.length) children.push(para(row3, { align: AlignmentType.CENTER, after: 120 }))

  for (const m of resume.modules) {
    children.push(
      new Paragraph({
        children: [run(m.title, { color: theme, ...override(m.titleStyle, { size: headSize, bold: true }) })],
        spacing: { before: 160, after: 80, line, lineRule: LineRuleType.AUTO },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: theme } }
      })
    )
    for (const item of m.items) {
      const isList = m.type === 'skills'
      if (!isList && (item.title || item.startDate)) {
        const dates = [item.startDate, item.endDate].filter(Boolean).join(' - ')
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: TABLE_BORDERS,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: TABLE_BORDERS,
                    children: [
                      para(
                        [
                          run(item.title ?? '', override(item.titleStyle, { bold: true })),
                          run(item.subtitle ? '  ' + item.subtitle : '', { color: '475569', ...override(item.subtitleStyle) })
                        ],
                        { after: 0 }
                      )
                    ]
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: TABLE_BORDERS,
                    children: [para([run(dates, { color: '64748b', ...override(item.dateStyle) })], { align: AlignmentType.RIGHT, after: 0 })]
                  })
                ]
              })
            ]
          })
        )
      }
      if (item.link) {
        children.push(
          para(
            [run('项目地址：', { color: '64748b', ...override(item.linkStyle) }), run(item.link, { color: '475569', ...override(item.linkStyle) })],
            { after: 40 }
          )
        )
      }
      for (const b of htmlToDocxBlocks(item.content ?? '')) {
        children.push(para(b.runs.map((r) => run(r.text, { bold: r.bold, size: r.size })), { bullet: b.bullet || isList, after: 40 }))
      }
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: { ascii: font, eastAsia: font, hAnsi: font }, size: bodySize, color: '1f2937' } }
      }
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: convertMillimetersToTwip(210), height: convertMillimetersToTwip(297) },
            margin: { top: margin, bottom: margin, left: margin, right: margin }
          }
        },
        children
      }
    ]
  })
  return Packer.toBlob(doc)
}