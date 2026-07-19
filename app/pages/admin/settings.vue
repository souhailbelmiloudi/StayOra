<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.settings.title') }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ t('admin.settings.subtitle') }}</p>
    </div>

    <AdminSettingsForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()

useHead({ title: computed(() => t('admin.settings.metaTitle')) })
</script>
