<template>
  <div>
    <section class="bg-gray-50 pt-8 pb-16">
      <div class="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ t('apartments.title') }}
          </h1>
          <p class="mt-2 text-gray-500">{{ t('apartments.subtitle') }}</p>
        </div>

        <FilterBar />

        <div class="mt-6 text-sm text-gray-500">
          {{ t('apartments.found', filtered.length) }}
        </div>
      </div>
    </section>

    <section class="px-4 pb-20 sm:px-6 lg:px-8">
      <div class="container-narrow mx-auto">
        <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="card animate-pulse">
            <div class="aspect-[4/3] bg-gray-100" />
            <div class="space-y-3 p-5">
              <div class="h-5 w-3/4 rounded bg-gray-100" />
              <div class="h-4 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        </div>

        <div v-else-if="filtered.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ApartmentCard
            v-for="apt in filtered"
            :key="apt.id"
            :apartment="apt"
          />
        </div>

        <div v-else class="py-20 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ t('apartments.emptyTitle') }}</h3>
          <p class="mt-2 text-gray-500">{{ t('apartments.emptySubtitle') }}</p>
          <button class="btn-secondary mt-4" @click="clearFilters">{{ t('apartments.clearFilters') }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ApartmentWithImages } from '~/types'

const { t } = useI18n()

useHead({
  title: computed(() => t('apartments.metaTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('apartments.metaDescription')),
    },
  ],
})

const { getAllApartments, getCities } = useApartmentService()
const { filterApartments, clearFilters, setCities } = useApartmentFilters()

const { data: apartments, pending } = useAsyncData('all-apartments', async () => {
  const [apts, cityList] = await Promise.all([
    getAllApartments().catch(() => [] as ApartmentWithImages[]),
    getCities().catch(() => [] as string[]),
  ])
  setCities(cityList)
  return apts
})

const filtered = computed(() => {
  if (!apartments.value) return []
  return filterApartments(apartments.value)
})
</script>
