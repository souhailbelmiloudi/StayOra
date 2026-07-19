<template>
  <div class="relative" ref="root">
    <button
      type="button"
      class="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      :aria-label="t('lang.label')"
      @click="open = !open"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
      </svg>
      <span class="uppercase">{{ locale }}</span>
      <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute end-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
    >
      <NuxtLink
        v-for="loc in availableLocales"
        :key="loc.code"
        :to="switchLocalePath(loc.code)"
        class="flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
        :class="loc.code === locale ? 'font-semibold text-blue-600' : 'text-gray-700'"
        @click="open = false"
      >
        {{ t(`lang.${loc.code}`) }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const availableLocales = computed(() =>
  locales.value.map((l) => (typeof l === 'string' ? { code: l } : l)),
)

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
