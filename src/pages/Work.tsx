import { useTranslation } from 'react-i18next'
import { Box, Container, Typography } from '@mui/material'
import Gallery from '../components/Gallery/Gallery'
import SEO from '../components/SEO/SEO'
import artworksData from '../data/artworks.json'
import type { Artwork } from '../types'
import './Work.css'

export default function Work() {
  const { t } = useTranslation()
  const artworks = artworksData as Artwork[]

  return (
    <>
      <SEO
        title={t('work.label')}
        description="Galeria de arte tradicional - desenhos a lápis, carvão, e pinturas a óleo e aquarela."
      />
      <Container component="section" id="trabalhos">
        <Box>
          <Typography className="title" component="h1">
            {t('work.label')}
          </Typography>
          <Gallery artworks={artworks} />
        </Box>
      </Container>
    </>
  )
}