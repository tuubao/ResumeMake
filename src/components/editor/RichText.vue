<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const el = ref<HTMLElement>()

onMounted(() => {
  if (el.value) el.value.innerHTML = props.modelValue
})

watch(
  () => props.modelValue,
  (v) => {
    if (el.value && el.value.innerHTML !== v) el.value.innerHTML = v
  }
)

function onInput() {
  emit('update:modelValue', el.value?.innerHTML ?? '')
}

function exec(cmd: 'bold' | 'insertUnorderedList') {
  el.value?.focus()
  if (typeof document.execCommand === 'function') document.execCommand(cmd)
  onInput()
}

/** 粘贴仅保留纯文本，避免带入外部 HTML/脚本 */
function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''
  if (typeof document.execCommand === 'function') document.execCommand('insertText', false, text)
  onInput()
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-teal-400">
    <div class="flex gap-1 border-b border-slate-100 px-2 py-1">
      <button
        type="button"
        title="加粗"
        class="rounded px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
        @mousedown.prevent="exec('bold')"
      >
        B
      </button>
      <button
        type="button"
        title="无序列表"
        class="rounded px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
        @mousedown.prevent="exec('insertUnorderedList')"
      >
        ≡ 列表
      </button>
    </div>
    <div
      ref="el"
      contenteditable="true"
      :data-placeholder="placeholder"
      class="rich-input min-h-[64px] px-3 py-2 text-sm outline-none"
      @input="onInput"
      @paste="onPaste"
    ></div>
  </div>
</template>