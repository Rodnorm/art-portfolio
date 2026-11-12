import { Box, Typography } from '@mui/material'
import SEO from '../components/SEO/SEO'
import styles from './Legal.module.css'

export default function Impressum() {
  return (
    <>
      <SEO
        title="Impressum"
        description="Impressum und rechtliche Angaben gemäß § 5 DDG für die Website von Rodrigo Normando Art."
        url="/impressum/"
      />
      <Box component="article" className={styles.section}>
        <a href="/de/" className={styles.backLink}>
          ← Zurück zur Startseite
        </a>

        <Typography component="h1" className={styles.title}>
          Impressum
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          <strong>Rodrigo Normando</strong>
          <br />
          Freischaffender Künstler (Bildende Kunst, Porträtmalerei &amp; Zeichnung)
          <br />
          Standort: Essen, Deutschland
        </Typography>

        <div className={styles.noticeBox}>
          <strong>Hinweis zur Anschrift:</strong> Die ladungsfähige Geschäftsanschrift wird vor der finalen Domainaufschaltung im Rahmen der rechtlichen Abstimmung ergänzt. Kontaktaufnahmen sind derzeit über das Kontaktformular sowie per E-Mail möglich.
        </div>

        <Typography component="h2" className={styles.subtitle}>
          Kontakt
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          E-Mail: <a href="mailto:r.normando@hotmail.com" className={styles.link}>r.normando@hotmail.com</a>
          <br />
          Web-Formular: <a href="/de/#contato" className={styles.link}>Zum Kontaktformular</a>
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Rodrigo Normando
          <br />
          Essen, Deutschland
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          Urheberrechtlicher Hinweis
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke (insbesondere Gemälde, Zeichnungen, Grafiken und Texte) auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der vorherigen schriftlichen Zustimmung des jeweiligen Urhebers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          EU-Streitschlichtung
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            https://ec.europa.eu/consumers/odr
          </a>
          .
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </Typography>
      </Box>
    </>
  )
}
