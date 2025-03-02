import { defineStore } from 'pinia'
import api from '@/services/api'

interface Todo {
  id: number
  title: string
  completed: boolean
  priority: number
  due_date: string
  group?: {
    id: number
    name: string
  }
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    activeTodos: [] as Todo[],
    completedTodos: [] as Todo[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchTodos(completed: boolean) {
      this.loading = true
      try {
        const response = await api.get(`/todo-items?completed=${completed}`)
        if (completed) {
          this.completedTodos = response.data
        } else {
          this.activeTodos = response.data
        }
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        this.loading = false
      }
    },

    async toggleComplete(todo: Todo) {
      try {
        await api.patch(`/todo-items/${todo.id}/toggle-complete`)

        if (todo.completed) {
          this.activeTodos = this.activeTodos.filter((t) => t.id !== todo.id)
        } else {
          this.completedTodos = this.completedTodos.filter((t) => t.id !== todo.id)
        }

        await this.fetchTodos(!todo.completed)
      } catch (error) {
        console.error('Error toggling todo:', error)
      }
    },
  },
})
