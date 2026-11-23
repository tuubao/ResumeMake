<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderIcon, Resume, TextStyle } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'
import { HEADER_ICONS } from '@/utils/icons'
import { textStyleCss } from '@/utils/textStyle'

const props = defineProps<{ resume: Resume }>()

type RowItem = { icon: HeaderIcon; value: string; style?: TextStyle }

/** 横幅内信息行：电话 / 邮箱 */
const row2 = computed<RowItem[]>(() =>
  ([
    { icon: 'phone', value: props.resume.basics.phone, style: props.resume.basics.styles?.phone },
    { icon: 'mail', value: props.resume.basics.email, style: props.resume.basics.styles?.email }
  ] as RowItem[]).filter((i) => i.value)
)

/**横幅内信息行：补充信息 / 自定义信息（求职岗位单独显示在姓名下方） */
const row3 = computed<RowItem[]>(() =>
  ([
    { icon: 'briefcase', value: props.resume.basics.extra, style: props.resume.basics.styles?.extra },
    ...props.resume.basics.customFields.map((f) => ({ icon: f.icon, value: f.value, style: f.style }))
  ] as RowItem[]).filter((i) => i.value)
)
</script>

<template>
  <div
    class="text-slate-800"
    :style="{
      fontFamily: resume.style.fontFamily,
      fontSize: resume.style.fontSize + 'px',
      lineHeight: resume.style.lineHeight
    }"
  >
    <!-- 主题色横幅头部：色块分区设计，头像在右 -->
    <header
      class="relative mb-4 rounded-lg px-5 py-4 text-white"
      :class="resume.basics.avatar ? 'pr-[26mm]' : ''"
      :style="{ backgroundColor: resume.style.themeColor }"
    >
      <img
        v-if="resume.basics.avatar"
        :src="resume.basics.avatar"
        alt="头像"
        class="absolute right-4 top-4 h-[26mm] w-[20mm] rounded object-cover ring-2 ring-white/70"
      />
      <h1
        class="font-bold tracking-wide"
        :style="{ fontSize: resume.style.nameSize + 'px', ...textStyleCss(resume.basics.styles?.name) }"
      >
        {{ resume.basics.name }}
      </h1>
      <p
        v-if="resume.basics.jobTitle"
        class="mt-0.5 text-[0.95em] text-white/90"
        :style="textStyleCss(resume.basics.styles?.jobTitle)"
      >
        {{ resume.basics.jobTitle }}
      </p>
      <template v-for="(row, ri) in [row2, row3]" :key="ri">
        <div v-if="row.length" class="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.9em] text-white/90">
          <span v-for="(it, i) in row" :key="i" class="inline-flex items-center gap-1.5">
            <svg
              v-if="it.icon !== 'none'"
              class="h-[1em] w-[1em] shrink-0 text-white/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="HEADER_ICONS[it.icon]"
            ></svg>
            <span :style="textStyleCss(it.style)">{{ it.value }}</span>
          </span>
        </div>
      </template>
    </header>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="chip"
    />
  </div>
</template>