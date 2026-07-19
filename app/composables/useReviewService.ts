import type { Review } from '~/types'

export function useReviewService() {
  const supabase = useSupabaseClient()

  async function getPublishedReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as Review[]
  }

  return { getPublishedReviews }
}
