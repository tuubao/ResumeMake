<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import ResumeSheet from '@/components/ResumeSheet.vue'

const store = useResumeStore()
</script>

<template>
  <div id="app-main">
    <router-view />
  </div>
  <!-- 打印专用根节点：屏幕隐藏，打印时独占页面 -->
  <div id="print-root" class="hidden">
    <ResumeSheet :resume="store.resume" />
  </div>
</template>