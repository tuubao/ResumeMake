import { describe, it, expect, beforeEach } from 'vitest'
import { saveResume, loadResume, clearResume, isValidResume } from '@/utils/storage'
import { createSampleResume } from '@/data/sampleResume'

describe('storage 持久化', () => {
  beforeEach(() => localStorage.clear())

  it('保存后可完整恢复', () => {
    const resume = createSampleResume()
    saveResume(resume)
    expect(loadResume()).toEqual(resume)
  })

  it('无数据时返回 null', () => {
    expect(loadResume()).toBeNull()
  })

  it('损坏 JSON 返回 null 不抛异常', () => {
    localStorage.setItem('resumemake:resume', '{broken json')
    expect(loadResume()).toBeNull()
  })

  it('结构非法的数据返回 null', () => {
    localStorage.setItem('resumemake:resume', JSON.stringify({ templateId: 'x' }))
    expect(loadResume()).toBeNull()
  })

  it('clearResume 清除数据', () => {
    saveResume(createSampleResume())
    clearResume()
    expect(loadResume()).toBeNull()
  })

  it('isValidResume 校验关键字段', () => {
    expect(isValidResume(createSampleResume())).toBe(true)
    expect(isValidResume(null)).toBe(false)
    const bad = createSampleResume() as unknown as Record<string, unknown>
    delete bad.modules
    expect(isValidResume(bad)).toBe(false)
  })

  it('旧版存档自动补齐新字段', () => {
    const legacy = createSampleResume() as unknown as { basics: Record<string, unknown>; style: Record<string, unknown> }
    delete legacy.basics.customFields
    delete legacy.style.nameSize
    localStorage.setItem('resumemake:resume', JSON.stringify(legacy))
    const loaded = loadResume()!
    expect(loaded.basics.customFields).toEqual([])
    expect(loaded.style.nameSize).toBe(26)
  })
})