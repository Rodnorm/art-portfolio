import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import SEO from '../components/SEO/SEO'
import heroOriginal from '../assets/img/Gagarin Focus.JPEG?url'
import hero640 from '../assets/generated/hero-640.webp?url'
import hero966 from '../assets/generated/hero-966.webp?url'
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
        <picture className="hero-media" aria-hidden="true">
          <source
            type="image/webp"
            srcSet={`${hero640} 640w, ${hero966} 966w`}
            sizes="100vw"
          />
          <img
            src={heroOriginal}
            width={966}
            height={515}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </picture>
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
