<template>
  <div>
    <div class="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <img
          v-if="sortedImages.length"
          :key="currentIndex"
          :src="currentUrl"
          :alt="sortedImages[currentIndex]?.alt || 'Apartamento'"
          class="h-full w-full object-cover"
        />
      </Transition>

      <button
        v-if="sortedImages.length > 1"
        type="button"
        class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:bg-white"
        @click="prev"
      >
        <svg class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="sortedImages.length > 1"
        type="button"
        class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:bg-white"
        @click="next"
      >
        <svg class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div v-if="sortedImages.length > 1" class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        <button
          v-for="(_, i) in sortedImages"
          :key="i"
          type="button"
          class="h-2 rounded-full transition-all duration-300"
          :class="i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'"
          @click="currentIndex = i"
        />
      </div>
    </div>

    <div v-if="sortedImages.length > 1" class="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
      <button
        v-for="(img, i) in sortedImages"
        :key="img.id"
        type="button"
        class="aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200"
        :class="i === currentIndex ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'"
        @click="currentIndex = i"
      >
        <img
          :src="getImageUrl(img)"
          :alt="img.alt"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApartmentImage } from '~/types'

const props = defineProps<{
  images: ApartmentImage[]
}>()

const { getImageUrl } = useApartmentService()

const sortedImages = computed(() => {
  const list = [...props.images].sort((a, b) => a.sort_order - b.sort_order)
  // Put primary first if it isn't already order 0
  const primaryIdx = list.findIndex((i) => i.is_primary)
  if (primaryIdx > 0) {
    const [primary] = list.splice(primaryIdx, 1)
    list.unshift(primary)
  }
  return list
})

const currentIndex = ref(0)

const currentUrl = computed(() =>
  sortedImages.value.length ? getImageUrl(sortedImages.value[currentIndex.value]) : '',
)

function next() {
  currentIndex.value = (currentIndex.value + 1) % sortedImages.value.length
}

function prev() {
  currentIndex.value =
    (currentIndex.value - 1 + sortedImages.value.length) % sortedImages.value.length
}
</script>
