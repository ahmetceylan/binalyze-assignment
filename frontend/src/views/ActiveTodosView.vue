<template>
  <div>
    <h1>Aktif Görevler</h1>
    <todo-list
      :todos="todos"
      :groups="groups"
      :loading="loading"
      @add="showTodoForm()"
      @edit="showTodoForm($event)"
      @delete="handleDelete"
      @toggle-complete="handleToggleComplete"
    ></todo-list>

    <todo-form
      v-if="showForm"
      :todo="selectedTodo"
      :groups="groups"
      @save="handleSave"
      @close="showForm = false"
    ></todo-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TodoList from '@/components/todo/TodoList.vue'
import TodoForm from '@/components/todo/TodoForm.vue'
import api from '@/services/api'

const todos = ref([])
const groups = ref([])
const loading = ref(false)
const showForm = ref(false)
const selectedTodo = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const [todosResponse, groupsResponse] = await Promise.all([
      api.get('/todo-items?completed=false'),
      api.get('/todo-groups'),
    ])
    todos.value = todosResponse.data
    groups.value = groupsResponse.data
  } catch (error) {
    console.error('Eror while loading todo list and groups:', error)
  } finally {
    loading.value = false
  }
}

const showTodoForm = (todo = null) => {
  console.log('Selected Todo:', todo)
  selectedTodo.value = todo
  showForm.value = true
}

const handleSave = async (todoData) => {
  try {
    if (todoData.id) {
      const { id, ...formData } = todoData
      await api.patch(`/todo-items/${id}`, formData)
    } else {
      await api.post('/todo-items', todoData)
    }
    fetchData()
  } catch (error) {
    console.error('Error while saving todo items:', error)
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
  console.log('AHMET handleToggleComplete: ', id)
  try {
    await api.patch(`/todo-items/${id}/toggle-complete`)
    fetchData()
  } catch (error) {
    console.error('Error while changing complete status of todo item:', error)
  }
}

onMounted(fetchData)
</script>
