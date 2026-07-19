<template>
  <div class="flex flex-col items-center text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <component :is="iconComponent" />
    </div>
    <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ service.title }}</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-500">{{ service.description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/types'

const props = defineProps<{
  service: Service
}>()

const iconComponent = computed(() => ({
  template: `<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="${props.service.icon}" /></svg>`,
}))
</script>
