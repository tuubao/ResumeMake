import type { Resume } from '@/types/resume'
import { normalizeResume } from '@/types/resume'

const STORAGE_KEY = 'resumemake:resume'

/** 校验关键结构，防止损坏/旧版本数据导致运行时崩溃 */
export function isValidResume(value: unknown): value is Resume {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  if (typeof r.templateId !== 'string') return false
  const b = r.basics
  if (typeof b !== 'object' || b === null || typeof (b as Record<string, unknown>).name !== 'string') return false
  if (!Array.isArray(r.modules)) return false
  for (const m of r.modules) {
    if (typeof m !== 'object' || m === null) return false
    const mod = m as Record<string, unknown>
    if (typeof mod.id !== 'string' || typeof mod.type !== 'string' || typeof mod.title !== 'string' || !Array.isArray(mod.items)) return false
  }
  const s = r.style
  if (typeof s !== 'object' || s === null) return false
  const style = s as Record<string, unknown>
  if (typeof style.fontSize !== 'number' || typeof style.themeColor !== 'string') return false
  return true
}

export function saveResume(resume: Resume): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
  } catch {
    // 存储空间不足等异常不阻塞编辑
  }
}

export function loadResume(): Resume | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidResume(parsed) ? normalizeResume(parsed) : null
  } catch {
    return null
  }
}

export function clearResume(): void {
  localStorage.removeItem(STORAGE_KEY)
}