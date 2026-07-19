<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
    <div class="container-narrow mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
          {{ brandInitial }}
        </div>
        <span class="text-xl font-bold tracking-tight">{{ business.name }}</span>
      </NuxtLink>

      <div class="hidden items-center gap-6 md:flex">
        <nav class="flex items-center gap-8">
          <NuxtLink
            :to="localePath('/')"
            class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            active-class="text-blue-600"
          >
            {{ t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/apartments')"
            class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            active-class="text-blue-600"
          >
            {{ t('nav.apartments') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/contact')"
            class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            active-class="text-blue-600"
          >
            {{ t('nav.contact') }}
          </NuxtLink>
        </nav>
        <LanguageSwitcher />
      </div>

      <div class="flex items-center gap-1 md:hidden">
        <LanguageSwitcher />
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100"
          :aria-label="t('nav.openMenu')"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
        <nav class="flex flex-col gap-3">
          <NuxtLink :to="localePath('/')" class="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">
            {{ t('nav.home') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/apartments')" class="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">
            {{ t('nav.apartments') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/contact')" class="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="mobileOpen = false">
            {{ t('nav.contact') }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { business } = useBusinessSettings()
const mobileOpen = ref(false)
const brandInitial = computed(() => business.value.name?.charAt(0)?.toUpperCase() || 'S')
</script>
