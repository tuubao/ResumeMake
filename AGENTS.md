# 注意事项

- 每次新增或改动完成后，都必须创建一个 git commit，便于后续的回滚操作
- 每次改动或新增新功能后，都必须编写或更新相关测试，并在交付给用户前，确保测试和验证都能满足要求并通过

# 常用命令

- 开发：`npm run dev`（端口 5173，strictPort）
- 构建：`npm run build`（含 vue-tsc 类型检查）
- 单测：`npm test`；跑单个文件：`npx vitest run tests/xxx.spec.ts`
- E2E：`npm run test:e2e`（Playwright 使用本机 Chrome channel，无需下载浏览器）

# 架构约定

- 简历数据为单一 JSON（`src/types/resume.ts`），模板是纯渲染组件（`src/templates/`），切换模板只改 `templateId`，不改数据
- PDF 导出走浏览器打印：打印专用根节点 + print CSS（`@page` A4），不引入 html2canvas