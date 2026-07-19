<template>
  <form class="space-y-6" @submit.prevent="handleSave">
    <div class="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.settings.businessData') }}</h3>
      <div class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.businessName') }}</label>
            <input v-model="form.name" type="text" class="input-field" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.phone') }}</label>
            <input v-model="form.phone" type="tel" class="input-field" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.whatsapp') }}</label>
            <input v-model="form.whatsapp" type="tel" placeholder="34600000000" class="input-field" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.email') }}</label>
            <input v-model="form.email" type="email" class="input-field" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.address') }}</label>
          <input v-model="form.address" type="text" class="input-field" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.description') }}</label>
          <textarea v-model="form.description" rows="3" class="input-field resize-none" />
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.settings.social') }}</h3>
      <div class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.instagram') }}</label>
            <input v-model="form.instagram" type="text" placeholder="https://instagram.com/..." class="input-field" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.facebook') }}</label>
            <input v-model="form.facebook" type="text" placeholder="https://facebook.com/..." class="input-field" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.tiktok') }}</label>
            <input v-model="form.tiktok" type="text" placeholder="https://tiktok.com/..." class="input-field" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.googleMaps') }}</label>
            <input v-model="form.google_maps_url" type="text" placeholder="https://maps.google.com/..." class="input-field" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.settings.airbnb') }}</label>
          <input
            v-model="form.airbnb_url"
            type="url"
            placeholder="https://www.airbnb.es/rooms/..."
            class="input-field"
          />
          <p class="mt-1.5 text-xs text-gray-400">
            {{ t('admin.settings.airbnbHint') }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button type="submit" :disabled="saving" class="btn-primary">
        <svg v-if="saving" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ saving ? t('admin.settings.saving') : t('admin.settings.save') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { BusinessSettings } from '~/types'

const { t } = useI18n()
const { success, error: toastError } = useToast()
const { getSettings, updateSettings } = useAdminService()

const saving = ref(false)

const form = reactive<BusinessSettings>({
  name: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  google_maps_url: '',
  airbnb_url: '',
})

onMounted(async () => {
  const settings = await getSettings()
  Object.assign(form, settings)
})

async function handleSave() {
  saving.value = true
  try {
    await updateSettings({ ...form })
    success(t('admin.settings.saved'))
  } catch {
    toastError(t('admin.settings.saveError'))
  } finally {
    saving.value = false
  }
}
</script>
