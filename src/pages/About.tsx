import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO/SEO'
import portraitUrl from '../assets/img/Perfil.JPEG?url'
import signatureUrl from '../assets/img/assinatura.JPEG?url'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('nav.about')}
        description="Sobre Rodrigo Normando - Artista tradicional especializado em desenhos a lápis, carvão e pinturas a óleo."
      />
      <section id="about" className={styles.section}>
        <div className={styles.layout}>
          <div className={styles.media}>
            <img
              src={portraitUrl}
              className={styles.portrait}
              width={1536}
              height={2048}
              loading="lazy"
              decoding="async"
              alt="Rodrigo Normando"
            />
            <img
              src={signatureUrl}
              className={styles.signature}
              width={1620}
              height={1303}
              loading="lazy"
              decoding="async"
              alt=""
            />
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>{t('nav.about')}</h2>
            <p className={styles.biography}>{t('about.experience')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
