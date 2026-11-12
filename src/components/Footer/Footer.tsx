import { useTranslation } from 'react-i18next'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer} id="footer">
      <p>
        © {new Date().getFullYear()} {t('footer.footer_rights')}
      </p>
      <nav className={styles.legalLinks} aria-label="Rechtliche Hinweise">
        <a href="/impressum/" className={styles.legalLink}>
          Impressum
        </a>
        <span>·</span>
        <a href="/datenschutz/" className={styles.legalLink}>
          Datenschutz
        </a>
      </nav>
    </footer>
  )
}

