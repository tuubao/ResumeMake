<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeModule } from '@/types/resume'
import { sanitizeHtml } from '@/utils/sanitize'

const props = defineProps<{
  module: ResumeModule
  themeColor: string
  variant: 'bar' | 'underline' | 'plain'
}>()

const isList = computed(() => props.module.type === 'skills')
const clean = (html?: string) => sanitizeHtml(html ?? '')
</script>

<template>
  <section class="resume-module mt-4">
    <h2
      v-if="variant === 'bar'"
      class="mb-2 border-l-4 pl-2 text-[1.1em] font-bold text-slate-900"
      :style="{ borderColor: themeColor }"
    >
      {{ module.title }}
    </h2>
    <h2
      v-else-if="variant === 'underline'"
      class="mb-2 border-b-2 pb-1 text-[1.1em] font-bold"
      :style="{ borderColor: themeColor, color: themeColor }"
    >
      {{ module.title }}
    </h2>
    <h2 v-else class="mb-2 border-b border-slate-300 pb-1 text-[1.1em] font-bold text-slate-900">
      {{ module.title }}
    </h2>

    <ul v-if="isList" class="list-disc space-y-1 pl-5">
      <li v-for="item in module.items" :key="item.id" class="resume-item" v-html="clean(item.content)"></li>
    </ul>
    <div v-else class="space-y-3">
      <article v-for="item in module.items" :key="item.id" class="resume-item">
        <header v-if="item.title || item.startDate" class="flex items-baseline justify-between gap-2">
          <div>
            <span class="font-semibold">{{ item.title }}</span>
            <span v-if="item.subtitle" class="ml-2 text-slate-600">{{ item.subtitle }}</span>
          </div>
          <span v-if="item.startDate || item.endDate" class="shrink-0 text-[0.9em] text-slate-500">
            {{ item.startDate }}<template v-if="item.endDate"> - {{ item.endDate }}</template>
          </span>
        </header>
        <div v-if="item.content" class="resume-content mt-1" v-html="clean(item.content)"></div>
      </article>
    </div>
  </section>
</template>