<script setup lang="ts">
import { computed } from 'vue'
import type { Resume } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'

const props = defineProps<{ resume: Resume }>()
const contactLine = computed(() =>
  [props.resume.basics.phone, props.resume.basics.email, props.resume.basics.extra].filter(Boolean).join(' · ')
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
    <header class="mb-3 flex items-start justify-between gap-4 border-b-2 pb-3" :style="{ borderColor: resume.style.themeColor }">
      <div>
        <h1 class="text-[1.9em] font-bold" :style="{ color: resume.style.themeColor }">{{ resume.basics.name }}</h1>
        <p class="mt-1 font-medium text-slate-700">{{ resume.basics.jobTitle }}</p>
        <p class="mt-1 text-[0.9em] text-slate-500">{{ contactLine }}</p>
      </div>
      <img
        v-if="resume.basics.avatar"
        :src="resume.basics.avatar"
        alt="头像"
        class="h-[24mm] w-[18mm] shrink-0 rounded-lg object-cover"
      />
    </header>
    <ModuleSection
      v-for="m in resume.modules"
      :key="m.id"
      :module="m"
      :theme-color="resume.style.themeColor"
      variant="underline"
    />
  </div>
</template>