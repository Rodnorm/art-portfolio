import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const distSsrDir = path.resolve(rootDir, 'dist-ssr')

const siteOrigin = (process.env.VITE_SITE_URL || 'https://art.normando.dev').replace(/\/+$/, '')

const routes = [
  {
    path: '/de/',
    lang: 'de',
    title: 'Ölporträts nach Foto in Essen | Rodrigo Normando',
    description:
      'Traditionelle Kunst und Auftragsmalerei in Essen. Porträts nach Foto in Öl, Graphit, Kohle und Aquarell von Rodrigo Normando.',
    ogLocale: 'de_DE',
    isHome: true,
  },
  {
    path: '/pt/',
    lang: 'pt-BR',
    title: 'Retratos a óleo por encomenda | Rodrigo Normando',
    description:
      'Arte tradicional e retratos sob encomenda em Essen. Pinturas a óleo, desenhos a lápis, carvão e aquarela por Rodrigo Normando.',
    ogLocale: 'pt_BR',
    isHome: true,
  },
  {
    path: '/en/',
    lang: 'en',
    title: 'Commissioned Oil Portraits | Rodrigo Normando',
    description:
      'Traditional art and commissioned portraits in Essen. Custom oil paintings, pencil, charcoal and watercolor by Rodrigo Normando.',
    ogLocale: 'en_US',
    isHome: true,
  },
  {
    path: '/impressum/',
    lang: 'de',
    title: 'Impressum | Rodrigo Normando Art',
    description:
      'Impressum und rechtliche Angaben gemäß § 5 DDG für die Website von Rodrigo Normando Art.',
    ogLocale: 'de_DE',
    isHome: false,
  },
  {
    path: '/datenschutz/',
    lang: 'de',
    title: 'Datenschutzerklärung | Rodrigo Normando Art',
    description:
      'Datenschutzerklärung und Informationen zur Verarbeitung personenbezogener Daten auf der Website von Rodrigo Normando Art.',
    ogLocale: 'de_DE',
    isHome: false,
  },
]

async function prerender() {
  console.log('[prerender] Starting static HTML generation...')

  const templatePath = path.resolve(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run vite build first.')
  }
  const template = fs.readFileSync(templatePath, 'utf-8')

  const serverEntryPath = path.resolve(distSsrDir, 'entry-server.js')
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error('dist-ssr/entry-server.js not found. Run vite build --ssr first.')
  }

  const { render } = await import(pathToFileURL(serverEntryPath).href)

  for (const route of routes) {
    console.log(`[prerender] Rendering route ${route.path} (${route.lang})...`)
    const { appHtml } = render(route.path)

    const canonicalUrl = `${siteOrigin}${route.path}`
    const imageUrl = `${siteOrigin}/Gagarin-Focus.JPEG`

    let html = template
    // Replace <html lang="...">
    html = html.replace(/<html[^>]*>/, `<html lang="${route.lang}">`)

    // Replace <title>
    html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)

    // Replace description meta
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
      `<meta name="description" content="${route.description}" />`
    )

    // Build head meta additions
    const headAdditions = [
      `<link rel="canonical" href="${canonicalUrl}" />`,
    ]

    if (route.isHome) {
      headAdditions.push(
        `<link rel="alternate" hreflang="de" href="${siteOrigin}/de/" />`,
        `<link rel="alternate" hreflang="pt-BR" href="${siteOrigin}/pt/" />`,
        `<link rel="alternate" hreflang="en" href="${siteOrigin}/en/" />`,
        `<link rel="alternate" hreflang="x-default" href="${siteOrigin}/de/" />`
      )
    }

    headAdditions.push(
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Rodrigo Normando Art" />`,
      `<meta property="og:title" content="${route.title}" />`,
      `<meta property="og:description" content="${route.description}" />`,
      `<meta property="og:url" content="${canonicalUrl}" />`,
      `<meta property="og:image" content="${imageUrl}" />`,
      `<meta property="og:image:width" content="966" />`,
      `<meta property="og:image:height" content="515" />`,
      `<meta property="og:image:type" content="image/jpeg" />`,
      `<meta property="og:locale" content="${route.ogLocale}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${route.title}" />`,
      `<meta name="twitter:description" content="${route.description}" />`,
      `<meta name="twitter:image" content="${imageUrl}" />`
    )

    // Structured data
    const schemaPerson = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Rodrigo Normando',
      jobTitle:
        route.lang === 'de'
          ? 'Künstler & Porträtmaler'
          : route.lang === 'en'
          ? 'Artist & Portrait Painter'
          : 'Artista e Retratista',
      description:
        route.lang === 'de'
          ? 'Traditioneller Porträtmaler und Zeichner in Essen, Deutschland.'
          : route.lang === 'en'
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
      name: 'Rodrigo Normando Art',
      url: `${siteOrigin}/`,
      inLanguage: ['de', 'pt-BR', 'en'],
      author: {
        '@type': 'Person',
        name: 'Rodrigo Normando',
      },
    }

    headAdditions.push(
      `<script type="application/ld+json">${JSON.stringify(schemaPerson)}</script>`,
      `<script type="application/ld+json">${JSON.stringify(schemaWebsite)}</script>`
    )

    html = html.replace('</head>', `  ${headAdditions.join('\n    ')}\n  </head>`)

    // Inject rendered app HTML into root div
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

    const outDir = path.resolve(distDir, route.path.replace(/^\/+|\/+$/g, ''))
    fs.mkdirSync(outDir, { recursive: true })
    const outFilePath = path.resolve(outDir, 'index.html')
    fs.writeFileSync(outFilePath, html, 'utf-8')
    console.log(`[prerender] Wrote ${path.relative(rootDir, outFilePath)} (${html.length} bytes)`)
  }

  // Update root dist/index.html to redirect cleanly to /de/
  console.log('[prerender] Updating root dist/index.html with redirect to /de/...')
  let rootHtml = template
  rootHtml = rootHtml.replace(/<html[^>]*>/, '<html lang="de">')
  rootHtml = rootHtml.replace(
    '</head>',
    `  <meta http-equiv="refresh" content="0; url=/de/" />\n    <link rel="canonical" href="${siteOrigin}/de/" />\n  </head>`
  )
  rootHtml = rootHtml.replace(
    '<div id="root"></div>',
    `<div id="root"><p style="text-align:center;padding:3rem;font-family:sans-serif;">Weiterleitung zu <a href="/de/">Rodrigo Normando Art (/de/)</a>...</p></div>`
  )
  fs.writeFileSync(templatePath, rootHtml, 'utf-8')

  // Clean up dist-ssr
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true })
    console.log('[prerender] Cleaned up temporary dist-ssr directory.')
  }

  console.log('[prerender] Static HTML generation complete!')
}

prerender().catch((err) => {
  console.error('[prerender] Fatal error:', err)
  process.exit(1)
})
