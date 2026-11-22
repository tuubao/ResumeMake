<script setup lang="ts">
import { computed } from 'vue'
import type { Resume } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'

const props = defineProps<{ resume: Resume }>()
const contactLine = computed(() =>
  [props.resume.basics.phone, props.resume.basics.email, props.resume.basics.extra].filter(Boolean).join(' | ')
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
    <header class="relative mb-2 text-center">
      <img
        v-if="resume.basics.avatar"
        :src="resume.basics.avatar"
        alt="头像"
        class="absolute right-0 top-0 h-[24mm] w-[18mm] rounded object-cover"
      />
      <h1 class="text-[1.8em] font-bold tracking-wide text-slate-900">{{ resume.basics.name }}</h1>
      <p class="mt-1 font-medium" :style="{ color: resume.style.themeColor }">{{ resume.basics.jobTitle }}</p>
      <p class="mt-1 text-[0.9em] text-slate-600">{{ contactLine }}</p>
    </header>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="bar"
    />
  </div>
</template>