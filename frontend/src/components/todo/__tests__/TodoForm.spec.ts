import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from '../TodoForm.vue'

describe('TodoForm.vue', () => {
  const mockGroups = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
  ]

  it('renders form fields correctly', () => {
    const wrapper = mount(TodoForm, {
      props: {
        groups: mockGroups,
        todo: null,
      },
    })

    expect(wrapper.find('input[data-label="Title"]').exists()).toBe(true)
    expect(wrapper.find('select[data-label="Priority"]').exists()).toBe(true)
    expect(wrapper.find('select[data-label="Group"]').exists()).toBe(true)
    expect(wrapper.find('input[data-label="Date"]').exists()).toBe(true)
  })
})
