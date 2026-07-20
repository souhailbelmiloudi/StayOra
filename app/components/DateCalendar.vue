<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('calendar.title') }}</h3>

    <div class="mb-4 grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-xs text-gray-500">{{ t('calendar.checkIn') }}</label>
        <input
          type="date"
          :value="checkIn"
          :min="todayStr"
          class="input-field"
          @input="onCheckInChange"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs text-gray-500">{{ t('calendar.checkOut') }}</label>
        <input
          type="date"
          :value="checkOut"
          :min="checkIn || todayStr"
          class="input-field"
          :disabled="!checkIn"
          @input="onCheckOutChange"
        />
      </div>
    </div>

    <div v-if="nights > 0" class="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
      <span class="font-medium text-gray-900">{{ t('calendar.nights', nights) }}</span>
      <span v-if="pricePerNight" class="ms-2">
        · {{ formatPrice(pricePerNight * nights) }} {{ t('calendar.total') }}
      </span>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pricePerNight?: number
}>()

const { t } = useI18n()
const { checkIn, checkOut, nights } = useDateRange()
const { formatPrice } = useCurrency()

const emit = defineEmits<{
  'update:checkIn': [value: string]
  'update:checkOut': [value: string]
}>()

const todayStr = computed(() => new Date().toISOString().split('T')[0])

function onCheckOutChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  checkOut.value = val
  emit('update:checkOut', val)
}

function onCheckInChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  checkIn.value = val
  checkOut.value = ''
  emit('update:checkIn', val)
  emit('update:checkOut', '')
}

defineExpose({ checkIn, checkOut, nights })
</script>
