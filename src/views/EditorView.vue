<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { MODULE_TYPE_LABELS, type ModuleType } from '@/types/resume'
import ResumePreview from '@/components/ResumePreview.vue'
import BasicsForm from '@/components/editor/BasicsForm.vue'
import ModuleEditor from '@/components/editor/ModuleEditor.vue'
import StylePanel from '@/components/editor/StylePanel.vue'
import ExportMenu from '@/components/editor/ExportMenu.vue'
import { TEMPLATES } from '@/templates'

const store = useResumeStore()
const moduleTypes = Object.keys(MODULE_TYPE_LABELS) as ModuleType[]

function resetSample() {
  if (window.confirm('确定重置为示例内容？当前内容将被覆盖。')) store.resetToSample()
}
</script>

<template>
  <div class="flex h-screen flex-col">
    <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div class="flex items-center gap-3">
        <router-link to="/" class="text-sm text-slate-500 hover:text-teal-600">← 模板中心</router-link>
        <span class="text-sm font-bold text-slate-900">ResumeMake</span>
      </div>
      <div class="flex items-center gap-2">
        <select
          :value="store.resume.templateId"
          data-field="template"
          class="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          @change="store.setTemplate(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="t in TEMPLATES" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button type="button" class="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100" @click="resetSample">
          重置示例
        </button>
        <ExportMenu />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="w-[420px] shrink-0 space-y-4 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
        <BasicsForm />
        <ModuleEditor v-for="m in store.resume.modules" :key="m.id" :module="m" />
        <section class="rounded-xl border border-dashed border-slate-300 p-3">
          <p class="mb-2 text-xs text-slate-500">添加模块</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in moduleTypes"
              :key="t"
              type="button"
              data-testid="add-module"
              class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-teal-400 hover:text-teal-600"
              @click="store.addModule(t)"
            >
              + {{ MODULE_TYPE_LABELS[t] }}
            </button>
          </div>
        </section>
        <StylePanel />
      </aside>
      <main class="flex-1 overflow-y-auto bg-slate-200/70 p-6">
        <ResumePreview :resume="store.resume" />
      </main>
    </div>
  </div>
</template>