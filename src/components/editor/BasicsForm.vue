<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'
import { fileToAvatarDataUrl } from '@/utils/image'

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
      </label>
      <label class="block text-xs text-slate-500">
        求职岗位
        <input v-model="store.resume.basics.jobTitle" data-field="jobTitle" class="field" type="text" />
      </label>
      <label class="block text-xs text-slate-500">
        电话
        <input v-model="store.resume.basics.phone" data-field="phone" class="field" type="text" />
      </label>
      <label class="block text-xs text-slate-500">
        邮箱
        <input v-model="store.resume.basics.email" data-field="email" class="field" type="text" />
      </label>
      <label class="col-span-2 block text-xs text-slate-500">
        补充信息（城市 / 工作年限等）
        <input v-model="store.resume.basics.extra" data-field="extra" class="field" type="text" />
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
  </section>
</template>