import type { Apartment, ApartmentWithImages, ApartmentImage } from '~/types'

const BUCKET = 'apartment-images'

export function useApartmentService() {
  const supabase = useSupabaseClient()

  function getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function getFeaturedApartments(): Promise<ApartmentWithImages[]> {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as ApartmentWithImages[]
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

  async function getApartmentBySlug(slug: string): Promise<ApartmentWithImages | null> {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .eq('slug', slug)
      .single()

    if (error) return null
    return data as ApartmentWithImages
  }

  async function getCities(): Promise<string[]> {
    const { data, error } = await supabase
      .from('apartments')
      .select('city')

    if (error) return []
    const unique = [...new Set((data || []).map((r: { city: string }) => r.city))]
    return unique.sort()
  }

  function getImageUrl(image: ApartmentImage): string {
    return getPublicUrl(image.url)
  }

  return {
    getPublicUrl,
    getFeaturedApartments,
    getAllApartments,
    getApartmentById,
    getApartmentBySlug,
    getCities,
    getImageUrl,
  }
}
