<script setup lang="ts">
import type { TextStyle } from '@/types/resume'

const props = defineProps<{ modelValue?: TextStyle }>()
const emit = defineEmits<{ 'update:modelValue': [value: TextStyle | undefined] }>()

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40]

function patch(p: Partial<TextStyle>) {
  const next: TextStyle = { ...props.modelValue, ...p }
  if (next.size === undefined) delete next.size
  if (next.bold === undefined) delete next.bold
  emit('update:modelValue', Object.keys(next).length ? next : undefined)
}

const onSize = (e: Event) => {
  const v = (e.target as HTMLSelectElement).value
  patch({ size: v ? Number(v) : undefined })
}
const onBold = (e: Event) => {
  const v = (e.target as HTMLSelectElement).value
  patch({ bold: v === '' ? undefined : v === '1' })
}
</script>

<template>
  <span class="mt-1 flex items-center gap-1">
    <select
      :value="modelValue?.size ?? ''"
      data-testid="field-size"
      title="自定义字号（默认继承全局）"
      class="rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] text-slate-500 outline-none focus:border-teal-400"
      @change="onSize"
    >
      <option value="">字号默认</option>
      <option v-for="s in SIZES" :key="s" :value="String(s)">{{ s }}px</option>
    </select>
    <select
      :value="modelValue?.bold === undefined ? '' : modelValue.bold ? '1' : '0'"
      data-testid="field-bold"
      title="自定义加粗（默认继承模板）"
      class="rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] text-slate-500 outline-none focus:border-teal-400"
      @change="onBold"
    >
      <option value="">加粗默认</option>
      <option value="1">加粗</option>
      <option value="0">不加粗</option>
    </select>
  </span>
</template>