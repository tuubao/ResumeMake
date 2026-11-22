# 注意事项

- 每次新增或改动完成后，都必须创建一个 git commit，便于后续的回滚操作
- 每次改动或新增新功能后，都必须编写或更新相关测试，并在交付给用户前，确保测试和验证都能满足要求并通过

# 常用命令

- 开发：`npm run dev`（端口 5173，strictPort）
- 构建：`npm run build`（含 vue-tsc 类型检查）
- 单测：`npm test`；跑单个文件：`npx vitest run tests/xxx.spec.ts`
- E2E：`npm run test:e2e`（Playwright 使用本机 Chrome channel，无需下载浏览器）

# 架构约定

- 简历数据为单一 JSON（`src/types/resume.ts`），模板是纯渲染组件（`src/templates/`），切换模板只改 `templateId`，不改数据；旧存档经 `normalizeResume` 补齐新字段
- 头部为共享组件 `src/components/ResumeHeader.vue`（图标信息行 + 头像留空），三套模板共用
- 导出：PDF 走打印专用根节点 + print CSS（`@page` A4）；JPG 用 html-to-image 抓取 `main .resume-sheet`；Word 用 docx 库（`src/utils/docx.ts`），不引入 html2canvas
- 安装新依赖后若 E2E 出现懒加载路由跳转失败，先重启 dev server（Vite 依赖预构建缓存过期）