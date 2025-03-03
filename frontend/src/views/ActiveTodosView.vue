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
interface ITodo {
  id?: number | undefined
  title: string
  priority: number
  due_date: string
  groupId?: number | null | undefined
}

const store = useTodoStore()
const groupStore = useGroupStore()
const showForm = ref(false)
const selectedTodo = ref<ITodo | null>(null)
const form = ref<ITodo | null>(null)

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

const showTodoForm = (todo: ITodo | null = null) => {
  selectedTodo.value = todo
  showForm.value = true
}

const handleSave = async (todoData: ITodo) => {
  try {
    if (todoData.id) {
      const { id, ...formData } = todoData
      const todoDataToSave: ITodo = {
        id: id || 0,
        title: formData.title,
        priority: formData.priority,
        groupId: formData.groupId || 0,
        due_date: formData.due_date,
      }
      await api.patch(`/todo-items/${id}`, todoDataToSave)
    } else {
      const todoDataToSave: ITodo = {
        id: 0,
        title: todoData.title,
        priority: todoData.priority,
        groupId: todoData.groupId || 0,
        due_date: todoData.due_date,
      }
      await api.post('/todo-items', todoDataToSave)
    }
    fetchData()
  } catch (error) {
    console.error('Error while saving todo items:', error)
  }
}

const handleDelete = async (id: number) => {
  try {
    await api.delete(`/todo-items/${id}`)
    fetchData()
  } catch (error) {
    console.error('Error while deleting todo item:', error)
  }
}

const handleToggleComplete = async (id: number) => {
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
