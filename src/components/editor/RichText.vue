<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { normalizeFontTags } from '@/utils/richtext'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const el = ref<HTMLElement>()
const sizeChoice = ref('')

const SIZES = [12, 14, 16, 18, 20, 24, 32]

let savedRange: Range | null = null

/** 记录编辑区内的选区，供工具栏（下拉框会夺焦）操作后恢复 */
function saveSelection() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount && el.value && sel.anchorNode && el.value.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  el.value?.focus()
  if (savedRange) {
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(savedRange)
  }
}

onMounted(() => {
  if (el.value) el.value.innerHTML = props.modelValue
  document.addEventListener('selectionchange', saveSelection)
})
onBeforeUnmount(() => document.removeEventListener('selectionchange', saveSelection))

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
  restoreSelection()
  if (typeof document.execCommand === 'function') document.execCommand(cmd)
  onInput()
}

/** 选中文字调字号（默认字号 = 清除）；逐字加粗用 B 按钮 */
function applySize(value: string) {
  sizeChoice.value = ''
  if (!el.value) return
  restoreSelection()
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed) return
  if (typeof document.execCommand === 'function') {
    document.execCommand('fontSize', false, '7')
    normalizeFontTags(el.value, value ? Number(value) : null)
    onInput()
  }
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
    <div class="flex items-center gap-1 border-b border-slate-100 px-2 py-1">
      <button
        type="button"
        title="加粗（选中文字）"
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
      <select
        v-model="sizeChoice"
        data-testid="rich-size"
        title="选中文字后调节字号"
        class="ml-1 rounded border border-slate-200 bg-white px-1 py-0.5 text-xs text-slate-600 outline-none focus:border-teal-400"
        @change="applySize(sizeChoice)"
      >
        <option value="">默认字号</option>
        <option v-for="s in SIZES" :key="s" :value="String(s)">{{ s }}px</option>
      </select>
      <span class="ml-auto hidden text-[10px] text-slate-400 sm:inline">选中文字可加粗 / 调字号</span>
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