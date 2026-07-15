import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import './Home.css'

export default function Home() {
  const { t } = useTranslation()

  return (
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
  )
}