<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'

const store = useResumeStore()

const FONTS = [
  { label: '微软雅黑（互联网推荐）', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '思源黑体 / Noto Sans', value: '"Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif' },
  { label: '等线', value: '"DengXian", "Microsoft YaHei", sans-serif' },
  { label: '宋体（传统行业）', value: '"SimSun", "Songti SC", serif' },
  { label: '楷体', value: '"KaiTi", "Kaiti SC", serif' }
]
const COLORS = ['#2563eb', '#0d9488', '#111827', '#b91c1c', '#15803d', '#ea580c']
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4">
    <h3 class="mb-3 text-sm font-bold text-slate-900">样式设置</h3>
    <div class="space-y-4">
      <label class="block text-xs text-slate-500">
        字体
        <select v-model="store.resume.style.fontFamily" data-field="fontFamily" class="field">
          <option v-for="f in FONTS" :key="f.value" :value="f.value">{{ f.label }}</option>
        </select>
      </label>

      <label class="block text-xs text-slate-500">
        正文字号：{{ store.resume.style.fontSize }}px
        <input v-model.number="store.resume.style.fontSize" data-field="fontSize" type="range" min="12" max="18" step="1" class="w-full accent-teal-600" />
      </label>

      <label class="block text-xs text-slate-500">
        姓名字号：{{ store.resume.style.nameSize }}px
        <input v-model.number="store.resume.style.nameSize" data-field="nameSize" type="range" min="20" max="36" step="1" class="w-full accent-teal-600" />
      </label>

      <div class="text-xs text-slate-500">
        主题色
        <div class="mt-1.5 flex items-center gap-2">
          <button
            v-for="c in COLORS"
            :key="c"
            type="button"
            :data-testid="`swatch-${c}`"
            class="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
            :class="store.resume.style.themeColor === c ? 'border-slate-800' : 'border-transparent'"
            :style="{ backgroundColor: c }"
            :title="c"
            @click="store.updateStyle({ themeColor: c })"
          ></button>
          <input
            :value="store.resume.style.themeColor"
            data-field="themeColor"
            type="color"
            class="h-6 w-8 cursor-pointer rounded border border-slate-200"
            title="自定义颜色"
            @input="store.updateStyle({ themeColor: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>

      <label class="block text-xs text-slate-500">
        行距：{{ store.resume.style.lineHeight.toFixed(1) }}
        <input v-model.number="store.resume.style.lineHeight" data-field="lineHeight" type="range" min="1.2" max="1.8" step="0.1" class="w-full accent-teal-600" />
      </label>

      <label class="block text-xs text-slate-500">
        页边距：{{ store.resume.style.pageMargin }}mm
        <input v-model.number="store.resume.style.pageMargin" data-field="pageMargin" type="range" min="10" max="25" step="1" class="w-full accent-teal-600" />
      </label>
      <p class="text-[11px] leading-4 text-slate-400">IT 岗排版参考：雅黑/思源黑体，正文 14–16px，姓名 21–32px，行距 1.2–1.5，全文不超过 2 种字体。</p>
    </div>
  </section>
</template>