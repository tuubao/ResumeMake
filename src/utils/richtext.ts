/** 将 execCommand('fontSize') 产生的 font[size=7] 占位标签转换为指定 px 字号的 span。
 *  px 为 null 表示清除字号：展开 font 并去掉选区内 span 的 font-size */
export function normalizeFontTags(root: HTMLElement, px: number | null): void {
  root.querySelectorAll('font[size="7"]').forEach((f) => {
    // 先清除选区内旧字号，避免内层 span 覆盖新字号；无剩余属性的 span 直接展开
    f.querySelectorAll('span').forEach((s) => {
      s.style.fontSize = ''
      if (!s.getAttribute('style')) s.removeAttribute('style')
      if (s.attributes.length === 0) {
        const p = s.parentNode
        if (p) {
          while (s.firstChild) p.insertBefore(s.firstChild, s)
          s.remove()
        }
      }
    })
    const parent = f.parentNode
    if (!parent) return
    if (px === null) {
      while (f.firstChild) parent.insertBefore(f.firstChild, f)
      f.remove()
    } else {
      const span = document.createElement('span')
      span.style.fontSize = px + 'px'
      while (f.firstChild) span.appendChild(f.firstChild)
      parent.replaceChild(span, f)
    }
  })
}