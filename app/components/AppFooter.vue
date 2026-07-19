<template>
  <footer class="border-t border-gray-100 bg-gray-50">
    <div class="container-narrow mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-12 md:grid-cols-4">
        <div class="md:col-span-1">
          <NuxtLink :to="localePath('/')" class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              {{ brandInitial }}
            </div>
            <span class="text-xl font-bold tracking-tight">{{ business.name }}</span>
          </NuxtLink>
          <p class="mt-4 text-sm leading-relaxed text-gray-500">
            {{ business.description || t('footer.defaultDescription') }}
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900">{{ t('footer.navigation') }}</h4>
          <ul class="mt-4 space-y-3">
            <li>
              <NuxtLink :to="localePath('/')" class="text-sm text-gray-500 transition-colors hover:text-blue-600">
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/apartments')" class="text-sm text-gray-500 transition-colors hover:text-blue-600">
                {{ t('nav.apartments') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/contact')" class="text-sm text-gray-500 transition-colors hover:text-blue-600">
                {{ t('nav.contact') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900">{{ t('footer.followUs') }}</h4>
          <ul class="mt-4 space-y-3">
            <li v-if="business.instagram">
              <a
                :href="business.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 transition-colors hover:text-blue-600"
              >
                Instagram
              </a>
            </li>
            <li v-if="business.facebook">
              <a
                :href="business.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 transition-colors hover:text-blue-600"
              >
                Facebook
              </a>
            </li>
            <li v-if="business.tiktok">
              <a
                :href="business.tiktok"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 transition-colors hover:text-blue-600"
              >
                TikTok
              </a>
            </li>
            <li v-if="business.google_maps_url">
              <a
                :href="business.google_maps_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 transition-colors hover:text-blue-600"
              >
                Google Maps
              </a>
            </li>
            <li v-if="!hasSocialLinks">
              <span class="text-sm text-gray-400">{{ t('footer.comingSoon') }}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900">{{ t('footer.contact') }}</h4>
          <ul class="mt-4 space-y-3">
            <li v-if="business.email" class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${business.email}`" class="transition-colors hover:text-blue-600">
                {{ business.email }}
              </a>
            </li>
            <li v-if="displayPhone" class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${phoneHref}`" class="transition-colors hover:text-blue-600">
                {{ displayPhone }}
              </a>
            </li>
            <li v-if="business.address" class="flex items-start gap-2 text-sm text-gray-500">
              <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {{ business.address }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-gray-200 pt-8 text-center">
        <p class="text-xs text-gray-400">
          &copy; {{ currentYear }} {{ business.name }}. {{ t('footer.rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { business, whatsappNumber } = useBusinessSettings()

const currentYear = new Date().getFullYear()

const brandInitial = computed(() => business.value.name?.charAt(0)?.toUpperCase() || 'S')

const hasSocialLinks = computed(() =>
  !!(business.value.instagram || business.value.facebook || business.value.tiktok || business.value.google_maps_url),
)

const phoneRaw = computed(() => business.value.phone || whatsappNumber.value)
const displayPhone = computed(() => formatPhoneDisplay(phoneRaw.value))
const phoneHref = computed(() => phoneRaw.value.replace(/\D/g, ''))
</script>
