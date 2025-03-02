<template>
  <div>
    <h1>Tamamlanan Görevler</h1>
    <todo-list
      :todos="store.completedTodos"
      :groups="groupStore.mappedGroups"
      :loading="store.loading"
      @delete="handleDelete"
      @toggle-complete="handleToggleComplete"
    ></todo-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useGroupStore } from '@/stores/group'
import TodoList from '@/components/todo/TodoList.vue'
import api from '@/services/api'

const store = useTodoStore()
const groupStore = useGroupStore()

const fetchData = async () => {
  try {
    const [groupsResponse] = await Promise.all([api.get('/todo-groups')])
    groupStore.groups = groupsResponse.data
  } catch (error) {
    console.error('Error while loading completed todo list:', error)
  }
}

const handleDelete = async (id) => {
  try {
    await api.delete(`/todo-items/${id}`)
    store.fetchTodos(true)
  } catch (error) {
    console.error('Error while deleting todo item:', error)
  }
}

const handleToggleComplete = async (id) => {
  try {
    await api.patch(`/todo-items/${id}/toggle-complete`)
    store.fetchTodos(true)
  } catch (error) {
    console.error('Error while changing complete status of todo item:', error)
  }
}

onMounted(() => {
  store.fetchTodos(true)
  groupStore.fetchGroups()
})
</script>
