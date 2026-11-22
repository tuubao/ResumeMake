# ResumeMake

免费、纯前端的在线简历制作工具：选模板 → 填内容 → 调样式 → 导出 PDF。

## 功能

- **模板中心**：3 套单栏模板（经典蓝 / 现代青 / 极简黑），按校招 / 社招 / 通用筛选，实时缩略图，一键套用
- **头部版式**：居中姓名 + 图标信息行（电话/邮箱/经历/岗位/自定义），右上角头像，未上传头像时留空
- **模块化编辑**：教育背景、专业技能、工作 / 项目经历（项目条目可附项目地址）、自我评价 + **自定义模块**（标题自拟），模块可增删、条目可增删
- **基本信息自定义**：除姓名/电话/邮箱/岗位/补充信息外，可添加任意条自定义信息（可选图标：学历/城市/链接等）
- **富文本**：加粗、无序列表、**选中任意文字调字号（12–32px）或加粗**（粘贴自动转纯文本，内容经净化后渲染）
- **样式定制**：5 种字体（雅黑/思源黑体/等线/宋体/楷体）、正文字号 12–18px、姓名字号 20–36px、主题色、行距、页边距
- **实时预览**：A4 所见即所得，超一页显示分页参考线
- **多格式导出**：PDF（浏览器打印）、JPG 图片（2x 高清）、Word（.docx，字体/字号/页边距/主题色跟随设置）
- **自动保存**：localStorage 防抖保存，刷新不丢数据；切换模板不丢内容；旧版存档自动兼容

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器（端口 5173） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm test` | Vitest 单测（单个文件：`npx vitest run tests/xxx.spec.ts`） |
| `npm run test:e2e` | Playwright E2E（使用本机 Chrome，无需下载浏览器） |
| `node scripts/preview-pdf.mjs` | 生成示例 PDF 到 `docs/preview.pdf`（需先启动 dev） |

## 技术栈

Vue 3 + TypeScript + Vite + TailwindCSS v4 + Pinia + Vue Router；测试 Vitest + Vue Test Utils + Playwright。

## 架构

- 简历数据为单一 JSON（`src/types/resume.ts`），模板是纯渲染组件（`src/templates/`），换模板只改 `templateId`
- PDF 导出：打印专用根节点 `#print-root` + print CSS（`@page A4`），无 html2canvas 依赖

## 说明

- 数据仅保存在浏览器本地，清浏览器数据会丢失简历，重要内容请及时导出
- PDF 导出推荐 Chrome / Edge：点击「导出 → PDF」后在打印对话框选择「另存为 PDF」，边距选「无」、勾选「背景图形」
- JPG 为整份简历的单张长图（2x 分辨率）；Word 为真正的 .docx，可在 Word / WPS 中继续编辑
- 导出样例见 `docs/sample.jpg`、`docs/sample.docx`、`docs/preview.pdf`（由 E2E 与脚本生成）