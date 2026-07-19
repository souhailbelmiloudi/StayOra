import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.path || !body.file) {
    throw createError({ statusCode: 400, message: 'Faltan datos' })
  }

  const config = useRuntimeConfig()
  const url = config.supabase?.url || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = config.supabase?.key || process.env.NUXT_PUBLIC_SUPABASE_KEY

  if (!url || !key) {
    throw createError({ statusCode: 500, message: 'Supabase no configurado' })
  }

  const supabase = createClient(url, key)

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user } } = await supabase.auth.getUser(token)

  if (!user) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const buffer = Buffer.from(body.file, 'base64')
  const ext = body.path.split('.').pop()
  const path = `apartments/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('apartment-images')
    .upload(path, buffer, { contentType: body.contentType || 'image/jpeg' })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { path }
})
