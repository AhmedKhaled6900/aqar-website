import { getRequestConfig } from 'next-intl/server'
import messages from './ar.json'

export default getRequestConfig(async () => ({
  locale: 'ar',
  messages,
}))
