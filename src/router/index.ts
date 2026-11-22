import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'gallery', component: () => import('@/views/TemplateGallery.vue') },
    { path: '/editor', name: 'editor', component: () => import('@/views/EditorView.vue') }
  ]
})

export default router