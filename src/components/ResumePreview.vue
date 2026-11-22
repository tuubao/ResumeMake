<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Resume } from '@/types/resume'
import ResumeSheet from './ResumeSheet.vue'

defineProps<{ resume: Resume }>()

/** A4 在 96dpi 下的像素尺寸 */
const A4_W = 794
const A4_H = 1123

const container = ref<HTMLElement>()
const sheetWrap = ref<HTMLElement>()
const scale = ref(1)
const sheetHeight = ref(A4_H)
let ro: ResizeObserver | undefined

function update() {
  if (container.value) scale.value = Math.min(1, container.value.clientWidth / A4_W)
  const sheet = sheetWrap.value?.firstElementChild as HTMLElement | undefined
  if (sheet) sheetHeight.value = Math.max(A4_H, sheet.offsetHeight)
}

onMounted(() => {
  update()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(update)
    if (container.value) ro.observe(container.value)
    const sheet = sheetWrap.value?.firstElementChild
    if (sheet) ro.observe(sheet)
  }
})
onBeforeUnmount(() => ro?.disconnect())

const pages = computed(() => Math.ceil(sheetHeight.value / A4_H))
</script>

<template>
  <div ref="container" class="w-full">
    <div
      class="relative mx-auto"
      :style="{ width: A4_W * scale + 'px', height: sheetHeight * scale + 'px' }"
    >
      <div
        ref="sheetWrap"
        class="absolute left-0 top-0 shadow-lg"
        :style="{ width: A4_W + 'px', transform: `scale(${scale})`, transformOrigin: 'top left' }"
      >
        <ResumeSheet :resume="resume" />
        <!-- 分页参考线 -->
        <div class="pointer-events-none absolute inset-0 print:hidden">
          <div
            v-for="k in pages - 1"
            :key="k"
            class="absolute left-0 right-0 border-t-2 border-dashed border-rose-300"
            :style="{ top: k * A4_H + 'px' }"
          >
            <span class="absolute right-1 top-0 rounded bg-rose-100 px-1 text-[10px] text-rose-500">第 {{ k + 1 }} 页</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>