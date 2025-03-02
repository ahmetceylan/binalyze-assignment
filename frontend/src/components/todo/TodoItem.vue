<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-checkbox
          v-model="todo.completed"
          @change="$emit('toggle-complete', todo.id)"
        ></v-checkbox>

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
          <v-btn size="small" text="Edit" @click="$emit('edit', todo)" />
          <v-btn size="small" text="Delete" color="error" @click="$emit('delete', todo.id)" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
</script>
