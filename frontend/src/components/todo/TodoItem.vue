<template>
  <v-card class="mx-auto my-3" elevation="16" max-width="450">
    <v-card-text>
      <div class="d-flex">
        <div class="flex-grow-1">
          <div class="d-flex">
            <span :class="{ 'text-decoration-line-through': todo.completed }">
              {{ todo.title }}
            </span>

            <v-chip size="small" :color="getPriorityColor">
              {{ todo.priority }}
            </v-chip>
          </div>

          <div class="text-caption text-grey">
            {{ formatDate(todo.due_date) }} - {{ todo.group?.name }}
          </div>
        </div>

        <div class="ml-2">
          <v-switch
            v-model="localCompleted"
            color="indigo"
            :label="localCompleted ? 'Mark as Not Completed' : 'Mark as Completed'"
            hide-details
            @change="handleToggleComplete"
          ></v-switch>
          <v-btn size="small" text="Edit" @click="$emit('edit', todo)" />
          <v-btn size="small" text="Delete" color="error" @click="$emit('delete', todo.id)" />
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
  return new Date(date).toLocaleDateString('tr-TR')
}

const handleToggleComplete = async () => {
  try {
    await store.toggleComplete(props.todo)
  } catch (error) {
    // Hata durumunda switch'i eski haline getir
    localCompleted.value = !localCompleted.value
  }
}
</script>
