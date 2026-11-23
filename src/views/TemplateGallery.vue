<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TEMPLATES } from '@/templates'
import { useResumeStore } from '@/stores/resume'
import ResumeSheet from '@/components/ResumeSheet.vue'

const router = useRouter()
const store = useResumeStore()

const categories = ['全部', '校招', '社招', '通用'] as const
const active = ref<(typeof categories)[number]>('全部')
const filtered = computed(() =>
  active.value === '全部' ? TEMPLATES : TEMPLATES.filter((t) => t.category === active.value)
)

/** 缩略图使用各模板自带的完整场景示例，不影响用户简历 */
const previews = TEMPLATES.map((t) => t.sample())
const previewFor = (id: string) => previews.find((p) => p.templateId === id)!

const THUMB_W = 300
const SCALE = THUMB_W / 794

/** 一键套用：仅切换模板外观，用户内容不动（既有行为） */
function useTemplate(id: string) {
  store.setTemplate(id)
  router.push('/editor')
}

/** 使用示例内容：显式确认后载入该模板的完整场景示例 */
function useSample(id: string) {
  const tpl = TEMPLATES.find((t) => t.id === id)
  if (!tpl) return
  if (!window.confirm('将载入该模板的完整示例内容，当前简历内容会被覆盖，确定继续？')) return
  store.applyResume(tpl.sample())
  router.push('/editor')
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-10">
    <header class="mb-10 text-center">
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">ResumeMake</h1>
      <p class="mt-2 text-slate-500">选个模板，十分钟做出一份专业简历</p>
      <div class="mt-3 flex items-center justify-center gap-2 text-xs">
        <span class="rounded-full bg-teal-50 px-3 py-1 text-teal-700">完全免费</span>
        <span class="rounded-full bg-teal-50 px-3 py-1 text-teal-700">数据本地保存</span>
        <span class="rounded-full bg-teal-50 px-3 py-1 text-teal-700">一键导出 PDF</span>
        <router-link to="/editor" class="ml-2 text-teal-600 underline-offset-2 hover:underline">继续编辑 →</router-link>
      </div>
    </header>

    <div class="mb-6 flex justify-center gap-2">
      <button
        v-for="c in categories"
        :key="c"
        type="button"
        :data-testid="`filter-${c}`"
        class="rounded-full px-4 py-1.5 text-sm transition-colors"
        :class="active === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'"
        @click="active = c"
      >
        {{ c }}
      </button>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="t in filtered"
        :key="t.id"
        :data-testid="`template-card-${t.id}`"
        class="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
      >
        <div class="relative mx-auto mt-4 overflow-hidden rounded-lg border border-slate-100" :style="{ width: THUMB_W + 'px', height: '424px' }">
          <div class="pointer-events-none absolute left-0 top-0" :style="{ width: '794px', transform: `scale(${SCALE})`, transformOrigin: 'top left' }">
            <ResumeSheet :resume="previewFor(t.id)" />
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-slate-900">{{ t.name }}</h2>
            <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">{{ t.category }}</span>
          </div>
          <div class="mt-1.5 flex flex-wrap gap-1">
            <span v-for="tag in t.tags" :key="tag" class="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] text-teal-700">{{ tag }}</span>
          </div>
          <p class="mt-1 text-xs leading-5 text-slate-500">{{ t.description }}</p>
          <div class="mt-3 flex gap-2">
            <button
              type="button"
              :data-testid="`use-template-${t.id}`"
              class="flex-1 rounded-xl bg-teal-600 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500"
              @click="useTemplate(t.id)"
            >
              使用此模板
            </button>
            <button
              type="button"
              :data-testid="`use-sample-${t.id}`"
              class="flex-1 rounded-xl border border-teal-600 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
              @click="useSample(t.id)"
            >
              使用示例内容
            </button>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>