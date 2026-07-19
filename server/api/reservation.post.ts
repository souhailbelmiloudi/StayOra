import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { apartment_id, guest_name, guest_email, check_in, check_out, guests } = body

  if (!guest_name || !guest_email || !check_in || !check_out) {
    throw createError({
      statusCode: 400,
      message: 'Campos obligatorios faltantes',
    })
  }

  const config = useRuntimeConfig()
  const url = config.supabase?.url || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = config.supabase?.key || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      message: 'Supabase no está configurado',
    })
  }

  const supabase = createClient(url, key)

  const { error } = await supabase.from('reservation_requests').insert({
    apartment_id: apartment_id || null,
    guest_name,
    guest_email,
    guest_phone: body.guest_phone || '',
    check_in,
    check_out,
    guests: guests || 1,
    message: body.message || '',
  })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al guardar la solicitud',
    })
  }

  return { success: true }
})
