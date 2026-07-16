import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Container, Typography } from '@mui/material'
import InstagramIcon from '../assets/icons/instagram.svg?url'
import TikTokIcon from '../assets/icons/tiktok.svg?url'
import SEO from '../components/SEO/SEO'
import './Contact.css'

const PHONE_NUMBER = '491795204649'
const INSTAGRAM_URL = 'https://www.instagram.com/atelier.normando/'
const TIKTOK_URL = 'https://www.tiktok.com/@atelier.normando'

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = t('contact.wpp.message', {
      name: formData.name,
      message: formData.message,
    })

    const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`

    window.open(whatsappURL, '_blank')
  }

  return (
    <>
      <SEO
        title={t('nav.contact')}
        description="Entre em contato com Rodrigo Normando para solicitar orçamentos e pedidos personalizados de arte."
      />
      <Container component="section" className="contact-section" id="contato">
        <Typography className="contact-title" component="h2" variant="h4">
          {t('contact.get_in_touch')}
        </Typography>

        <form className="contact-form" onSubmit={handleSubmit}>
          <Box className="form-group">
            <label htmlFor="name">{t('contact.name')}:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>

          <Box className="form-group">
            <label htmlFor="message">{t('contact.message')}:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Box>

          <button type="submit">{t('contact.send_wpp')}</button>
        </form>

        <Box className="social-links">
          <Typography>{t('contact.follow_me')}:</Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <img src={InstagramIcon} alt="Instagram" width={30} height={30} />
            </a>

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="TikTok"
            >
              <img src={TikTokIcon} alt="TikTok" width={30} height={30} />
            </a>
          </Box>
        </Box>
      </Container>
    </>
  )
}