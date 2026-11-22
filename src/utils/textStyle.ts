import type { CSSProperties } from 'vue'
import type { TextStyle } from '@/types/resume'

/** 字段级字体覆盖 → 内联样式；缺省项不输出，继承模板默认 */
export function textStyleCss(t?: TextStyle): CSSProperties {
  const s: CSSProperties = {}
  if (t?.size) s.fontSize = t.size + 'px'
  if (t?.bold === true) s.fontWeight = 700
  if (t?.bold === false) s.fontWeight = 400
  return s
}