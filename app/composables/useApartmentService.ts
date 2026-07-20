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

  /** Same city first, then fill with other published apartments. Excludes current id. */
  async function getSimilarApartments(
    apartment: Pick<Apartment, 'id' | 'city'>,
    limit = 3,
  ): Promise<ApartmentWithImages[]> {
    const { data: sameCity } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .eq('status', 'published')
      .eq('city', apartment.city)
      .neq('id', apartment.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    const results = (sameCity || []) as ApartmentWithImages[]
    if (results.length >= limit) return results

    const exclude = new Set([apartment.id, ...results.map((a) => a.id)])
    const { data: others } = await supabase
      .from('apartments')
      .select('*, apartment_images(*)')
      .eq('status', 'published')
      .neq('id', apartment.id)
      .order('created_at', { ascending: false })
      .limit(limit + results.length)

    for (const apt of (others || []) as ApartmentWithImages[]) {
      if (exclude.has(apt.id)) continue
      results.push(apt)
      if (results.length >= limit) break
    }

    return results
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
    getSimilarApartments,
    getCities,
    getImageUrl,
  }
}
