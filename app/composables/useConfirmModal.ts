// Shared across all useConfirmModal() callers — otherwise the page that
// calls open() and the modal that calls confirm() hold different closures,
// so confirm never resolves the pending promise and delete never runs.
let resolvePromise: ((value: boolean) => void) | null = null

export function useConfirmModal() {
  const isOpen = useState('confirm-modal-open', () => false)
  const title = useState('confirm-modal-title', () => '')
  const message = useState('confirm-modal-message', () => '')
  const confirmText = useState('confirm-modal-confirm-text', () => 'Eliminar')

  function open(
    titleText: string,
    messageText: string,
    confirmLabel?: string,
  ): Promise<boolean> {
    title.value = titleText
    message.value = messageText
    // Default label resolved at call sites via t(); keep Spanish fallback for safety
    confirmText.value = confirmLabel || 'Eliminar'
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function confirm() {
    isOpen.value = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  function cancel() {
    isOpen.value = false
    resolvePromise?.(false)
    resolvePromise = null
  }

  return { isOpen, title, message, confirmText, open, confirm, cancel }
}
