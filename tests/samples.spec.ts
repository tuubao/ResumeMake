import { describe, it, expect } from 'vitest'
import { TEMPLATE_SAMPLES } from '@/data/samples'
import { isValidResume } from '@/utils/storage'
import { normalizeResume } from '@/types/resume'

describe('模板场景示例', () => {
  it('覆盖 12 套模板场景', () => {
    expect(Object.keys(TEMPLATE_SAMPLES).length).toBe(12)
  })

  for (const [id, make] of Object.entries(TEMPLATE_SAMPLES)) {
    describe(id, () => {
      it('结构合法、templateId 与场景一致', () => {
        const r = make()
        expect(isValidResume(r)).toBe(true)
        expect(r.templateId).toBe(id)
        expect(r.basics.name).toBeTruthy()
        expect(r.basics.jobTitle).toBeTruthy()
      })

      it('模块与条目内容完整', () => {
        const r = make()
        expect(r.modules.length).toBeGreaterThanOrEqual(4)
        for (const m of r.modules) {
          expect(m.title).toBeTruthy()
          expect(m.items.length).toBeGreaterThan(0)
          for (const item of m.items) {
            expect((item.content ?? '') || (item.title ?? '')).toBeTruthy()
          }
        }
        const skills = r.modules.find((m) => m.type === 'skills')
        expect(skills).toBeTruthy()
        expect(skills!.items.length).toBeGreaterThanOrEqual(3)
      })

      it('项目/实习经历采用结构化段落与量化加粗指标', () => {
        const r = make()
        const rich = r.modules.flatMap((m) => m.items.map((i) => i.content ?? ''))
        expect(rich.some((c) => c.includes('<b>'))).toBe(true)
        expect(rich.some((c) => /技术亮点|项目成果|工作成果/.test(c))).toBe(true)
      })

      it('全部 id 唯一且每次调用返回全新对象', () => {
        const r = make()
        const ids = [
          ...r.modules.map((m) => m.id),
          ...r.modules.flatMap((m) => m.items.map((i) => i.id)),
          ...r.basics.customFields.map((f) => f.id)
        ]
        expect(new Set(ids).size).toBe(ids.length)
        const again = make()
        expect(again).not.toBe(r)
        expect(again.modules[0].id).not.toBe(r.modules[0].id)
      })

      it('normalizeResume 兼容（无需补齐）', () => {
        const r = make()
        expect(normalizeResume(r)).toEqual(r)
      })
    })
  }
})