import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title: string
  description: string
  image?: string
  imageAlt?: string
  url?: string
  type?: 'website' | 'article'
  includeHreflang?: boolean
}

const SITE_NAME = 'Rodrigo Normando Art'
const DEFAULT_IMAGE = 'Gagarin-Focus.JPEG'

function getSiteOrigin(): string {
  const envUrl = import.meta.env.VITE_SITE_URL
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/+$/, '')
  }
  return 'https://art.normando.dev'
}

export default function SEO({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  includeHreflang = true,
}: SEOProps) {
  const { i18n } = useTranslation()
  const siteOrigin = getSiteOrigin()

  const currentLang = i18n.resolvedLanguage ?? i18n.language ?? 'de'
  const isHomeRoute = !url || url === '/' || url === '/de/' || url === '/pt/' || url === '/en/'

  // Determine current page canonical path
  const pagePath = url ? (url.startsWith('/') ? url : `/${url}`) : `/${currentLang}/`
  const canonicalUrl = `${siteOrigin}${pagePath}`

  const resolvedImage = image ?? DEFAULT_IMAGE
  const imageUrl = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${siteOrigin}/${resolvedImage.replace(/^\/+/, '')}`

  const resolvedImageAlt =
    imageAlt ||
    (currentLang === 'de'
      ? 'Ölporträt und traditionelle Kunst von Rodrigo Normando'
      : currentLang === 'en'
      ? 'Oil portrait and traditional art by Rodrigo Normando'
      : 'Retrato a óleo e arte tradicional por Rodrigo Normando')

  const ogLocaleMap: Record<string, string> = {
    de: 'de_DE',
    pt: 'pt_BR',
    en: 'en_US',
  }
  const ogLocale = ogLocaleMap[currentLang] || 'de_DE'

  // Structured data (Schema.org JSON-LD)
  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rodrigo Normando',
    jobTitle:
      currentLang === 'de'
        ? 'Künstler & Porträtmaler'
        : currentLang === 'en'
        ? 'Artist & Portrait Painter'
        : 'Artista e Retratista',
    description:
      currentLang === 'de'
        ? 'Traditioneller Porträtmaler und Zeichner in Essen, Deutschland.'
        : currentLang === 'en'
        ? 'Traditional portrait painter and draftsman based in Essen, Germany.'
        : 'Artista tradicional e retratista residente em Essen, Alemanha.',
    url: `${siteOrigin}/`,
    sameAs: [
      'https://www.instagram.com/atelier.normando/',
      'https://www.tiktok.com/@atelier.normando',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Essen',
      addressCountry: 'DE',
    },
  }

  const schemaWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${siteOrigin}/`,
    inLanguage: ['de', 'pt-BR', 'en'],
    author: {
      '@type': 'Person',
      name: 'Rodrigo Normando',
    },
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Rodrigo Normando" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Multilingual alternates / hreflang */}
      {includeHreflang && isHomeRoute && (
        <>
          <link rel="alternate" hrefLang="de" href={`${siteOrigin}/de/`} />
          <link rel="alternate" hrefLang="pt-BR" href={`${siteOrigin}/pt/`} />
          <link rel="alternate" hrefLang="en" href={`${siteOrigin}/en/`} />
          <link rel="alternate" hrefLang="x-default" href={`${siteOrigin}/de/`} />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={resolvedImageAlt} />
      <meta property="og:image:width" content="966" />
      <meta property="og:image:height" content="515" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={resolvedImageAlt} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schemaPerson)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaWebsite)}</script>
    </Helmet>
  )
}
