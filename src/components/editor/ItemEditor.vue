<script setup lang="ts">
import { computed } from 'vue'
import type { ModuleItem, ModuleType } from '@/types/resume'
import { useResumeStore } from '@/stores/resume'
import RichText from './RichText.vue'

const props = defineProps<{ moduleId: string; item: ModuleItem; type: ModuleType }>()
const store = useResumeStore()

const hasHeader = computed(() => ['education', 'work', 'projects'].includes(props.type))
const labels = computed(() => {
  switch (props.type) {
    case 'education':
      return { title: '学校', subtitle: '专业 · 学历', content: '在校经历 / 荣誉' }
    case 'work':
      return { title: '公司', subtitle: '职位', content: '工作内容与成果' }
    case 'projects':
      return { title: '项目名称', subtitle: '担任角色', content: '项目描述 / 技术栈 / 亮点' }
    default:
      return { title: '', subtitle: '', content: '内容' }
  }
})

function set(patch: Partial<ModuleItem>) {
  store.updateItem(props.moduleId, props.item.id, patch)
}
</script>

<template>
  <div class="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
    <div v-if="hasHeader" class="grid grid-cols-2 gap-2">
      <label class="block text-xs text-slate-500">
        {{ labels.title }}
        <input :value="item.title" data-field="item-title" class="field" type="text" @input="set({ title: ($event.target as HTMLInputElement).value })" />
      </label>
      <label class="block text-xs text-slate-500">
        {{ labels.subtitle }}
        <input :value="item.subtitle" data-field="item-subtitle" class="field" type="text" @input="set({ subtitle: ($event.target as HTMLInputElement).value })" />
      </label>
      <label class="block text-xs text-slate-500">
        开始时间
        <input :value="item.startDate" data-field="item-start" class="field" type="text" placeholder="2025.03" @input="set({ startDate: ($event.target as HTMLInputElement).value })" />
      </label>
      <label class="block text-xs text-slate-500">
        结束时间
        <input :value="item.endDate" data-field="item-end" class="field" type="text" placeholder="至今" @input="set({ endDate: ($event.target as HTMLInputElement).value })" />
      </label>
    </div>
    <div class="mt-2">
      <RichText :model-value="item.content ?? ''" :placeholder="labels.content" @update:model-value="set({ content: $event })" />
    </div>
    <div class="mt-2 text-right">
      <button type="button" data-testid="remove-item" class="text-xs text-slate-400 hover:text-rose-500" @click="store.removeItem(moduleId, item.id)">
        删除条目
      </button>
    </div>
  </div>
</template>