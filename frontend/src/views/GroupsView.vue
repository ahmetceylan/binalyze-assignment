<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col>
        <h1 class="mb-4">Gruplar</h1>

        <v-card class="mb-4">
          <v-card-text class="d-flex justify-end">
            <v-btn color="primary" @click="showGroupForm()"> New Group </v-btn>
          </v-card-text>
        </v-card>

        <div v-if="store.loading" class="d-flex justify-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>

        <div v-else-if="!groupStore.groups?.length" class="text-center">
          <div class="text-h3 text-grey">There is no group!</div>
        </div>

        <template v-else>
          <v-card v-for="group in groupStore.groups" :key="group.group_id" class="mb-3">
            <v-card-text>
              <div class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h6">{{ group.group_name }}</div>
                  <div class="text-caption">{{ group.todocount }} items created in this group</div>
                </div>
                <v-btn color="primary" @click="showGroupForm(group)" class="mr-2"> Update </v-btn>
                <v-btn color="error" @click="handleDelete(group.group_id)"> Delete </v-btn>
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
      </v-col>
    </v-row>
  </v-container>
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

const handleDelete = async (groupId: string) => {
  await groupStore.deleteGroup(groupId)
}

onMounted(() => {
  store.fetchTodos(false)
  groupStore.fetchGroups()
})
</script>
