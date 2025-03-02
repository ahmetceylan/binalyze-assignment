<template>
  <v-card class="mx-auto my-3" elevation="2" max-width="800px">
    <v-card-text>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-3">
          <div class="flex-grow-1">
            <span class="text-h6" :class="{ 'text-decoration-line-through': todo.completed }">
              {{ todo.title }}
            </span>
          </div>
          <v-chip size="small" :color="getPriorityColor" class="ml-2">
            Priority: {{ todo.priority }}
          </v-chip>
        </div>

        <div class="d-flex align-center mb-3">
          <v-chip size="small" color="primary" class="mr-2" v-if="todo.group">
            Group: {{ todo.group.name }}
          </v-chip>
          <span class="text-caption">Due date: {{ formatDate(todo.due_date) }}</span>
        </div>

        <!-- Butonlar -->
        <div class="d-flex flex-column gap-2">
          <v-btn
            block
            :color="todo.completed ? 'warning' : 'success'"
            @click="$emit('toggle-complete', todo.id)"
          >
            {{ todo.completed ? 'Re-activate' : 'Mark as completed' }}
          </v-btn>

          <v-btn v-if="!todo.completed" block color="primary" @click="$emit('edit', todo)">
            Update
          </v-btn>

          <v-btn block color="error" @click="$emit('delete', todo.id)"> Delete </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'

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
  todo: Todo
}>()

defineEmits<{
  (e: 'toggle-complete', id: number): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
}>()

const store = useTodoStore()
const localCompleted = ref(props.todo.completed)

const getPriorityColor = computed(() => {
  const colors = {
    low: 'green', // priority 1
    medium: 'orange', //priority 2
    high: 'red', // priority 3
  }
  const priority = props.todo.priority < 2 ? 'low' : props.todo.priority > 2 ? 'high' : 'medium'
  return colors[priority]
})

const formatDate = (date: string) => {
  console.log('AHMET date', date)
  return new Date(date).toLocaleString('tr-TR', { timeZone: 'UTC' })
}

const handleToggleComplete = async () => {
  try {
    await store.toggleComplete(props.todo)
  } catch (error) {
    console.error('Error toggling todo completion:', error)
  }
}
</script>
