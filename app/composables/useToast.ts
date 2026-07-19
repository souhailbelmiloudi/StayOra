import type { Toast } from '~/types/admin'

let toastId = 0

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function add(type: Toast['type'], message: string, duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, type, message })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    add('success', message)
  }

  function error(message: string) {
    add('error', message, 6000)
  }

  function info(message: string) {
    add('info', message)
  }

  return { toasts, success, error, info, remove }
}
