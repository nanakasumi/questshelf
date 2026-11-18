import { createRouter, createWebHistory } from 'vue-router'

import DiscoverView from '../views/DiscoverView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'discover',
      component: DiscoverView
    },
    {
      path: '/library/overview',
      name: 'library-overview',
      component: () => import('../views/LibraryOverviewView.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue')
    },
  ],
})

export default router
