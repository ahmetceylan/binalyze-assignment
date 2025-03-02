import { defineStore } from 'pinia'
import api from '../services/api'

interface InputGroup {
  group_id: number
  group_name: string
  group_created_at: string
  group_updated_at: string
  group_userId: number
  todocount: string
}

interface Group {
  id: number
  name: string
  todocount?: string
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as InputGroup[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    mappedGroups(): Group[] {
      return this.groups.map(
        (group: InputGroup) =>
          ({
            id: group.group_id,
            name: group.group_name,
            todocount: group.todocount,
          }) as Group,
      )
    },
  },

  actions: {
    async fetchGroups() {
      this.loading = true
      try {
        const response = await api.get('/todo-groups')
        this.groups = response.data
      } catch (error) {
        console.error('Error fetching groups:', error)
      } finally {
        this.loading = false
      }
    },

    async createGroup(name: string) {
      try {
        await api.post('/todo-groups', { name })
        await this.fetchGroups()
      } catch (error) {
        console.error('Error creating group:', error)
      }
    },

    async updateGroup(id: number, name: string) {
      try {
        await api.patch(`/todo-groups/${id}`, { name })
        await this.fetchGroups()
      } catch (error) {
        console.error('Error updating group:', error)
      }
    },

    async deleteGroup(id: number) {
      try {
        await api.delete(`/todo-groups/${id}`)
        await this.fetchGroups()
      } catch (error) {
        console.error('Error deleting group:', error)
      }
    },
  },
})
