import { test, expect } from '@playwright/test'
import fs from 'node:fs'

test('核心链路：选模板 → 编辑 → 预览 → 持久化 → 换模板不丢数据', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'ResumeMake' })).toBeVisible()

  // 分类筛选：社招只显示现代青
  await page.getByTestId('filter-社招').click()
  await expect(page.getByTestId('template-card-modern')).toBeVisible()
  await expect(page.getByTestId('template-card-classic')).toHaveCount(0)

  // 一键套用进入编辑器
  await page.getByTestId('use-template-modern').click()
  await expect(page).toHaveURL(/\/editor/)

  // 编辑姓名，预览实时更新
  await page.locator('[data-field="name"]').fill('测试用户')
  await expect(page.locator('main .resume-sheet')).toContainText('测试用户')

  // 等待防抖自动保存后刷新，数据仍在
  await page.waitForTimeout(700)
  await page.reload()
  await expect(page.locator('[data-field="name"]')).toHaveValue('测试用户')

  // 切换模板，内容不丢
  await page.locator('[data-field="template"]').selectOption('minimal')
  await expect(page.locator('main .resume-sheet')).toContainText('测试用户')
  await expect(page.locator('main .resume-sheet')).toContainText('校园二手交易平台')

  // 打印根节点与导出菜单就绪
  await expect(page.locator('#print-root .resume-sheet')).toContainText('测试用户')
  await page.getByTestId('export-menu').click()
  await expect(page.getByTestId('export-pdf')).toBeVisible()
})

test('样式调整实时应用到预览', async ({ page }) => {
  await page.goto('/editor')
  await page.getByTestId('swatch-#b91c1c').click()
  await expect(page.locator('main .resume-module h2').first()).toHaveCSS('border-left-color', 'rgb(185, 28, 28)')
})

test('导出 JPG 与 Word 文件下载', async ({ page }) => {
  await page.goto('/editor')
  await page.getByTestId('export-menu').click()
  const [jpg] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-jpg').click()])
  expect(jpg.suggestedFilename()).toMatch(/\.jpg$/)
  await jpg.saveAs('docs/sample.jpg')
  expect(fs.statSync('docs/sample.jpg').size).toBeGreaterThan(20000)

  await page.getByTestId('export-menu').click()
  const [docx] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-docx').click()])
  expect(docx.suggestedFilename()).toMatch(/\.docx$/)
  await docx.saveAs('docs/sample.docx')
  expect(fs.statSync('docs/sample.docx').size).toBeGreaterThan(1000)
})

test('自定义信息与自定义模块出现在预览', async ({ page }) => {
  await page.goto('/editor')
  await page.getByTestId('add-custom-field').click()
  await page.locator('[data-field="custom-value"]').last().fill('GitHub: github.com/test')
  await expect(page.locator('main .resume-sheet')).toContainText('GitHub: github.com/test')

  await page.getByTestId('add-module').last().click()
  await expect(page.locator('main .resume-sheet')).toContainText('自定义模块')
})

test('项目经历填写项目地址后出现在预览', async ({ page }) => {
  await page.goto('/editor')
  await page.locator('[data-field="item-link"]').first().fill('https://github.com/test/campus-market')
  await expect(page.locator('main .resume-sheet')).toContainText('项目地址：')
  await expect(page.locator('main .resume-sheet a[href="https://github.com/test/campus-market"]')).toBeVisible()
})

test('选中文字调字号与加粗应用到预览', async ({ page }) => {
  await page.goto('/editor')
  const editable = page.locator('.rich-input').first()

  // 选中首个文本节点的前 4 个字符，调字号 20px
  await editable.evaluate((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const node = walker.nextNode() as Text
    const range = document.createRange()
    range.setStart(node, 0)
    range.setEnd(node, 4)
    const sel = window.getSelection()!
    sel.removeAllRanges()
    sel.addRange(range)
  })
  await page.getByTestId('rich-size').first().selectOption('20')
  const sized = page.locator('main .resume-sheet .resume-content span[style*="font-size: 20px"]').first()
  await expect(sized).toBeVisible()
  expect((await sized.textContent())?.length).toBe(4)

  // 选中下一段文本加粗
  await editable.evaluate((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    walker.nextNode()
    const node = walker.nextNode() as Text
    const range = document.createRange()
    range.setStart(node, 0)
    range.setEnd(node, Math.min(4, node.length))
    const sel = window.getSelection()!
    sel.removeAllRanges()
    sel.addRange(range)
  })
  await page.getByTitle('加粗（选中文字）').first().click()
  await expect(page.locator('main .resume-sheet .resume-content b, main .resume-sheet .resume-content strong').first()).toBeVisible()
})