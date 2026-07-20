<template>
 1 <div v-if="apartment" class="px-4 py-8 sm:px-6 lg:px-8">
    <div class="container-narrow mx-auto">
      <nav class="mb-6 text-sm text-gray-400">
        <NuxtLink :to="localePath('/')" class="transition-colors hover:text-gray-600">{{ t('nav.home') }}</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink :to="localePath('/apartments')" class="transition-colors hover:text-gray-600">{{ t('nav.apartments') }}</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-700">{{ displayName }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <ImageGallery :images="apartment.apartment_images || []" />

          <div class="mt-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ displayName }}</h1>
                <p class="mt-2 flex items-center gap-1.5 text-gray-500">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ apartment.city }}
                </p>
              </div>
              <div class="shrink-0 text-end">
                <span class="text-2xl font-bold text-gray-900">{{ formatPrice(apartment.price_per_night) }}</span>
                <span class="block text-sm text-gray-400">{{ t('detail.perNight') }}</span>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-4">
              <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                {{ t('detail.guests', { count: apartment.max_guests }) }}
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                {{ t('detail.bedroom', apartment.bedrooms) }}
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ t('detail.bathroom', apartment.bathrooms) }}
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                {{ apartment.square_meters }} m²
              </div>
            </div>

            <div class="mt-8">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('detail.description') }}</h2>
              <p class="mt-3 leading-relaxed text-gray-600 whitespace-pre-line">{{ displayDescription }}</p>
            </div>

            <div class="mt-8">
              <h2 class="text-lg font-semibold text-gray-900">{{ t('detail.amenities') }}</h2>
              <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  v-for="amenity in amenities"
                  :key="amenity"
                  class="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                >
                  <svg class="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {{ amenity }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-4">
            <DateCalendar :price-per-night="apartment.price_per_night">
              <div class="mt-4 space-y-3">
                <a
                  :href="whatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-whatsapp w-full"
                >
                  <svg class="me-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {{ t('detail.bookWhatsApp') }}
                </a>
                <NuxtLink
                  :to="localePath({ path: '/contact', query: { apartment: apartment.id } })"
                  class="btn-primary w-full"
                >
                  <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {{ t('detail.requestInfo') }}
                </NuxtLink>
              </div>
            </DateCalendar>
          </div>
        </div>
      </div>

      <section v-if="similar?.length" class="mt-16 border-t border-gray-100 pt-12">
        <div class="mb-8">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">{{ t('detail.similarTitle') }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ t('detail.similarSubtitle') }}</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ApartmentCard
            v-for="apt in similar"
            :key="apt.id"
            :apartment="apt"
          />
        </div>
      </section>
    </div>
  </div>

  <div v-else-if="!pending" class="px-4 py-20 text-center">
    <h2 class="text-xl font-semibold text-gray-900">{{ t('detail.notFound') }}</h2>
    <NuxtLink :to="localePath('/apartments')" class="btn-primary mt-4 inline-flex">
      {{ t('detail.backToList') }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { getApartmentBySlug, getSimilarApartments } = useApartmentService()
const { checkIn, checkOut } = useDateRange()
const { business, whatsappNumber } = useBusinessSettings()
const { formatPrice } = useCurrency()

const { data: apartment, pending } = useAsyncData(
  `apartment-${route.params.id}`,
  () => getApartmentBySlug(route.params.id as string),
)

const { data: similar } = useAsyncData(
  `similar-${route.params.id}`,
  async () => {
    if (!apartment.value) return []
    return getSimilarApartments(apartment.value, 3)
  },
  { watch: [apartment] },
)

const displayName = computed(() =>
  apartment.value ? apartmentName(apartment.value, locale.value) : '',
)
const displayDescription = computed(() =>
  apartment.value ? apartmentDescription(apartment.value, locale.value) : '',
)

useHead({
  title: computed(() =>
    apartment.value
      ? `${displayName.value} — ${business.value.name}`
      : t('detail.metaFallback'),
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => displayDescription.value?.slice(0, 160) || ''),
    },
  ],
})

const amenities = computed(() => [
  t('amenities.wifi'),
  t('amenities.ac'),
  t('amenities.heating'),
  t('amenities.kitchen'),
  t('amenities.washer'),
  t('amenities.tv'),
  t('amenities.terrace'),
  t('amenities.parking'),
  t('amenities.pool'),
  t('amenities.cleaning'),
  t('amenities.bedding'),
  t('amenities.towels'),
])

const localeTag = computed(() => {
  const map: Record<string, string> = { es: 'es-ES', en: 'en-US', fr: 'fr-FR', ar: 'ar' }
  return map[locale.value] || 'es-ES'
})

const whatsappUrl = computed(() => {
  const lines = [t('whatsapp.intro', { name: displayName.value || '' })]

  if (checkIn.value && checkOut.value) {
    lines.push(
      t('whatsapp.dates', {
        checkIn: formatWhatsAppDate(checkIn.value, localeTag.value),
        checkOut: formatWhatsAppDate(checkOut.value, localeTag.value),
      }),
    )
  }

  lines.push(t('whatsapp.available'))
  return buildWhatsAppUrl(whatsappNumber.value, lines.join('\n'))
})
</script>
