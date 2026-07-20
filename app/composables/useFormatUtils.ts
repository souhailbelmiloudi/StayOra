export function useFormatUtils() {
  const { formatPrice } = useCurrency()

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return { formatDate, formatPrice }
}
