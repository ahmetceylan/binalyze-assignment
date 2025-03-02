<template>
  <div>
    <h1>Tamamlanan Görevler</h1>
    <todo-list
      :todos="todos"
      :groups="groups"
      :loading="loading"
      @delete="handleDelete"
      @toggle-complete="handleToggleComplete"
    ></todo-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TodoList from '@/components/todo/TodoList.vue'
import api from '@/services/api'

const todos = ref([])
const groups = ref([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const [todosResponse, groupsResponse] = await Promise.all([
      api.get('/todo-items?completed=true'),
      api.get('/todo-groups'),
    ])
    todos.value = todosResponse.data
    groups.value = groupsResponse.data
  } catch (error) {
    console.error('Error while loading completed todo list:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  try {
    await api.delete(`/todo-items/${id}`)
    fetchData()
  } catch (error) {
    console.error('Error while deleting todo item:', error)
  }
}

const handleToggleComplete = async (id) => {
  try {
    await api.patch(`/todo-items/${id}/toggle-complete`)
    fetchData()
  } catch (error) {
    console.error('Error while changing complete status of todo item:', error)
  }
}

onMounted(fetchData)
</script>
