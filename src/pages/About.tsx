import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO/SEO'
import portraitUrl from '../assets/img/Perfil.JPEG?url'
import signatureUrl from '../assets/img/assinatura.JPEG?url'
import portrait640 from '../assets/generated/portrait-640.webp?url'
import portrait1200 from '../assets/generated/portrait-1200.webp?url'
import signature640 from '../assets/generated/signature-640.webp?url'
import signature1200 from '../assets/generated/signature-1200.webp?url'
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
            <picture className={styles.portraitPicture}>
              <source
                type="image/webp"
                srcSet={`${portrait640} 640w, ${portrait1200} 1200w`}
                sizes="(max-width: 55.99rem) calc(100vw - 2rem), 34rem"
              />
              <img
                src={portraitUrl}
                className={styles.portrait}
                width={1536}
                height={2048}
                loading="lazy"
                decoding="async"
                alt="Rodrigo Normando"
              />
            </picture>
            <picture className={styles.signaturePicture}>
              <source
                type="image/webp"
                srcSet={`${signature640} 640w, ${signature1200} 1200w`}
                sizes="18rem"
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
            </picture>
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
