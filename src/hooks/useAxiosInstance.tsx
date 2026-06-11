'use client'

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { API_URL } from '@/lib/api/config'
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setTokens,
  storePermissions,
} from '@/lib/auth/tokens'
import type { AuthResponse } from '@/lib/types'

type AxiosContextValue = ReturnType<typeof axios.create>

const AxiosContext = createContext<AxiosContextValue | null>(null)

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_URL}/auth/refresh-token`,
      { refreshToken },
    )
    setTokens(data.accessToken, data.refreshToken)
    storePermissions(data.permissions)
    return data.accessToken
  } catch {
    clearAuthStorage()
    return null
  }
}

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh-token')
      ) {
        originalRequest._retry = true

        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        const newToken = await refreshPromise
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

export function AxiosProvider({ children }: { children: ReactNode }) {
  const instance = useMemo(() => createAxiosInstance(), [])

  return (
    <AxiosContext.Provider value={instance}>{children}</AxiosContext.Provider>
  )
}

export function useAxiosInstance() {
  const instance = useContext(AxiosContext)
  if (!instance) {
    throw new Error('useAxiosInstance must be used within AxiosProvider')
  }
  return instance
}
