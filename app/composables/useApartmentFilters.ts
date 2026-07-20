import type { ApartmentFilters } from '~/types'

const sharedFilters = reactive<ApartmentFilters>({
  city: '',
  priceMin: null,
  priceMax: null,
  guests: null,
})

const sharedCities = ref<string[]>([])

function toOptionalNumber(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return null
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

export function useApartmentFilters() {
  const route = useRoute()
  const router = useRouter()

  // Initialize from query params once
  if (route.query.city && !sharedFilters.city) {
    sharedFilters.city = route.query.city as string
  }
  if (route.query.priceMin && sharedFilters.priceMin == null) {
    sharedFilters.priceMin = toOptionalNumber(route.query.priceMin)
  }
  if (route.query.priceMax && sharedFilters.priceMax == null) {
    sharedFilters.priceMax = toOptionalNumber(route.query.priceMax)
  }
  if (route.query.guests && sharedFilters.guests == null) {
    sharedFilters.guests = toOptionalNumber(route.query.guests)
  }

  // v-model.number leaves "" / NaN when the user clears the field — normalize to null
  watch(
    () => [sharedFilters.priceMin, sharedFilters.priceMax, sharedFilters.guests],
    () => {
      sharedFilters.priceMin = toOptionalNumber(sharedFilters.priceMin)
      sharedFilters.priceMax = toOptionalNumber(sharedFilters.priceMax)
      sharedFilters.guests = toOptionalNumber(sharedFilters.guests)
    },
  )

  function setCities(list: string[]) {
    sharedCities.value = list
  }

  function applyFilters() {
    const query: Record<string, string> = {}
    if (sharedFilters.city) query.city = sharedFilters.city
    if (sharedFilters.priceMin != null) query.priceMin = String(sharedFilters.priceMin)
    if (sharedFilters.priceMax != null) query.priceMax = String(sharedFilters.priceMax)
    if (sharedFilters.guests != null) query.guests = String(sharedFilters.guests)

    router.push({ query })
  }

  function clearFilters() {
    sharedFilters.city = ''
    sharedFilters.priceMin = null
    sharedFilters.priceMax = null
    sharedFilters.guests = null
    router.push({ query: {} })
  }

  function filterApartments<T extends { city: string; price_per_night: number; max_guests: number }>(
    apartments: T[],
  ): T[] {
    // Compare in the same currency + rounding the user sees on cards
    const { displayAmount, currency } = useCurrency()
    void currency.value // track currency changes in computed callers

    const min = toOptionalNumber(sharedFilters.priceMin)
    const max = toOptionalNumber(sharedFilters.priceMax)
    const guests = toOptionalNumber(sharedFilters.guests)

    return apartments.filter((a) => {
      if (sharedFilters.city && a.city !== sharedFilters.city) return false

      const shown = displayAmount(Number(a.price_per_night))
      if (min != null && shown < min) return false
      if (max != null && shown > max) return false
      if (guests != null && a.max_guests < guests) return false
      return true
    })
  }

  return {
    filters: sharedFilters,
    cities: sharedCities,
    setCities,
    applyFilters,
    clearFilters,
    filterApartments,
    toOptionalNumber,
  }
}
