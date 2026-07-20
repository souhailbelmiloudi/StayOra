import type { CurrencyCode } from '~/types'

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'MAD', symbol: 'DH', label: 'Dirham' },
]

/** Sensible defaults so MAD/USD never behave as 1:1 with EUR before the API responds */
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.14,
  MAD: 10.7,
}

const COOKIE_KEY = 'stayora_currency'

export function useCurrency() {
  const currency = useState<CurrencyCode>('display-currency', () => 'EUR')
  const rates = useState<Record<CurrencyCode, number>>('fx-rates', () => ({ ...FALLBACK_RATES }))
  const ratesLoaded = useState('fx-rates-loaded', () => false)
  const preferenceLoaded = useState('fx-pref-loaded', () => false)
  const ratesUpdatedAt = useState<string | null>('fx-rates-updated', () => null)

  function loadPreference() {
    if (preferenceLoaded.value) return
    preferenceLoaded.value = true
    const saved = useCookie<CurrencyCode | null>(COOKIE_KEY)
    if (saved.value && CURRENCIES.some((c) => c.code === saved.value)) {
      currency.value = saved.value
    }
  }

  // Preferencia desde cookie lo antes posible (SSR + client)
  loadPreference()

  async function ensureRates() {
    loadPreference()
    if (ratesLoaded.value) return
    try {
      const data = await $fetch<{
        rates: Record<CurrencyCode, number>
        updatedAt: string | null
      }>('/api/rates')
      rates.value = data.rates
      ratesUpdatedAt.value = data.updatedAt
    } catch {
      // Keep fallback rates (never leave MAD/USD at 1:1)
      rates.value = { ...FALLBACK_RATES }
    } finally {
      ratesLoaded.value = true
    }
  }

  function setCurrency(code: CurrencyCode) {
    currency.value = code
    const cookie = useCookie<CurrencyCode>(COOKIE_KEY, { maxAge: 60 * 60 * 24 * 365 })
    cookie.value = code
  }

  function convertFromEur(amountEur: number): number {
    const rate = rates.value[currency.value] || FALLBACK_RATES[currency.value] || 1
    return amountEur * rate
  }

  /** Convert an amount typed in the selected currency back to EUR (DB base). */
  function convertToEur(amount: number): number {
    const rate = rates.value[currency.value] || FALLBACK_RATES[currency.value] || 1
    if (!rate) return amount
    return amount / rate
  }

  /** Same rounded amount the user sees on cards (0 decimal places). */
  function displayAmount(amountEur: number): number {
    return Math.round(convertFromEur(amountEur))
  }

  function formatPrice(amountEur: number): string {
    // Touch currency + rates so Vue re-renders when they change
    const code = currency.value
    const value = convertFromEur(amountEur)
    const locale = code === 'MAD' ? 'fr-MA' : code === 'USD' ? 'en-US' : 'es-ES'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const currencyMeta = computed(
    () => CURRENCIES.find((c) => c.code === currency.value) || CURRENCIES[0],
  )

  return {
    currency,
    rates,
    ratesLoaded,
    ratesUpdatedAt,
    currencyMeta,
    currencies: CURRENCIES,
    loadPreference,
    ensureRates,
    setCurrency,
    convertFromEur,
    convertToEur,
    displayAmount,
    formatPrice,
  }
}
