<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import type { Resume } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'
import ResumeHeader from '@/components/ResumeHeader.vue'

const props = defineProps<{ resume: Resume }>()

/** --tl-theme 供时间轴圆点伪元素取主题色 */
const rootStyle = computed(
  () =>
    ({
      fontFamily: props.resume.style.fontFamily,
      fontSize: props.resume.style.fontSize + 'px',
      lineHeight: props.resume.style.lineHeight,
      '--tl-theme': props.resume.style.themeColor
    }) as CSSProperties
)
</script>

<template>
  <div class="timeline-sheet text-slate-800" :style="rootStyle">
    <ResumeHeader :resume="resume" align="left" />
    <div class="mb-3 h-[3px] w-16 rounded-full" :style="{ backgroundColor: resume.style.themeColor }"></div>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="dot"
    />
  </div>
</template>

<style scoped>
/* 工作/项目/自定义条目：左侧时间轴轨道 + 主题色圆点 */
.timeline-sheet :deep(.module-work .resume-item),
.timeline-sheet :deep(.module-projects .resume-item),
.timeline-sheet :deep(.module-custom .resume-item) {
  position: relative;
  margin-left: 4px;
  padding-left: 14px;
  border-left: 2px solid #e2e8f0;
}
.timeline-sheet :deep(.module-work .resume-item::before),
.timeline-sheet :deep(.module-projects .resume-item::before),
.timeline-sheet :deep(.module-custom .resume-item::before) {
  content: '';
  position: absolute;
  left: -5px;
  top: 0.45em;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--tl-theme);
}
</style>