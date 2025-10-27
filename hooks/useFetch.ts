import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from '@/types'

// ===========================================
// HOOK POUR LES APPELS API AVEC GESTION D'ÉTAT
// ===========================================

export interface UseFetchOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export interface UseFetchReturn<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (url?: string, options?: RequestInit) => Promise<T | null>
  reset: () => void
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = false, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (
    requestUrl: string = url,
    requestOptions: RequestInit = {}
  ): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
        ...requestOptions,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue')
      }

      setData(result.data || result)
      onSuccess?.(result.data || result)
      return result.data || result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      onError?.(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
