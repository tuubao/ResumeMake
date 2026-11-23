<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderIcon, Resume, TextStyle } from '@/types/resume'
import ModuleSection from './ModuleSection.vue'
import { HEADER_ICONS } from '@/utils/icons'
import { textStyleCss } from '@/utils/textStyle'

const props = defineProps<{ resume: Resume }>()

/** 侧栏承载技能/教育/自评，主栏承载工作/项目/自定义；全部模块均渲染，数据不动 */
const SIDEBAR_TYPES = ['skills', 'education', 'selfEvaluation']
const sideModules = computed(() => props.resume.modules.filter((m) => SIDEBAR_TYPES.includes(m.type)))
const mainModules = computed(() => props.resume.modules.filter((m) => !SIDEBAR_TYPES.includes(m.type)))

type ContactItem = { icon: HeaderIcon; value: string; style?: TextStyle }
const contacts = computed<ContactItem[]>(() =>
  ([
    { icon: 'phone', value: props.resume.basics.phone, style: props.resume.basics.styles?.phone },
    { icon: 'mail', value: props.resume.basics.email, style: props.resume.basics.styles?.email },
    { icon: 'briefcase', value: props.resume.basics.extra, style: props.resume.basics.styles?.extra },
    ...props.resume.basics.customFields.map((f) => ({ icon: f.icon, value: f.value, style: f.style }))
  ] as ContactItem[]).filter((i) => i.value)
)
</script>

<template>
  <div
    class="text-slate-800"
    :style="{
      fontFamily: resume.style.fontFamily,
      fontSize: resume.style.fontSize + 'px',
      lineHeight: resume.style.lineHeight
    }"
  >
    <div class="flex gap-5">
      <!-- 左侧栏：头像 / 联系方式 / 技能 / 教育 / 自评 -->
      <aside class="w-[31%] shrink-0 rounded-lg p-3.5" :style="{ backgroundColor: resume.style.themeColor + '0D' }">
        <img
          v-if="resume.basics.avatar"
          :src="resume.basics.avatar"
          alt="头像"
          class="mx-auto mb-3 h-[26mm] w-[20mm] rounded object-cover"
        />
        <div v-if="contacts.length" class="space-y-1.5 text-[0.9em] text-slate-700">
          <div v-for="(it, i) in contacts" :key="i" class="flex items-start gap-1.5">
            <svg
              v-if="it.icon !== 'none'"
              class="mt-[0.25em] h-[1em] w-[1em] shrink-0"
              :style="{ color: resume.style.themeColor }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="HEADER_ICONS[it.icon]"
            ></svg>
            <span class="break-all" :style="textStyleCss(it.style)">{{ it.value }}</span>
          </div>
        </div>
        <ModuleSection
          v-for="m in sideModules"
          :key="m.id"
          :module="m"
          :theme-color="resume.style.themeColor"
          variant="underline"
        />
      </aside>
      <!-- 主栏：姓名 / 岗位 / 工作 / 项目 / 自定义 -->
      <div class="min-w-0 flex-1">
        <div class="mb-1">
          <h1
            class="font-bold tracking-wide text-slate-900"
            :style="{ fontSize: resume.style.nameSize + 'px', ...textStyleCss(resume.basics.styles?.name) }"
          >
            {{ resume.basics.name }}
          </h1>
          <p
            v-if="resume.basics.jobTitle"
            class="mt-1 text-[1.05em] font-semibold"
            :style="{ color: resume.style.themeColor, ...textStyleCss(resume.basics.styles?.jobTitle) }"
          >
            {{ resume.basics.jobTitle }}
          </p>
        </div>
        <ModuleSection
          v-for="m in mainModules"
          :key="m.id"
          :module="m"
          :theme-color="resume.style.themeColor"
          variant="bar"
        />
      </div>
    </div>
  </div>
</template>