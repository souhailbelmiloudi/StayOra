import type { Apartment } from '~/types'

/** Resolve apartment title for the active UI locale. Falls back to `name`. */
export function apartmentName(apt: Pick<Apartment, 'name' | 'name_es' | 'name_fr' | 'name_ar'>, locale: string): string {
  if (locale === 'es' && apt.name_es?.trim()) return apt.name_es.trim()
  if (locale === 'fr' && apt.name_fr?.trim()) return apt.name_fr.trim()
  if (locale === 'ar' && apt.name_ar?.trim()) return apt.name_ar.trim()
  return apt.name
}

/** Resolve apartment description for the active UI locale. Falls back to `description`. */
export function apartmentDescription(
  apt: Pick<Apartment, 'description' | 'description_es' | 'description_fr' | 'description_ar'>,
  locale: string,
): string {
  if (locale === 'es' && apt.description_es?.trim()) return apt.description_es.trim()
  if (locale === 'fr' && apt.description_fr?.trim()) return apt.description_fr.trim()
  if (locale === 'ar' && apt.description_ar?.trim()) return apt.description_ar.trim()
  return apt.description || ''
}
