<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col>
        <v-card>
          <v-card-title class="text-center">
            {{ isRegister ? 'Register' : 'Login' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="password"
                type="password"
                :rules="[rules.required, rules.min]"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary" block :loading="loading">
                {{ isRegister ? 'Register' : 'Login' }}
              </v-btn>
            </v-form>

            <div class="text-center">
              <v-btn variant="text" @click="toggleAuthMode">
                {{ isRegister ? 'Click here to login' : 'Click here to register' }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const form = ref(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const isRegister = ref(false)

// TODO: handle empty form submit, disable button
// TODO: show api error message to the user
const rules = {
  required: (v: string) => !!v || 'Required field',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Please write a valid email!',
  min: (v: string) => v.length >= 6 || 'en az 6 karakter',
}

const toggleAuthMode = () => {
  isRegister.value = !isRegister.value
}

const handleSubmit = async () => {
  //   if (!form.value?.validate()) return

  loading.value = true
  try {
    const endpoint = isRegister.value ? '/auth/register' : '/auth/login'
    const response = await api.post(endpoint, {
      email: email.value,
      password: password.value,
    })

    if (response.data.success) {
      localStorage.setItem('token', response.data.access_token)
      router.push('/')
    } else {
      console.error('Auth error response:', response.data)
    }
  } catch (error: any) {
    console.error('Auth error:', error)
  } finally {
    loading.value = false
  }
}
</script>
