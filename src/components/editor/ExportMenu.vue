<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { toJpeg } from 'html-to-image'
import { useResumeStore } from '@/stores/resume'
import { buildResumeDocx } from '@/utils/docx'
import { downloadBlob, downloadDataUrl } from '@/utils/download'

const store = useResumeStore()
const open = ref(false)
const busy = ref(false)
const root = ref<HTMLElement>()

const baseName = () => (store.resume.basics.name || '简历') + '-简历'

/** 点击菜单外部或按 Esc 关闭；不能用 mouseleave（按钮与菜单间的间隙会误触发） */
function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})

function exportPdf() {
  open.value = false
  window.print()
}

async function exportJpg() {
  open.value = false
  const node = document.querySelector('main .resume-sheet') as HTMLElement | null
  if (!node) return
  busy.value = true
  try {
    const dataUrl = await toJpeg(node, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff' })
    downloadDataUrl(dataUrl, baseName() + '.jpg')
  } catch {
    window.alert('JPG 导出失败，请重试')
  }
  busy.value = false
}

async function exportDocx() {
  open.value = false
  busy.value = true
  try {
    const blob = await buildResumeDocx(store.resume)
    downloadBlob(blob, baseName() + '.docx')
  } catch {
    window.alert('Word 导出失败，请重试')
  }
  busy.value = false
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      data-testid="export-menu"
      class="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-60"
      :disabled="busy"
      @click="open = !open"
    >
      {{ busy ? '导出中…' : '导出 ▾' }}
    </button>
    <div v-if="open" class="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
      <button type="button" data-testid="export-pdf" class="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" @click="exportPdf">
        PDF（打印）
      </button>
      <button type="button" data-testid="export-jpg" class="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" @click="exportJpg">
        JPG 图片
      </button>
      <button type="button" data-testid="export-docx" class="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" @click="exportDocx">
        Word（.docx）
      </button>
    </div>
  </div>
</template>