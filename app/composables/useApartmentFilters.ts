import type { ApartmentFilters } from '~/types'

const sharedFilters = reactive<ApartmentFilters>({
  city: '',
  priceMin: null,
  priceMax: null,
  guests: null,
})

const sharedCities = ref<string[]>([])

export function useApartmentFilters() {
  const route = useRoute()
  const router = useRouter()

  // Initialize from query params once
  if (route.query.city && !sharedFilters.city) {
    sharedFilters.city = route.query.city as string
  }
  if (route.query.priceMin && !sharedFilters.priceMin) {
    sharedFilters.priceMin = Number(route.query.priceMin)
  }
  if (route.query.priceMax && !sharedFilters.priceMax) {
    sharedFilters.priceMax = Number(route.query.priceMax)
  }
  if (route.query.guests && !sharedFilters.guests) {
    sharedFilters.guests = Number(route.query.guests)
  }

  function setCities(list: string[]) {
    sharedCities.value = list
  }

  function applyFilters() {
    const query: Record<string, string> = {}
    if (sharedFilters.city) query.city = sharedFilters.city
    if (sharedFilters.priceMin) query.priceMin = String(sharedFilters.priceMin)
    if (sharedFilters.priceMax) query.priceMax = String(sharedFilters.priceMax)
    if (sharedFilters.guests) query.guests = String(sharedFilters.guests)

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
    // Filter inputs are in the selected display currency; prices in DB are EUR
    const { convertToEur } = useCurrency()
    const minEur = sharedFilters.priceMin != null ? convertToEur(sharedFilters.priceMin) : null
    const maxEur = sharedFilters.priceMax != null ? convertToEur(sharedFilters.priceMax) : null

    return apartments.filter((a) => {
      if (sharedFilters.city && a.city !== sharedFilters.city) return false
      if (minEur != null && a.price_per_night < minEur) return false
      if (maxEur != null && a.price_per_night > maxEur) return false
      if (sharedFilters.guests && a.max_guests < sharedFilters.guests) return false
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
  }
}
