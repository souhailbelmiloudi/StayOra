<template>
  <div class="flex items-start gap-4 rounded-2xl bg-gray-50 p-6">
    <img
      v-if="review.avatar"
      :src="review.avatar"
      :alt="review.name"
      class="h-12 w-12 shrink-0 rounded-full object-cover"
      loading="lazy"
    />
    <div
      v-else
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600"
    >
      {{ review.name.charAt(0).toUpperCase() }}
    </div>
    <div>
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-semibold text-gray-900">{{ review.name }}</h4>
        <span v-if="review.city" class="text-xs text-gray-400">{{ review.city }}</span>
      </div>
      <div class="mt-1 flex gap-0.5">
        <svg
          v-for="i in 5"
          :key="i"
          class="h-3.5 w-3.5"
          :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ review.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/types'

defineProps<{
  review: Review
}>()
</script>
