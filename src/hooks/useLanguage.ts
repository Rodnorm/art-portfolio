import { useTranslation } from 'react-i18next'

export type SupportedLanguage = 'pt' | 'en' | 'de'

export interface UseLanguageReturn {
  language: SupportedLanguage
  changeLanguage: (lang: SupportedLanguage) => void
  t: (key: string, options?: Record<string, unknown>) => string
  languages: { code: SupportedLanguage; name: string }[]
}

const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
]

export function useLanguage(): UseLanguageReturn {
  const { i18n, t } = useTranslation()

  const language = i18n.language as SupportedLanguage

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return {
    language,
    changeLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
  }
}