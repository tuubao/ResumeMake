<script setup lang="ts">
import type { Resume } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'
import ResumeHeader from '@/components/ResumeHeader.vue'

defineProps<{ resume: Resume }>()
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
    <ResumeHeader :resume="resume" />
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="bar"
    />
  </div>
</template>