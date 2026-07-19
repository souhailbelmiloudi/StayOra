import type { Apartment, ApartmentWithImages, ReservationRequest, BusinessSettings, DashboardStats, Review, ReviewInput } from '~/types'

const BUCKET = 'apartment-images'

export function useAdminService() {
  const supabase = useSupabaseClient()

  function getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function getDashboardStats(): Promise<DashboardStats> {
    const [apts, res] = await Promise.all([
      supabase.from('apartments').select('id, name, status, created_at'),
      supabase.from('reservation_requests').select('id, guest_name, created_at').order('created_at', { ascending: false }),
    ])

    const apartments = apts.data || []
    const reservations = res.data || []

    return {
      totalApartments: apartments.length,
      publishedApartments: apartments.filter((a) => a.status === 'published').length,
      totalReservations: reservations.length,
      latestReservation: reservations.length ? reservations[0].guest_name : null,
      latestApartment: apartments.length ? apartments[0].name : null,
    }
  }

  async function getAllApartments(): Promise<ApartmentWithImages[]> {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as ApartmentWithImages[]
  }

  async function getApartmentById(id: string): Promise<ApartmentWithImages | null> {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as ApartmentWithImages
  }

  async function createApartment(
    apartment: Omit<Apartment, 'id' | 'created_at'>,
  ): Promise<Apartment | null> {
    const { data, error } = await supabase
      .from('apartments')
      .insert(apartment)
      .select()
      .single()

    if (error) throw error
    return data as Apartment
  }

  async function updateApartment(
    id: string,
    updates: Partial<Omit<Apartment, 'id' | 'created_at'>>,
  ): Promise<boolean> {
    const { error } = await supabase
      .from('apartments')
      .update(updates)
      .eq('id', id)

    return !error
  }

  async function deleteApartment(id: string): Promise<boolean> {
    const { data: images } = await supabase
      .from('apartment_images')
      .select('url')
      .eq('apartment_id', id)

    if (images?.length) {
      await supabase.storage.from(BUCKET).remove(images.map((i) => i.url))
    }

    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  async function duplicateApartment(id: string): Promise<Apartment | null> {
    const original = await getApartmentById(id)
    if (!original) return null

    const { apartment_images, id: _id, created_at, ...rest } = original
    rest.name = `${rest.name} (copia)`
    rest.slug = `${rest.slug}-copia-${Date.now()}`

    const newApt = await createApartment(rest)
    if (!newApt) return null

    for (const img of apartment_images) {
      const { id: _imgId, apartment_id, ...imgRest } = img
      await supabase.from('apartment_images').insert({
        ...imgRest,
        apartment_id: newApt.id,
      })
    }

    return newApt
  }

  async function addImage(
    apartmentId: string,
    url: string,
    alt: string,
    isPrimary = false,
  ): Promise<boolean> {
    const { count } = await supabase
      .from('apartment_images')
      .select('id', { count: 'exact', head: true })
      .eq('apartment_id', apartmentId)

    const { error } = await supabase.from('apartment_images').insert({
      apartment_id: apartmentId,
      url,
      alt,
      is_primary: isPrimary,
      sort_order: count || 0,
    })

    return !error
  }

  async function deleteImage(id: string): Promise<boolean> {
    const { data } = await supabase
      .from('apartment_images')
      .select('url')
      .eq('id', id)
      .single()

    if (data?.url) {
      await supabase.storage.from(BUCKET).remove([data.url])
    }

    const { error } = await supabase
      .from('apartment_images')
      .delete()
      .eq('id', id)

    return !error
  }

  async function updateImageOrder(images: { id: string; sort_order: number; is_primary: boolean }[]): Promise<boolean> {
    const updates = images.map((img) =>
      supabase
        .from('apartment_images')
        .update({ sort_order: img.sort_order, is_primary: img.is_primary })
        .eq('id', img.id),
    )

    const results = await Promise.all(updates)
    return results.every((r) => !r.error)
  }

  async function getAllReservations(): Promise<ReservationRequest[]> {
    const { data, error } = await supabase
      .from('reservation_requests')
      .select('*, apartments(name)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as ReservationRequest[]
  }

  async function deleteReservation(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reservation_requests')
      .delete()
      .eq('id', id)

    return !error
  }

  async function getSettings(): Promise<BusinessSettings> {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'business')
      .single()

    return (data?.value as BusinessSettings) || {
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

  async function updateSettings(settings: BusinessSettings): Promise<boolean> {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'business', value: settings })

    return !error
  }

  async function getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as Review[]
  }

  async function createReview(input: ReviewInput): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data as Review
  }

  async function updateReview(id: string, updates: Partial<ReviewInput>): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    return true
  }

  async function deleteReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `apartments/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type })

    if (error) return null
    return path
  }

  async function generateSlug(name: string): Promise<string> {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data } = await supabase
      .from('apartments')
      .select('slug')
      .like('slug', `${base}%`)

    if (!data?.length) return base

    return `${base}-${data.length}`
  }

  return {
    getPublicUrl,
    getDashboardStats,
    getAllApartments,
    getApartmentById,
    createApartment,
    updateApartment,
    deleteApartment,
    duplicateApartment,
    addImage,
    deleteImage,
    updateImageOrder,
    getAllReservations,
    deleteReservation,
    getSettings,
    updateSettings,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    uploadImage,
    generateSlug,
  }
}
