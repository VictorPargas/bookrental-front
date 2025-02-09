import { exibirErrorCatch } from '../../utils/alert'
import { WorkingHours } from '@/app/types/redux'

const STATE_REDUX = '[WORLD-STUDIO]'

export const getStatePersisted = (): WorkingHours | null => {
  if (typeof window !== 'undefined') {
    const serializedState = localStorage.getItem(STATE_REDUX)

    if (!serializedState) {
      return null
    }

    return JSON.parse(serializedState) || null
  }

  return null
}

export const saveState = <T>(stateCurrent: T): void => {
  try {
    if (typeof window !== 'undefined') {
      const state = getStatePersisted()

      const serializedState = JSON.stringify({ ...state, ...stateCurrent })

      localStorage.setItem(STATE_REDUX, serializedState)
    }
  } catch (err) {
    exibirErrorCatch(err)
  }
}

export const deleteState = (): void => {
  localStorage.removeItem(STATE_REDUX)
}
