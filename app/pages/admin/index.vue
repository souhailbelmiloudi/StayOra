<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.dashboard.title') }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ t('admin.dashboard.subtitle') }}</p>
    </div>

    <div v-if="stats" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatsCard
        :label="t('admin.dashboard.totalApartments')"
        :value="stats.totalApartments"
        color-class="bg-blue-50 text-blue-600"
        :icon="apartmentIcon"
      />
      <AdminStatsCard
        :label="t('admin.dashboard.published')"
        :value="stats.publishedApartments"
        color-class="bg-green-50 text-green-600"
        :icon="publishIcon"
      />
      <AdminStatsCard
        :label="t('admin.dashboard.reservations')"
        :value="stats.totalReservations"
        color-class="bg-amber-50 text-amber-600"
        :icon="reservationIcon"
      />
      <AdminStatsCard
        :label="t('admin.dashboard.latestReservation')"
        :value="stats.latestReservation || t('admin.common.dash')"
        color-class="bg-purple-50 text-purple-600"
        :icon="userIcon"
        :subtitle="stats.latestApartment ? t('admin.dashboard.apartmentLabel', { name: stats.latestApartment }) : undefined"
      />
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-24 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats } from '~/types/admin'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()

useHead({ title: computed(() => t('admin.dashboard.metaTitle')) })

const { getDashboardStats } = useAdminService()

const stats = ref<DashboardStats | null>(null)

const apartmentIcon = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" /></svg>'
const publishIcon = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const reservationIcon = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>'
const userIcon = '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>'

onMounted(async () => {
  stats.value = await getDashboardStats()
})
</script>
