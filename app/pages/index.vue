<template>
  <div>
    <section class="relative flex min-h-[85vh] items-center overflow-hidden bg-gray-900">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1920&q=80"
          :alt="t('home.heroAlt')"
          class="h-full w-full object-cover opacity-40"
        />
      </div>
      <div class="relative z-10 container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <span class="mb-4 inline-block rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
            {{ t('home.badge') }}
          </span>
          <h1 class="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {{ t('home.heroTitle') }}
            <span class="text-blue-400">{{ t('home.heroHighlight') }}</span>
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
            {{ t('home.heroSubtitle') }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/apartments')" class="btn-primary px-8 py-4 text-base">
              {{ t('home.viewApartments') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/contact')"
              class="btn-secondary border-white/20 bg-white/10 px-8 py-4 text-base text-white backdrop-blur-sm hover:bg-white/20"
            >
              {{ t('home.contactUs') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-narrow mx-auto">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ t('home.featuredTitle') }}
          </h2>
          <p class="mt-3 text-gray-500">{{ t('home.featuredSubtitle') }}</p>
        </div>

        <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card animate-pulse">
            <div class="aspect-[4/3] bg-gray-100" />
            <div class="space-y-3 p-5">
              <div class="h-5 w-3/4 rounded bg-gray-100" />
              <div class="h-4 w-1/2 rounded bg-gray-100" />
              <div class="h-4 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        </div>

        <div v-else-if="featured?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ApartmentCard
            v-for="apt in featured"
            :key="apt.id"
            :apartment="apt"
          />
        </div>

        <div v-else class="py-12 text-center text-gray-400">
          <p>{{ t('home.noApartments') }}</p>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink :to="localePath('/apartments')" class="btn-secondary">
            {{ t('home.viewAll') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-padding bg-gray-50">
      <div class="container-narrow mx-auto">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ t('home.servicesTitle') }}
          </h2>
          <p class="mt-3 text-gray-500">{{ t('home.servicesSubtitle') }}</p>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            v-for="(s, i) in services"
            :key="i"
            :service="s"
          />
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-narrow mx-auto">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ t('home.reviewsTitle') }}
          </h2>
          <p class="mt-3 text-gray-500">{{ t('home.reviewsSubtitle') }}</p>
        </div>

        <div v-if="reviewsPending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-40 animate-pulse rounded-2xl bg-gray-50" />
        </div>

        <div v-else-if="reviews?.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="r in reviews"
            :key="r.id"
            :review="r"
          />
        </div>

        <div v-else class="py-8 text-center text-gray-400">
          <p>{{ t('home.noReviews') }}</p>
        </div>

        <div v-if="business.airbnb_url" class="mt-10 text-center">
          <a
            :href="business.airbnb_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary inline-flex items-center"
          >
            <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {{ t('home.viewAirbnb') }}
          </a>
        </div>
      </div>
    </section>

    <section class="section-padding bg-gray-50">
      <div class="container-narrow mx-auto">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ t('home.mapTitle') }}
          </h2>
          <p class="mt-3 text-gray-500">{{ t('home.mapSubtitle') }}</p>
        </div>
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-4.5,36.5,3.5,43.5&layer=mapnik"
            class="h-80 w-full border-0"
            loading="lazy"
            :title="t('home.mapIframeTitle')"
          />
        </div>
      </div>
    </section>

    <section class="section-padding bg-blue-600">
      <div class="container-narrow mx-auto text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {{ t('home.ctaTitle') }}
        </h2>
        <p class="mt-3 text-blue-100">{{ t('home.ctaSubtitle') }}</p>
        <NuxtLink
          :to="localePath('/apartments')"
          class="mt-8 inline-flex items-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
        >
          {{ t('home.viewApartments') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ApartmentWithImages, Service, Review } from '~/types'

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('home.metaTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('home.metaDescription')),
    },
  ],
})

const { getFeaturedApartments } = useApartmentService()
const { getPublishedReviews } = useReviewService()
const { business } = useBusinessSettings()

const { data: featured, pending } = useAsyncData('featured-apartments', () =>
  getFeaturedApartments().catch(() => [] as ApartmentWithImages[]),
)

const { data: reviews, pending: reviewsPending } = useAsyncData('published-reviews', () =>
  getPublishedReviews().catch(() => [] as Review[]),
)

const services = computed<Service[]>(() => [
  {
    icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    title: t('services.wifiTitle'),
    description: t('services.wifiDesc'),
  },
  {
    icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z',
    title: t('services.climateTitle'),
    description: t('services.climateDesc'),
  },
  {
    icon: 'M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25',
    title: t('services.equippedTitle'),
    description: t('services.equippedDesc'),
  },
  {
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: t('services.securityTitle'),
    description: t('services.securityDesc'),
  },
])
</script>
