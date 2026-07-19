export interface DashboardStats {
  totalApartments: number
  publishedApartments: number
  totalReservations: number
  latestReservation: string | null
  latestApartment: string | null
}

export interface NavItem {
  label: string
  icon: string
  to: string
}

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}
