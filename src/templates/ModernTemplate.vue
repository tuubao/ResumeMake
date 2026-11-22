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
    <div class="mb-1 border-b-2 pb-2" :style="{ borderColor: resume.style.themeColor }">
      <ResumeHeader :resume="resume" />
    </div>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="underline"
    />
  </div>
</template>