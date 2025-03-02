<template>
  <div>
    <h1>Gruplar</h1>

    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="showGroupForm()">New Group</v-btn>
      </v-card-text>
    </v-card>

    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else-if="!groups.length" class="text-center">
      <div class="text-h3 text-grey">There is no group!</div>
    </div>

    <template v-else>
      <v-card v-for="group in groups" :key="group.id" class="my-3">
        <v-card-text>
          <div class="d-flex align-center">
            <div class="flex-grow-1">
              <div class="text-h6">{{ group.name }}</div>
              <div class="text-caption text-grey">
                {{ group.todoCount || 0 }} item created in this group
              </div>
            </div>
            <div>
              <v-btn size="small" text="Düzenle" @click="showGroupForm(group)" />
              <v-btn
                size="small"
                text="Sil"
                color="error"
                @click="handleDelete(group.id)"
                :disabled="group.todoCount > 0"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <v-dialog v-model="showForm" persistent max-width="500px">
      <v-card>
        <v-card-title>
          {{ selectedGroup ? 'Update Group' : 'New Group' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="formData.name"
              label="Group Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeForm">Cancel</v-btn>
          <v-btn color="primary" :loading="formLoading" @click="handleSubmit">
            {{ selectedGroup ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'

interface Group {
  id: number
  name: string
  todoCount?: number
}

const groups = ref<Group[]>([])
const loading = ref(false)
const showForm = ref(false)
const formLoading = ref(false)
const selectedGroup = ref<Group | null>(null)
const form = ref(null)

const formData = reactive({
  name: '',
})

const rules = {
  required: (v: any) => !!v || 'Bu alan zorunludur',
}

const fetchGroups = async () => {
  loading.value = true
  try {
    const response = await api.get('/todo-groups')
    groups.value = response.data
  } catch (error) {
    console.error('Error while loading groups:', error)
  } finally {
    loading.value = false
  }
}

const showGroupForm = (group: Group | null = null) => {
  selectedGroup.value = group
  if (group) {
    formData.name = group.name
  } else {
    formData.name = ''
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedGroup.value = null
  formData.name = ''
}

const handleSubmit = async () => {
  if (!form.value?.validate()) return

  formLoading.value = true
  try {
    if (selectedGroup.value) {
      await api.patch(`/todo-groups/${selectedGroup.value.id}`, formData)
    } else {
      await api.post('/todo-groups', formData)
    }
    fetchGroups()
    closeForm()
  } catch (error) {
    console.error('Error while updating group:', error)
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await api.delete(`/todo-groups/${id}`)
    fetchGroups()
  } catch (error) {
    console.error('Error while deleting group:', error)
  }
}

onMounted(fetchGroups)
</script>
