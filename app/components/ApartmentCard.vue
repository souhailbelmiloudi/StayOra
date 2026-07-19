<template>
  <NuxtLink :to="localePath(`/apartments/${apartment.slug}`)" class="card group">
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
      <img
        v-if="primaryImage"
        :src="imageUrl"
        :alt="primaryImage.alt || apartment.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full items-center justify-center">
        <svg class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21" />
        </svg>
      </div>
      <div v-if="apartment.featured" class="absolute start-3 top-3">
        <span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {{ t('card.featured') }}
        </span>
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-semibold text-gray-900">{{ apartment.name }}</h3>
          <p class="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ apartment.city }}
          </p>
        </div>
        <div class="shrink-0 text-end">
          <span class="text-lg font-bold text-gray-900">{{ formatPrice(apartment.price_per_night) }}</span>
          <span class="text-xs text-gray-400"> {{ t('card.perNight') }}</span>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          {{ t('card.guests', { count: apartment.max_guests }) }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          {{ t('card.bedrooms', { count: apartment.bedrooms }) }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('card.bathroom', apartment.bathrooms) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ApartmentWithImages } from '~/types'

const props = defineProps<{
  apartment: ApartmentWithImages
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { getImageUrl } = useApartmentService()

const primaryImage = computed(() =>
  props.apartment.apartment_images?.find((i) => i.is_primary) ||
  props.apartment.apartment_images?.[0],
)

const imageUrl = computed(() =>
  primaryImage.value ? getImageUrl(primaryImage.value) : '',
)
</script>
