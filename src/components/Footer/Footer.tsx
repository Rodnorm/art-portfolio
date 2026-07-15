import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Box component="footer" className="footer" id="footer">
      <Typography>
        © {new Date().getFullYear()} {t('footer.footer_rights')}
      </Typography>
    </Box>
  )
}