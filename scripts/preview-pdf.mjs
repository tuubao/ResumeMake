// 生成示例简历 PDF（验证打印样式）。用法：先 npm run dev，再 node scripts/preview-pdf.mjs
import { chromium } from '@playwright/test'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:5173/editor', { waitUntil: 'networkidle' })
await page.pdf({
  path: 'docs/preview.pdf',
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true
})
await browser.close()
console.log('PDF 已导出: docs/preview.pdf')