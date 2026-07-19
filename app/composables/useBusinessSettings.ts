import type { BusinessSettings } from '~/types'

const DEFAULTS: BusinessSettings = {
  name: 'StayOra',
  description: 'Apartamentos turísticos en las mejores ciudades para unas vacaciones inolvidables.',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  google_maps_url: '',
  airbnb_url: '',
}

export function useBusinessSettings() {
  const config = useRuntimeConfig()

  // Shared key so header/footer/pages reuse one fetch
  const { data: settings, pending } = useAsyncData(
    'business-settings',
    () => $fetch<BusinessSettings>('/api/settings'),
    { default: () => ({ ...DEFAULTS }) },
  )

  const business = computed(() => ({
    ...DEFAULTS,
    ...settings.value,
  }))

  const whatsappNumber = computed(() => {
    const fromSettings = business.value.whatsapp?.replace(/\D/g, '')
    if (fromSettings) return fromSettings
    return (config.public.whatsappNumber as string) || ''
  })

  return { business, whatsappNumber, pending }
}
