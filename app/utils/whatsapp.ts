export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const clean = phoneNumber.replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function formatWhatsAppDate(iso: string, locale = 'es'): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
