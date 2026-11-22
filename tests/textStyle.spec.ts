import { describe, it, expect } from 'vitest'
import { textStyleCss } from '@/utils/textStyle'

describe('textStyleCss', () => {
  it('缺省返回空样式继承模板', () => {
    expect(textStyleCss(undefined)).toEqual({})
    expect(textStyleCss({})).toEqual({})
  })

  it('字号与加粗覆盖', () => {
    expect(textStyleCss({ size: 20 })).toEqual({ fontSize: '20px' })
    expect(textStyleCss({ bold: true })).toEqual({ fontWeight: 700 })
    expect(textStyleCss({ bold: false })).toEqual({ fontWeight: 400 })
    expect(textStyleCss({ size: 32, bold: false })).toEqual({ fontSize: '32px', fontWeight: 400 })
  })
})