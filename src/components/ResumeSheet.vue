<script setup lang="ts">
import { computed } from 'vue'
import type { Resume } from '@/types/resume'
import { getTemplate } from '@/templates'

const props = defineProps<{ resume: Resume }>()
const template = computed(() => getTemplate(props.resume.templateId))
</script>

<template>
  <div
    class="resume-sheet bg-white text-slate-800"
    :style="{ width: '210mm', minHeight: '297mm', padding: resume.style.pageMargin + 'mm' }"
  >
    <component :is="template.component" :resume="resume" />
  </div>
</template>