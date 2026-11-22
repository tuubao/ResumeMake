<script setup lang="ts">
import { computed } from 'vue'
import type { Resume } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'

const props = defineProps<{ resume: Resume }>()
const contactLine = computed(() =>
  [props.resume.basics.phone, props.resume.basics.email, props.resume.basics.extra].filter(Boolean).join(' / ')
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
    <header class="mb-3 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-[2em] font-bold tracking-tight text-slate-900">{{ resume.basics.name }}</h1>
        <p class="mt-1 text-slate-700">{{ resume.basics.jobTitle }}</p>
        <p class="mt-1 text-[0.85em] text-slate-500">{{ contactLine }}</p>
      </div>
      <img
        v-if="resume.basics.avatar"
        :src="resume.basics.avatar"
        alt="头像"
        class="h-[24mm] w-[18mm] shrink-0 rounded object-cover grayscale"
      />
    </header>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="plain"
    />
  </div>
</template>