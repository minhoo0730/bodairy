import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export const toasts = reactive([])

export function useToast() {
  const show = (message, type = 'info') => {
    const id = uuidv4()
    toasts.push({ id, message, type })
    setTimeout(() => {
      const idx = toasts.findIndex(t => t.id === id)
      if (idx !== -1) toasts.splice(idx, 1)
    }, 3000)
  }

  return { show }
}