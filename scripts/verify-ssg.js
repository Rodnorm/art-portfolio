import fs from 'node:fs'
import path from 'node:path'

const files = [
  'dist/de/index.html',
  'dist/pt/index.html',
  'dist/en/index.html',
  'dist/impressum/index.html',
  'dist/datenschutz/index.html',
  'dist/index.html',
]

console.log('=== Verifying Pre-rendered HTML Files ===')

let allPassed = true

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.error(`FAIL: Missing ${f}`)
    allPassed = false
    continue
  }
  const content = fs.readFileSync(f, 'utf8')
  const figures = (content.match(/<figure/g) || []).length
  const hasH1 = content.includes('<h1')
  const hasCanonical = content.includes('rel="canonical"')
  const hasHreflang = content.includes('hreflang="pt-BR"')
  const hasJsonLd = content.includes('application/ld+json')
  const langMatch = content.match(/<html lang="([^"]+)"/)
  const lang = langMatch ? langMatch[1] : 'none'
  const titleMatch = content.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : 'none'

  console.log(`\n[${f}]`)
  console.log(`  Size: ${content.length} bytes`)
  console.log(`  Language: ${lang}`)
  console.log(`  Title: ${title}`)
  console.log(`  Artwork figures: ${figures}`)
  console.log(`  Has H1: ${hasH1}`)
  console.log(`  Has Canonical: ${hasCanonical}`)
  console.log(`  Has Hreflang: ${hasHreflang}`)
  console.log(`  Has JSON-LD: ${hasJsonLd}`)

  if (f.startsWith('dist/de/') || f.startsWith('dist/pt/') || f.startsWith('dist/en/')) {
    if (figures !== 21) {
      console.error(`  FAIL: Expected 21 figures in ${f}, got ${figures}`)
      allPassed = false
    }
    if (!hasH1 || !hasCanonical || !hasHreflang || !hasJsonLd) {
      console.error(`  FAIL: Missing SEO tags in ${f}`)
      allPassed = false
    }
  }
}

// Check fonts and theme script
const fontsExist =
  fs.existsSync('dist/fonts/playfair-display-latin.woff2') &&
  fs.existsSync('dist/fonts/playfair-display-latin-ext.woff2')
const themeInitExists = fs.existsSync('dist/theme-init.js')
const robotsExists = fs.existsSync('dist/robots.txt')
const sitemapExists = fs.existsSync('dist/sitemap.xml')
const notFoundExists = fs.existsSync('dist/404.html')

console.log('\n=== Verifying Assets & Static Config ===')
console.log(`  Playfair Display woff2 fonts: ${fontsExist ? 'OK' : 'FAIL'}`)
console.log(`  theme-init.js: ${themeInitExists ? 'OK' : 'FAIL'}`)
console.log(`  robots.txt: ${robotsExists ? 'OK' : 'FAIL'}`)
console.log(`  sitemap.xml: ${sitemapExists ? 'OK' : 'FAIL'}`)
console.log(`  404.html: ${notFoundExists ? 'OK' : 'FAIL'}`)

if (!fontsExist || !themeInitExists || !robotsExists || !sitemapExists || !notFoundExists) {
  allPassed = false
}

console.log(`\nOverall verification: ${allPassed ? 'PASSED ALL CHECKS' : 'FAILED'}`)
process.exit(allPassed ? 0 : 1)
