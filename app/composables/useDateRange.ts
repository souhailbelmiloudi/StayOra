export function useDateRange() {
  const checkIn = ref<string>('')
  const checkOut = ref<string>('')

  const nights = computed(() => {
    if (!checkIn.value || !checkOut.value) return 0
    const diff =
      new Date(checkOut.value).getTime() - new Date(checkIn.value).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  function isDateDisabled(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    if (checkIn.value && !checkOut.value) {
      return date <= new Date(checkIn.value)
    }
    return false
  }

  function selectDate(date: Date) {
    const iso = date.toISOString().split('T')[0]
    if (!checkIn.value || (checkIn.value && checkOut.value)) {
      checkIn.value = iso
      checkOut.value = ''
    } else {
      if (iso > checkIn.value) {
        checkOut.value = iso
      } else {
        checkIn.value = iso
        checkOut.value = ''
      }
    }
  }

  function reset() {
    checkIn.value = ''
    checkOut.value = ''
  }

  return {
    checkIn,
    checkOut,
    nights,
    isDateDisabled,
    selectDate,
    reset,
  }
}
