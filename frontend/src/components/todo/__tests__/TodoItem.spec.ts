import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'

describe('TodoItem.vue', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
    priority: 2,
    due_date: '2024-03-20',
    group: {
      id: 1,
      name: 'Test Group',
    },
  }

  it('renders todo title correctly', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo },
    })
    expect(wrapper.text()).toContain('Test Todo')
  })

  it('shows correct priority', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo },
    })
    expect(wrapper.text()).toContain('Priority: 2')
  })
})
