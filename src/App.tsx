import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Prices from './pages/Prices'
import Contact from './pages/Contact'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import Footer from './components/Footer/Footer'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

interface AppProps {
  initialUrl?: string
  initialLang?: string
}

function App({ initialUrl, initialLang }: AppProps) {
  const { t, i18n } = useTranslation()
  const [currentUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname
    }
    return initialUrl || '/de/'
  })

  // Synchronize language with URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/pt') && i18n.language !== 'pt') {
        i18n.changeLanguage('pt')
      } else if (path.startsWith('/en') && i18n.language !== 'en') {
        i18n.changeLanguage('en')
      } else if (path.startsWith('/de') && i18n.language !== 'de') {
        i18n.changeLanguage('de')
      }
    } else if (initialLang && i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang)
    }
  }, [i18n, initialLang])

  useEffect(() => {
    const languageTags: Record<string, string> = {
      pt: 'pt-BR',
      en: 'en',
      de: 'de',
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang =
        languageTags[i18n.resolvedLanguage ?? 'de'] || 'de'
    }
  }, [i18n.resolvedLanguage])

  const isImpressum = currentUrl.startsWith('/impressum')
  const isDatenschutz = currentUrl.startsWith('/datenschutz')

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <a href="#main-content" className="skip-link">
          {t('nav.skip_to_content')}
        </a>

        <Box className="App">
          <Navbar />
          <Box
            component="main"
            id="main-content"
            className="content"
            tabIndex={-1}
          >
            {isImpressum ? (
              <Impressum />
            ) : isDatenschutz ? (
              <Datenschutz />
            ) : (
              <>
                <Home />
                <Work />
                <About />
                <Prices />
                <Contact />
              </>
            )}
          </Box>
          <Footer />
        </Box>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
