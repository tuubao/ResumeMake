<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderIcon, Resume } from '@/types/resume'
import { HEADER_ICONS } from '@/utils/icons'

const props = defineProps<{ resume: Resume }>()

type RowItem = { icon: HeaderIcon; value: string }

/** 第二行：电话 / 邮箱 */
const row2 = computed<RowItem[]>(() =>
  ([
    { icon: 'phone', value: props.resume.basics.phone },
    { icon: 'mail', value: props.resume.basics.email }
  ] as RowItem[]).filter((i) => i.value)
)

/** 第三行：补充信息 / 求职岗位 / 自定义信息 */
const row3 = computed<RowItem[]>(() =>
  ([
    { icon: 'briefcase', value: props.resume.basics.extra },
    { icon: 'at', value: props.resume.basics.jobTitle },
    ...props.resume.basics.customFields.map((f) => ({ icon: f.icon, value: f.value }))
  ] as RowItem[]).filter((i) => i.value)
)
</script>

<template>
  <header class="relative mb-3 text-center">
    <!-- 头像未上传时留空，不占位 -->
    <img
      v-if="resume.basics.avatar"
      :src="resume.basics.avatar"
      alt="头像"
      class="absolute right-0 top-0 h-[26mm] w-[20mm] rounded object-cover"
    />
    <h1 class="font-bold tracking-wide text-slate-900" :style="{ fontSize: resume.style.nameSize + 'px' }">
      {{ resume.basics.name }}
    </h1>
    <template v-for="(row, ri) in [row2, row3]" :key="ri">
      <div
        v-if="row.length"
        class="mt-1.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[0.9em] text-slate-600"
      >
        <span v-for="(it, i) in row" :key="i" class="inline-flex items-center gap-1.5">
          <svg
            v-if="it.icon !== 'none'"
            class="h-[1em] w-[1em] shrink-0 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="HEADER_ICONS[it.icon]"
          ></svg>
          <span>{{ it.value }}</span>
        </span>
      </div>
    </template>
  </header>
</template>