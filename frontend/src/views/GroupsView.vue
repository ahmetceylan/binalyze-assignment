<template>
  <div>
    <h1>Gruplar</h1>

    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="showGroupForm()">Yeni Grup</v-btn>
      </v-card-text>
    </v-card>

    <div v-if="store.loading" class="d-flex justify-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else-if="!groupStore.groups?.length" class="text-center">
      <div class="text-h3 text-grey">Henüz hiç grup oluşturulmamış!</div>
    </div>

    <template v-else>
      <v-card v-for="group in groupStore.groups" :key="group.group_id" class="my-3">
        <v-card-text>
          <div class="d-flex align-center">
            <div class="flex-grow-1">
              <div class="text-h6">{{ group.group_name }}</div>
              <div class="text-caption text-grey">
                Bu grupta {{ group.todocount || 0 }} görev var
              </div>
            </div>
            <div>
              <v-btn size="small" text="Düzenle" @click="showGroupForm(group)" />
              <v-btn
                size="small"
                text="Sil"
                color="error"
                @click="groupStore.deleteGroup(group.group_id)"
                :disabled="group.todocount > 0"
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
import { useGroupStore } from '@/stores/group'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const groupStore = useGroupStore()
const showForm = ref(false)
const formLoading = ref(false)
const selectedGroup = ref(null)
const form = ref(null)

const formData = reactive({
  name: '',
})

const rules = {
  required: (v: any) => !!v || 'Bu alan zorunludur',
}

const showGroupForm = (group = null) => {
  selectedGroup.value = group
  if (group) {
    formData.name = group.group_name
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
      await groupStore.updateGroup(selectedGroup.value.group_id, formData.name)
    } else {
      await groupStore.createGroup(formData.name)
    }
    closeForm()
  } finally {
    formLoading.value = false
  }
}

onMounted(() => {
  store.fetchTodos(false)
  groupStore.fetchGroups()
})
</script>
