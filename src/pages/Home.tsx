import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import SEO from '../components/SEO/SEO'
import './Home.css'

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Rodrigo Normando"
        description="Arte Tradicional - Desenhos a lápis, carvão e pinturas a óleo e aquarela por Rodrigo Normando."
      />
      <Box component="section" id="home">
        <Box>
          <Typography className="title" component="h1">
            Rodrigo Normando
          </Typography>
          <Typography className="subtitle" component="p">
            {t('traditional_art')}
          </Typography>
        </Box>
      </Box>
    </>
  )
}