<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.reservations.title') }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ t('admin.reservations.count', { count: reservations.length }) }}</p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-xl bg-gray-100" />
    </div>

    <div v-else-if="reservations.length" class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.reservations.colName') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 sm:table-cell">{{ t('admin.reservations.colEmail') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 md:table-cell">{{ t('admin.reservations.colPhone') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 md:table-cell">{{ t('admin.reservations.colApartment') }}</th>
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.reservations.colDates') }}</th>
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.reservations.colActions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="res in reservations"
              :key="res.id"
              class="transition-colors hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900">{{ res.guest_name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(res.created_at!) }}</p>
              </td>
              <td class="hidden px-4 py-3 text-gray-600 sm:table-cell">{{ res.guest_email }}</td>
              <td class="hidden px-4 py-3 text-gray-600 md:table-cell">{{ res.guest_phone || t('admin.common.dash') }}</td>
              <td class="hidden px-4 py-3 text-gray-600 md:table-cell">{{ (res as any).apartments?.name || t('admin.common.dash') }}</td>
              <td class="px-4 py-3">
                <p class="text-gray-600">{{ res.check_in }} → {{ res.check_out }}</p>
                <p class="text-xs text-gray-400">{{ t('admin.reservations.guest', res.guests) }}</p>
              </td>
              <td class="px-4 py-3">
                <button
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  :title="t('admin.apartments.delete')"
                  @click="handleDelete(res)"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="py-20 text-center">
      <p class="text-gray-500">{{ t('admin.reservations.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReservationRequest } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()

useHead({ title: computed(() => t('admin.reservations.metaTitle')) })

const { success, error: toastError } = useToast()
const { open } = useConfirmModal()
const { getAllReservations, deleteReservation } = useAdminService()
const { formatDate } = useFormatUtils()

const reservations = ref<ReservationRequest[]>([])
const loading = ref(true)

async function loadData() {
  loading.value = true
  try {
    reservations.value = await getAllReservations()
  } catch {
    toastError(t('admin.reservations.loadError'))
  } finally {
    loading.value = false
  }
}

async function handleDelete(res: ReservationRequest) {
  const ok = await open(
    t('admin.reservations.deleteTitle'),
    t('admin.reservations.deleteMessage', { name: res.guest_name }),
    t('admin.confirm.delete'),
  )
  if (!ok) return

  try {
    await deleteReservation(res.id!)
    reservations.value = reservations.value.filter((r) => r.id !== res.id)
    success(t('admin.reservations.deleted'))
  } catch {
    toastError(t('admin.reservations.deleteError'))
  }
}

onMounted(loadData)
</script>
