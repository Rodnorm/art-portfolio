import { Box } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Prices from './pages/Prices'
import Contact from './pages/Contact'
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

function App() {
  const { t } = useTranslation()

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <a href="#main-content" className="skip-link">
          {t('nav.skip_to_content')}
        </a>

        <Box className="App">
          <Navbar />
          <Box component="main" id="main-content" className="content">
            <Home />
            <Work />
            <About />
            <Prices />
            <Contact />
          </Box>
          <Footer />
        </Box>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
