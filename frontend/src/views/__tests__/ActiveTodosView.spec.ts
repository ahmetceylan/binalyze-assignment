import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ActiveTodosView from '../ActiveTodosView.vue'
import { useTodoStore } from '@/stores/todo'
import { useGroupStore } from '@/stores/group'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

describe('ActiveTodosView.vue', () => {
  const mountView = () => {
    const pinia = createPinia()
    const app = createApp(ActiveTodosView)
    app.use(pinia)

    return mount(ActiveTodosView, {
      global: {
        plugins: [pinia],
      },
    })
  }

  it('shows todo form when add button is clicked', async () => {
    const wrapper = mountView()
    await wrapper.find('[data-test="add-todo"]').trigger('click')
    expect(wrapper.findComponent({ name: 'TodoForm' }).exists()).toBe(true)
  })
})
