<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center gap-3">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl"
        :class="colorClass"
      >
        <span v-html="icon" />
      </div>
      <div>
        <p class="text-sm text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
    </div>
    <p v-if="subtitle" class="mt-3 text-xs text-gray-400">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  colorClass: string
  subtitle?: string
}>()
</script>
