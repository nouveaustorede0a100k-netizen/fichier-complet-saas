import { useState, useCallback } from 'react'

// ===========================================
// HOOK POUR LA GESTION DES ÉTATS DE CHARGEMENT
// ===========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface UseLoadingReturn {
  loading: boolean
  state: LoadingState
  error: string | null
  setLoading: (loading: boolean) => void
  setState: (state: LoadingState) => void
  setError: (error: string | null) => void
  reset: () => void
  execute: <T>(asyncFn: () => Promise<T>) => Promise<T | null>
}

export function useLoading(initialState: LoadingState = 'idle'): UseLoadingReturn {
  const [state, setState] = useState<LoadingState>(initialState)
  const [error, setError] = useState<string | null>(null)

  const loading = state === 'loading'

  const setLoading = useCallback((loading: boolean) => {
    setState(loading ? 'loading' : 'idle')
    if (loading) {
      setError(null)
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setError(null)
  }, [])

  const execute = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setState('loading')
      setError(null)
      
      const result = await asyncFn()
      
      setState('success')
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setState('error')
      return null
    }
  }, [])

  return {
    loading,
    state,
    error,
    setLoading,
    setState,
    setError,
    reset,
    execute,
  }
}
