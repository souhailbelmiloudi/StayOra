import type { ReservationRequest } from '~/types'

export function useReservationService() {
  const supabase = useSupabaseClient()

  async function submitRequest(
    request: Omit<ReservationRequest, 'id' | 'created_at'>,
  ): Promise<boolean> {
    const { error } = await supabase
      .from('reservation_requests')
      .insert(request)

    return !error
  }

  return { submitRequest }
}
