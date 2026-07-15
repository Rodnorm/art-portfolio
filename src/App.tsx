import { Box } from '@mui/material'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Prices from './pages/Prices'
import Contact from './pages/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  return (
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
  )
}

export default App