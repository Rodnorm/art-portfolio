import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import './About.css'

export default function About() {
  const { t } = useTranslation()

  return (
    <Box
      component="section"
      id="about"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        backgroundImage: 'url(./assinatura.JPEG)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        component="img"
        src="./Perfil.JPEG"
        alt="Rodrigo Normando"
        sx={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          marginBottom: 2,
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      <Typography
        variant="h2"
        component="h2"
        sx={{ zIndex: 1, fontFamily: "'Playfair Display', serif" }}
      >
        {t('nav.about')}
      </Typography>

      <Typography
        sx={{
          zIndex: 1,
          maxWidth: '80%',
          fontFamily: "'Playfair Display', sans-serif",
          fontSize: '20px',
          lineHeight: 1.5,
          marginTop: '2rem',
        }}
      >
        {t('about.experience')}
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />
    </Box>
  )
}