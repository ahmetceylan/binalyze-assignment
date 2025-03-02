<template>
  <div>
    <h1>Aktif Görevler</h1>
    <todo-list
      :todos="store.activeTodos"
      :groups="groupStore.mappedGroups"
      :loading="store.loading"
      @add="showTodoForm()"
      @edit="showTodoForm($event)"
      @delete="handleDelete"
      @toggle-complete="handleToggleComplete"
    ></todo-list>

    <todo-form
      v-if="showForm"
      :todo="selectedTodo"
      :groups="groupStore.mappedGroups"
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
import { useTodoStore } from '@/stores/todo'
import { useGroupStore } from '@/stores/group'

const store = useTodoStore()
const groupStore = useGroupStore()
const showForm = ref(false)
const selectedTodo = ref(null)

const fetchData = async () => {
  try {
    const [todosResponse, groupsResponse] = await Promise.all([
      api.get('/todo-items?completed=false'),
      api.get('/todo-groups'),
    ])
    store.activeTodos = todosResponse.data

    groupStore.groups = groupsResponse.data
  } catch (error) {
    console.error('Eror while loading todo list and groups:', error)
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

onMounted(() => {
  store.fetchTodos(false)
  groupStore.fetchGroups()
})
</script>
