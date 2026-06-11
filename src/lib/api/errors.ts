import { isAxiosError } from 'axios'

interface ApiErrorBody {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export function getApiErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(' — ')
      }
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    if (error.response?.status === 401) {
      return 'يجب تسجيل الدخول أولاً'
    }

    if (error.response?.status === 403) {
      return 'ليس لديك صلاحية لهذا الإجراء'
    }

    if (error.response?.status === 404) {
      return 'العنصر غير موجود'
    }

    if (error.message && !error.message.includes('status code')) {
      return error.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
