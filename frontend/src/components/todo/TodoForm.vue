<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        {{ todo ? 'TODO Edit' : 'New TODO Item' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.title"
            label="Title"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-select
            v-model="formData.priority"
            :items="priorities"
            label="Priority"
            :rules="[rules.required]"
            required
          ></v-select>

          <v-select
            v-model="formData.groupId"
            :items="groups"
            label="Group"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
            required
          ></v-select>

          <v-text-field
            v-model="formData.due_date"
            label="Due Date"
            type="date"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" :loading="loading" @click="handleSubmit">
          {{ todo ? 'Edit' : 'Add' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Todo {
  id?: number
  title: string
  priority: number
  groupId?: number | null | undefined
  due_date: string
}

interface Group {
  id: number
  name: string
}

const props = defineProps<{
  todo?: Todo | null | undefined
  groups: Group[]
}>()

const emit = defineEmits<{
  (e: 'save', todo: Todo): void
  (e: 'close'): void
}>()

const dialog = ref(true)
const form = ref(null)
const loading = ref(false)

const priorities = [1, 2, 3]

const formData = reactive({
  title: props.todo?.title || '',
  priority: props.todo?.priority || 1,
  groupId: props.todo?.groupId || null,
  due_date: props.todo?.due_date || new Date().toISOString().split('T')[0],
})

const rules = {
  required: (v: any) => !!v || 'Mandatory field',
}

const handleSubmit = async () => {
  //   if (!form.value?.validate()) return

  loading.value = true
  try {
    const todoData = {
      ...formData,
      id: props.todo?.id,
    }
    emit('save', todoData)
    closeDialog()
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  dialog.value = false
  emit('close')
}
</script>
