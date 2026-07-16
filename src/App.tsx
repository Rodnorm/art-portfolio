import { Box } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
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
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Box className="App">
          <Navbar />
          <Box className="content">
            <Home />
            <Work />
            <About />
            <Prices />
            <Contact />
            <Footer />
          </Box>
        </Box>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App