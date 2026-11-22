<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { fileToAvatarDataUrl } from '@/utils/image'
import { ICON_OPTIONS } from '@/utils/icons'
import type { HeaderIcon } from '@/types/resume'
import TextStyleControls from './TextStyleControls.vue'

const store = useResumeStore()

async function onAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    store.updateBasics({ avatar: await fileToAvatarDataUrl(file) })
  } catch {
    // 非法图片忽略
  }
  input.value = ''
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4">
    <h3 class="mb-3 text-sm font-bold text-slate-900">基本信息</h3>
    <div class="grid grid-cols-2 gap-3">
      <label class="block text-xs text-slate-500">
        姓名
        <input v-model="store.resume.basics.name" data-field="name" class="field" type="text" />
        <TextStyleControls :model-value="store.resume.basics.styles?.name" @update:model-value="store.updateBasicStyle('name', $event)" />
      </label>
      <label class="block text-xs text-slate-500">
        求职岗位
        <input v-model="store.resume.basics.jobTitle" data-field="jobTitle" class="field" type="text" />
        <TextStyleControls :model-value="store.resume.basics.styles?.jobTitle" @update:model-value="store.updateBasicStyle('jobTitle', $event)" />
      </label>
      <label class="block text-xs text-slate-500">
        电话
        <input v-model="store.resume.basics.phone" data-field="phone" class="field" type="text" />
        <TextStyleControls :model-value="store.resume.basics.styles?.phone" @update:model-value="store.updateBasicStyle('phone', $event)" />
      </label>
      <label class="block text-xs text-slate-500">
        邮箱
        <input v-model="store.resume.basics.email" data-field="email" class="field" type="text" />
        <TextStyleControls :model-value="store.resume.basics.styles?.email" @update:model-value="store.updateBasicStyle('email', $event)" />
      </label>
      <label class="col-span-2 block text-xs text-slate-500">
        补充信息（城市 / 工作年限等）
        <input v-model="store.resume.basics.extra" data-field="extra" class="field" type="text" />
        <TextStyleControls :model-value="store.resume.basics.styles?.extra" @update:model-value="store.updateBasicStyle('extra', $event)" />
      </label>
    </div>
    <div class="mt-3 flex items-center gap-3">
      <img
        v-if="store.resume.basics.avatar"
        :src="store.resume.basics.avatar"
        alt="头像预览"
        class="h-14 w-11 rounded object-cover"
      />
      <label class="cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:border-teal-400 hover:text-teal-600">
        上传头像
        <input type="file" accept="image/*" class="hidden" data-field="avatar" @change="onAvatarChange" />
      </label>
      <button
        v-if="store.resume.basics.avatar"
        type="button"
        class="text-xs text-slate-400 hover:text-rose-500"
        @click="store.updateBasics({ avatar: '' })"
      >
        移除头像
      </button>
    </div>

    <div class="mt-3 space-y-2 border-t border-slate-100 pt-3">
      <p class="text-xs text-slate-500">自定义信息（显示在姓名下方信息行）</p>
      <div v-for="f in store.resume.basics.customFields" :key="f.id" class="space-y-1">
        <div class="flex items-center gap-2">
          <select
            :value="f.icon"
            data-field="custom-icon"
            class="w-20 shrink-0 rounded-lg border border-slate-200 bg-white px-1.5 py-1.5 text-xs text-slate-700 outline-none focus:border-teal-400"
            @change="store.updateCustomField(f.id, { icon: ($event.target as HTMLSelectElement).value as HeaderIcon })"
          >
            <option v-for="opt in ICON_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <input
            :value="f.value"
            data-field="custom-value"
            class="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none focus:border-teal-400"
            type="text"
            placeholder="如：某某大学（本科-2026.6 毕业）"
            @input="store.updateCustomField(f.id, { value: ($event.target as HTMLInputElement).value })"
          />
          <button
            type="button"
            data-testid="remove-custom-field"
            class="shrink-0 text-xs text-slate-400 hover:text-rose-500"
            @click="store.removeCustomField(f.id)"
          >
            删除
          </button>
        </div>
        <TextStyleControls :model-value="f.style" @update:model-value="store.updateCustomField(f.id, { style: $event })" />
      </div>
      <button
        type="button"
        data-testid="add-custom-field"
        class="w-full rounded-lg border border-dashed border-slate-300 py-1.5 text-xs text-slate-500 hover:border-teal-400 hover:text-teal-600"
        @click="store.addCustomField()"
      >
        + 自定义信息
      </button>
    </div>
  </section>
</template>