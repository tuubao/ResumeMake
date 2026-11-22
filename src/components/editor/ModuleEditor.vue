<script setup lang="ts">
import type { ResumeModule } from '@/types/resume'
import { useResumeStore } from '@/stores/resume'
import ItemEditor from './ItemEditor.vue'
import TextStyleControls from './TextStyleControls.vue'

defineProps<{ module: ResumeModule }>()
const store = useResumeStore()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4">
    <div class="mb-3 flex items-start justify-between gap-2">
      <div class="w-full">
        <input
          v-model="module.title"
          data-field="module-title"
          class="w-full rounded-lg border border-transparent px-2 py-1 text-sm font-bold text-slate-900 hover:border-slate-200 focus:border-teal-400 focus:outline-none"
          type="text"
        />
        <TextStyleControls :model-value="module.titleStyle" @update:model-value="store.updateModule(module.id, { titleStyle: $event })" />
      </div>
      <button
        type="button"
        data-testid="remove-module"
        class="shrink-0 text-xs text-slate-400 hover:text-rose-500"
        @click="store.removeModule(module.id)"
      >
        删除模块
      </button>
    </div>
    <div class="space-y-3">
      <ItemEditor v-for="item in module.items" :key="item.id" :module-id="module.id" :item="item" :type="module.type" />
    </div>
    <button
      type="button"
      data-testid="add-item"
      class="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-1.5 text-xs text-slate-500 hover:border-teal-400 hover:text-teal-600"
      @click="store.addItem(module.id)"
    >
      + 添加条目
    </button>
  </section>
</template>