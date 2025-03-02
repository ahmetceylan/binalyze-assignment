import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CompletedTodosView from '../views/CompletedTodosView.vue'
import GroupsView from '../views/GroupsView.vue'
import ActiveTodosView from '../views/ActiveTodosView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'Layout',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'ActiveTodos',
          component: ActiveTodosView,
        },
        {
          path: 'completed',
          name: 'CompletedTodos',
          component: CompletedTodosView,
        },
        {
          path: 'groups',
          name: 'Groups',
          component: GroupsView,
        },
      ],
    },
  ],
})

// Navigasyon koruması
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
