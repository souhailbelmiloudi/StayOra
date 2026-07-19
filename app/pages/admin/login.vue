<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
          S
        </div>
        <h1 class="mt-4 text-2xl font-bold text-gray-900">StayOra</h1>
        <p class="mt-1 text-sm text-gray-500">{{ t('admin.login.subtitle') }}</p>
      </div>

      <form
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        @submit.prevent="handleLogin"
      >
        <div class="mb-4 flex justify-center">
          <LanguageSwitcher />
        </div>

        <div v-if="errorMsg" class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ errorMsg }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.login.email') }}</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="admin@stayora.com"
              class="input-field"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.login.password') }}</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="input-field"
            />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary mt-6 w-full">
          <svg v-if="loading" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? t('admin.login.submitting') : t('admin.login.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['guest'],
})

const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: computed(() => t('admin.login.metaTitle')) })

const { login } = useAdminAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''

  try {
    await login(email.value, password.value)
    navigateTo(localePath('/admin'))
  } catch (e: any) {
    errorMsg.value = e.message?.includes('Invalid login credentials')
      ? t('admin.login.invalidCredentials')
      : t('admin.login.error')
  } finally {
    loading.value = false
  }
}
</script>
