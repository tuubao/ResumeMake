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
    <div class="mx-auto mb-2 h-1 w-14 rounded-full" :style="{ backgroundColor: resume.style.themeColor }"></div>
    <!-- 浅色色块分区：每个模块一个淡主题色容器 -->
    <div class="space-y-3">
      <div
        v-for="m in resume.modules"
        :key="m.id"
        class="fresh-block rounded-lg px-3.5 py-3"
        :style="{ backgroundColor: resume.style.themeColor + '0A' }"
      >
        <ModuleSection :module="m" :theme-color="resume.style.themeColor" variant="underline" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fresh-block :deep(.resume-module) {
  margin-top: 0;
}
</style>