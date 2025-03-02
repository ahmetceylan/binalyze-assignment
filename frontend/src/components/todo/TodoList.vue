<template>
  <div>
    <v-card>
      <v-card-text>
        <div class="d-flex align-center">
          <v-text-field
            v-model="filters.search"
            label="Search Item"
            hide-details
            class="mr-2"
          ></v-text-field>

          <v-select
            v-model="filters.group"
            :items="groups"
            label="Groups"
            item-title="name"
            item-value="id"
            hide-details
            class="mr-2"
          ></v-select>

          <v-select
            v-model="filters.priority"
            :items="[null, 1, 2, 3]"
            label="Priority"
            hide-details
            class="mr-2"
          ></v-select>

          <v-text-field
            v-model="filters.due_date"
            label="Due date"
            type="date"
            hide-details
            class="mr-2"
          ></v-text-field>

          <v-btn color="primary" @click="$emit('add')"> New Item </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else-if="!filteredTodos.length" class="text-center">
      <div class="text-h3 text-grey">Could not be any TODO item found!</div>
    </div>

    <template v-else>
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle-complete="$emit('toggle-complete', todo.id)"
        @edit="$emit('edit', todo)"
        @delete="$emit('delete', todo.id)"
      ></todo-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TodoItem from './TodoItem.vue'

//TODO add pagination support
//TODO move interfaces to a common folder
//TODO send a request for every filter operation
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

const props = defineProps<{
  todos: Todo[]
  groups: { id: number; name: string }[]
  loading?: boolean
}>()

defineEmits<{
  (e: 'toggle-complete', id: number): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
  (e: 'add'): void
}>()

const filters = ref({
  search: '',
  group: null as number | null,
  priority: null as number | null,
  due_date: null as string | null,
})

const filteredTodos = computed(() => {
  return props.todos.filter((todo) => {
    if (
      filters.value.search &&
      !todo.title.toLowerCase().includes(filters.value.search.toLowerCase())
    ) {
      return false
    }
    if (filters.value.group && todo.group?.id !== filters.value.group) {
      return false
    }
    if (filters.value.priority && todo.priority !== filters.value.priority) {
      return false
    }
    if (filters.value.due_date) {
      const todoDate = new Date(todo.due_date).toISOString().split('T')[0]

      if (todoDate !== filters.value.due_date) {
        return false
      }
    }
    return true
  })
})
</script>
