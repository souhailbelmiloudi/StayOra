import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const url = config.supabase?.url || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = config.supabase?.key || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!url || !key) {
    return {
      name: 'StayOra',
      description: '',
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
  }

  const supabase = createClient(url, key)

  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'business')
    .single()

  return data?.value || {
    name: 'StayOra',
    description: '',
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
})
