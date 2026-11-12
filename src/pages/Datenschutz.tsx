import { Box, Typography } from '@mui/material'
import SEO from '../components/SEO/SEO'
import styles from './Legal.module.css'

export default function Datenschutz() {
  return (
    <>
      <SEO
        title="Datenschutzerklärung"
        description="Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten auf der Website von Rodrigo Normando Art."
        url="/datenschutz/"
      />
      <Box component="article" className={styles.section}>
        <a href="/de/" className={styles.backLink}>
          ← Zurück zur Startseite
        </a>

        <Typography component="h1" className={styles.title}>
          Datenschutzerklärung
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          1. Datenschutz auf einen Blick
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          <strong>Verantwortliche Stelle:</strong>
          <br />
          Rodrigo Normando
          <br />
          Essen, Deutschland
          <br />
          E-Mail: <a href="mailto:r.normando@hotmail.com" className={styles.link}>r.normando@hotmail.com</a>
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          2. Bereitstellung der Website und Server-Log-Dateien
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Diese Website wird auf einem virtuellen Server (VPS) über die Open-Source-Plattform Coolify und einen Nginx-Webserver gehostet. Beim Aufrufen dieser Website erfasst der Webserver automatisch technische Informationen, die Ihr Browser übermittelt (sogenannte Server-Logfiles). Hierzu gehören:
        </Typography>
        <ul className={styles.list}>
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL (die zuvor besuchte Seite)</li>
          <li>Hostname des zugreifenden Rechners / IP-Adresse</li>
          <li>Uhrzeit und Datum der Serveranfrage</li>
          <li>HTTP-Statuscode und übertragene Datenmenge</li>
        </ul>
        <Typography component="p" className={styles.paragraph}>
          Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung, Stabilität und IT-Sicherheit der Website. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Logdateien werden nach Ablauf der technisch erforderlichen Frist automatisch gelöscht.
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          3. Keine Tracking-Cookies und keine Web-Analytics
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Diese Website verwendet <strong>keine</strong> Tracking-Cookies, keine Werbe-Tracker und keine externen Analysedienste (wie beispielsweise Google Analytics oder Meta-Pixel).
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Zur Speicherung Ihrer Darstellungsauswahl (beispielsweise die Wahl des visuellen Designs &bdquo;Hell&ldquo; oder &bdquo;Dunkel&ldquo;) wird die lokale Speicherfunktion Ihres Browsers (LocalStorage) genutzt. Es werden dabei keine personenbezogenen Daten an externe Server übertragen.
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          4. Lokale Bereitstellung von Schriftarten
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Zur einheitlichen Darstellung von Schriftarten verwendet diese Seite die Schriftart &bdquo;Playfair Display&ldquo;. Diese Schriftart ist lokal auf unserem eigenen Server installiert und wird direkt von diesem ausgeliefert. Beim Laden der Schriftart findet <strong>keine</strong> Verbindung zu externen Servern von Google Fonts statt und es werden keine IP-Adressen an Dritte übermittelt.
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          5. Kontaktformular und Auftragsverarbeitung durch Formspree
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse und Nachrichtentext) zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert und verarbeitet.
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Für die technische Übermittlung der Formulardaten nutzen wir den Dienst <strong>Formspree</strong>, betrieben von Formspree Inc., PO Box 421248, San Francisco, CA 94142, USA.
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Wenn Sie das Formular absenden, werden Ihre eingegebenen Formulardaten über eine verschlüsselte HTTPS-Verbindung an die Server von Formspree übermittelt. Formspree verarbeitet diese Daten in den USA, um sie an unsere E-Mail-Adresse weiterzuleiten. Die Datenübermittlung in die USA erfolgt auf Basis der Standardvertragsklauseln der EU-Kommission bzw. entsprechender Datenschutzgarantien. Weitere Informationen finden Sie in der Datenschutzerklärung von Formspree:{' '}
          <a
            href="https://formspree.io/legal/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            https://formspree.io/legal/privacy-policy/
          </a>
          .
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen (z.&nbsp;B. Anfrage zu einer Porträtauftragsarbeit) zusammenhängt. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
        </Typography>

        <Typography component="h2" className={styles.subtitle}>
          6. Ihre Rechte als betroffene Person
        </Typography>
        <Typography component="p" className={styles.paragraph}>
          Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen der DSGVO jederzeit das Recht auf:
        </Typography>
        <ul className={styles.list}>
          <li>Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung unrichtiger oder unvollständiger Daten (Art. 16 DSGVO),</li>
          <li>Löschung Ihrer bei uns gespeicherten personenbezogenen Daten (Art. 17 DSGVO),</li>
          <li>Einschränkung der Datenverarbeitung (Art. 18 DSGVO),</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten (Art. 21 DSGVO).</li>
        </ul>
        <Typography component="p" className={styles.paragraph}>
          Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde zu (in Nordrhein-Westfalen: Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, LDI NRW).
        </Typography>
      </Box>
    </>
  )
}
