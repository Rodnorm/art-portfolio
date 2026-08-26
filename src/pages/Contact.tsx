import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InstagramIcon from '../assets/icons/instagram.svg?url'
import TikTokIcon from '../assets/icons/tiktok.svg?url'
import styles from './Contact.module.css'

const PHONE_NUMBER = '491795204649'
const INSTAGRAM_URL = 'https://www.instagram.com/atelier.normando/'
const TIKTOK_URL = 'https://www.tiktok.com/@atelier.normando'

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', message: '' })

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const message = t('contact.wpp.message', {
      name: formData.name,
      message: formData.message,
    })
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={styles.section} id="contato">
        <div className={styles.layout}>
          <div className={styles.headingGroup}>
            <h2 className={styles.title}>{t('contact.get_in_touch')}</h2>

            <div className={styles.socialLinks}>
              <p>{t('contact.follow_me')}:</p>
              <div className={styles.socialIcons}>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="Instagram"
                >
                  <img src={InstagramIcon} alt="" width={30} height={30} />
                </a>

                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  aria-label="TikTok"
                >
                  <img src={TikTokIcon} alt="" width={30} height={30} />
                </a>
              </div>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t('contact.name')}:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">{t('contact.message')}:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button className={styles.submitButton} type="submit">
              {t('contact.send_wpp')}
            </button>
          </form>
        </div>
    </section>
  )
}
