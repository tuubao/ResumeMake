<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeModule } from '@/types/resume'
import { sanitizeHtml } from '@/utils/sanitize'
import { HEADER_ICONS } from '@/utils/icons'
import { textStyleCss } from '@/utils/textStyle'

const props = defineProps<{
  module: ResumeModule
  themeColor: string
  variant: 'bar' | 'underline' | 'plain'
}>()

const isList = computed(() => props.module.type === 'skills')
const clean = (html?: string) => sanitizeHtml(html ?? '')

/** 仅 http/https 链接生成可点击 href，其余按纯文本展示 */
const safeHref = (url?: string) => {
  const u = (url ?? '').trim()
  return /^https?:\/\//i.test(u) ? u : ''
}
</script>

<template>
  <section class="resume-module mt-4">
    <h2
      v-if="variant === 'bar'"
      class="mb-2 border-l-4 pl-2 text-[1.1em] font-bold text-slate-900"
      :style="{ borderColor: themeColor, ...textStyleCss(module.titleStyle) }"
    >
      {{ module.title }}
    </h2>
    <h2
      v-else-if="variant === 'underline'"
      class="mb-2 border-b-2 pb-1 text-[1.1em] font-bold"
      :style="{ borderColor: themeColor, color: themeColor, ...textStyleCss(module.titleStyle) }"
    >
      {{ module.title }}
    </h2>
    <h2 v-else class="mb-2 border-b border-slate-300 pb-1 text-[1.1em] font-bold text-slate-900" :style="textStyleCss(module.titleStyle)">
      {{ module.title }}
    </h2>

    <ul v-if="isList" class="list-disc space-y-1 pl-5">
      <li v-for="item in module.items" :key="item.id" class="resume-item" v-html="clean(item.content)"></li>
    </ul>
    <div v-else class="space-y-3">
      <article v-for="item in module.items" :key="item.id" class="resume-item">
        <header v-if="item.title || item.startDate" class="flex items-baseline justify-between gap-2">
          <div>
            <span class="font-semibold" :style="textStyleCss(item.titleStyle)">{{ item.title }}</span>
            <span v-if="item.subtitle" class="ml-2 text-slate-600" :style="textStyleCss(item.subtitleStyle)">{{ item.subtitle }}</span>
          </div>
          <span
            v-if="item.startDate || item.endDate"
            class="shrink-0 text-[0.9em] text-slate-500"
            :style="textStyleCss(item.dateStyle)"
          >
            {{ item.startDate }}<template v-if="item.endDate"> - {{ item.endDate }}</template>
          </span>
        </header>
        <p v-if="item.link" class="mt-0.5 flex items-center gap-1 text-[0.9em] text-slate-500" :style="textStyleCss(item.linkStyle)">
          <svg
            class="h-[1em] w-[1em] shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="HEADER_ICONS.link"
          ></svg>
          <span class="shrink-0">项目地址：</span>
          <a
            v-if="safeHref(item.link)"
            :href="safeHref(item.link)"
            target="_blank"
            rel="noopener noreferrer"
            class="break-all text-slate-600 hover:underline"
          >{{ item.link }}</a>
          <span v-else class="break-all text-slate-600">{{ item.link }}</span>
        </p>
        <div v-if="item.content" class="resume-content mt-1" v-html="clean(item.content)"></div>
      </article>
    </div>
  </section>
</template>