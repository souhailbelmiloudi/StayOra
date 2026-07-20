import type { CurrencyCode } from '~/types'

type RatesPayload = {
  base: 'EUR'
  rates: Record<CurrencyCode, number>
  updatedAt: string | null
}

// In-memory cache (shared across requests on the same server instance)
let cached: RatesPayload | null = null
let cachedAt = 0
const CACHE_MS = 6 * 60 * 60 * 1000 // 6 hours

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  MAD: 10.7,
}

async function fetchFromOpenErApi(): Promise<RatesPayload> {
  const data = await $fetch<{
    result: string
    rates: Record<string, number>
    time_last_update_utc?: string
  }>('https://open.er-api.com/v6/latest/EUR')

  if (data.result !== 'success' || !data.rates?.USD || !data.rates?.MAD) {
    throw new Error('Invalid open.er-api response')
  }

  return {
    base: 'EUR',
    rates: {
      EUR: 1,
      USD: data.rates.USD,
      MAD: data.rates.MAD,
    },
    updatedAt: data.time_last_update_utc || null,
  }
}

async function fetchFromFawaz(): Promise<RatesPayload> {
  const data = await $fetch<{
    date?: string
    eur: Record<string, number>
  }>('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.min.json')

  if (!data.eur?.usd || !data.eur?.mad) {
    throw new Error('Invalid fawaz currency-api response')
  }

  return {
    base: 'EUR',
    rates: {
      EUR: 1,
      USD: data.eur.usd,
      MAD: data.eur.mad,
    },
    updatedAt: data.date || null,
  }
}

export default defineEventHandler(async (): Promise<RatesPayload> => {
  if (cached && Date.now() - cachedAt < CACHE_MS) {
    return cached
  }

  try {
    cached = await fetchFromOpenErApi()
    cachedAt = Date.now()
    return cached
  } catch {
    try {
      cached = await fetchFromFawaz()
      cachedAt = Date.now()
      return cached
    } catch {
      // Keep serving last good cache if available
      if (cached) return cached
      return {
        base: 'EUR',
        rates: FALLBACK_RATES,
        updatedAt: null,
      }
    }
  }
})
