import { useTranslation } from 'react-i18next'
import { Box, Container, Typography } from '@mui/material'
import Gallery from '../components/Gallery/Gallery'
import artworksData from '../data/artworks.json'
import type { Artwork } from '../types'
import './Work.css'

export default function Work() {
  const { t } = useTranslation()
  const artworks = artworksData as Artwork[]

  return (
    <Container component="section" id="trabalhos">
      <Box>
        <Typography className="title" component="h1">
          {t('work.label')}
        </Typography>
        <Gallery artworks={artworks} />
      </Box>
    </Container>
  )
}