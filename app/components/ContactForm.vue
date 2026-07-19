<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.name') }}</label>
        <input
          v-model="form.guest_name"
          type="text"
          required
          :placeholder="t('form.namePlaceholder')"
          class="input-field"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.email') }}</label>
        <input
          v-model="form.guest_email"
          type="email"
          required
          :placeholder="t('form.emailPlaceholder')"
          class="input-field"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.phone') }}</label>
        <input
          v-model="form.guest_phone"
          type="tel"
          placeholder="+34 600 000 000"
          class="input-field"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.guests') }}</label>
        <input
          v-model.number="form.guests"
          type="number"
          min="1"
          max="20"
          required
          class="input-field"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.checkIn') }}</label>
        <input
          v-model="form.check_in"
          type="date"
          required
          :min="todayStr"
          class="input-field"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.checkOut') }}</label>
        <input
          v-model="form.check_out"
          type="date"
          required
          :min="form.check_in || todayStr"
          class="input-field"
        />
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('form.message') }}</label>
      <textarea
        v-model="form.message"
        rows="4"
        :placeholder="t('form.messagePlaceholder')"
        class="input-field resize-none"
      />
    </div>

    <div v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
      {{ t('form.error') }}
    </div>

    <div v-if="success" class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
      {{ t('form.success') }}
    </div>

    <button type="submit" :disabled="loading" class="btn-primary w-full">
      <svg v-if="loading" class="me-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {{ loading ? t('form.sending') : t('form.submit') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { ReservationRequest } from '~/types'

const props = defineProps<{
  apartmentId?: string
}>()

const { t } = useI18n()
const { submitRequest } = useReservationService()

const todayStr = computed(() => new Date().toISOString().split('T')[0])

const form = reactive<Omit<ReservationRequest, 'id' | 'created_at'>>({
  apartment_id: props.apartmentId || '',
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  check_in: '',
  check_out: '',
  guests: 1,
  message: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = false
  success.value = false

  try {
    const ok = await submitRequest(form)
    if (ok) {
      success.value = true
      Object.assign(form, {
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        check_in: '',
        check_out: '',
        guests: 1,
        message: '',
      })
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
