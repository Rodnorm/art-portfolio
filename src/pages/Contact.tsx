import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InstagramIcon from '../assets/icons/instagram.svg?url'
import TikTokIcon from '../assets/icons/tiktok.svg?url'
import styles from './Contact.module.css'

const INSTAGRAM_URL = 'https://www.instagram.com/atelier.normando/'
const TIKTOK_URL = 'https://www.tiktok.com/@atelier.normando'
const FORMSPREE_PRIVACY_URL = 'https://formspree.io/legal/privacy-policy/'
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim()

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

const initialFormData = {
  name: '',
  email: '',
  message: '',
  website: '',
}

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState(initialFormData)
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>('idle')
  const isConfigured = Boolean(FORMSPREE_FORM_ID)
  const isSubmitting = submissionStatus === 'submitting'

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))

    if (submissionStatus !== 'idle') {
      setSubmissionStatus('idle')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!FORMSPREE_FORM_ID) {
      setSubmissionStatus('error')
      return
    }

    setSubmissionStatus('submitting')

    try {
      const response = await fetch(
        `https://formspree.io/f/${FORMSPREE_FORM_ID}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _gotcha: formData.website,
            language: i18n.resolvedLanguage ?? i18n.language,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      setFormData(initialFormData)
      setSubmissionStatus('success')
    } catch {
      setSubmissionStatus('error')
    }
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

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            aria-describedby="contact-privacy contact-status"
          >
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
              <label htmlFor="email">{t('contact.email')}:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
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

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <p className={styles.privacyNotice} id="contact-privacy">
              {t('contact.privacy_notice')}{' '}
              <a
                href={FORMSPREE_PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('contact.privacy_link')}
              </a>
            </p>

            {!isConfigured && (
              <p className={styles.configurationNotice} role="status">
                {t('contact.not_configured')}
              </p>
            )}

            <p
              className={styles.submissionStatus}
              id="contact-status"
              role={submissionStatus === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {submissionStatus === 'success' && t('contact.success')}
              {submissionStatus === 'error' && t('contact.error')}
            </p>

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting || !isConfigured}
            >
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        </div>
    </section>
  )
}
