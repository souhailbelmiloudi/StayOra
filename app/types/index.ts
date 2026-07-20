export type ApartmentStatus = 'published' | 'hidden'

export type CurrencyCode = 'EUR' | 'USD' | 'MAD'

export interface Apartment {
  id: string
  name: string
  slug: string
  description: string
  city: string
  address: string
  price_per_night: number
  max_guests: number
  bedrooms: number
  bathrooms: number
  square_meters: number
  featured: boolean
  status: ApartmentStatus
  latitude: number | null
  longitude: number | null
  services: string[]
  created_at: string
}

export interface ApartmentImage {
  id: string
  apartment_id: string
  url: string
  alt: string
  is_primary: boolean
  sort_order: number
}

export interface ApartmentWithImages extends Apartment {
  apartment_images: ApartmentImage[]
}

export interface ReservationRequest {
  id?: string
  apartment_id: string | null
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  message: string
  created_at?: string
  apartments?: { name: string } | null
}

export interface ApartmentFilters {
  city: string
  priceMin: number | null
  priceMax: number | null
  guests: number | null
}

export interface BusinessSettings {
  name: string
  description: string
  phone: string
  whatsapp: string
  email: string
  address: string
  instagram: string
  facebook: string
  tiktok: string
  google_maps_url: string
  airbnb_url: string
}

export interface Service {
  icon: string
  title: string
  description: string
}

export interface Review {
  id: string
  name: string
  avatar: string
  rating: number
  text: string
  city: string
  published: boolean
  sort_order: number
  created_at: string
}

export type ReviewInput = Omit<Review, 'id' | 'created_at'>
