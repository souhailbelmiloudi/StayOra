<template>
  <div>
    <div class="mb-6">
      <NuxtLink :to="localePath('/admin/apartments')" class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {{ t('apartment.backToList') }}
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.apartments.newTitle') }}</h1>
    </div>

    <AdminApartmentForm @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: computed(() => t('admin.apartments.newMetaTitle')) })

function onSaved(id: string) {
  navigateTo(localePath(`/admin/apartments/${id}`))
}
</script>
