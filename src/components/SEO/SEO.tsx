import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'Rodrigo Normando Art'
const SITE_URL = 'https://rodnorm.github.io/art-portfolio'
const DEFAULT_IMAGE = '/og-image.png'

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
}: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Rodrigo Normando" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      {url && <meta property="og:url" content={url} />}
      <meta
        property="og:image"
        content={image ? `${SITE_URL}${image}` : `${SITE_URL}${DEFAULT_IMAGE}`}
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={image ? `${SITE_URL}${image}` : `${SITE_URL}${DEFAULT_IMAGE}`}
      />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  )
}