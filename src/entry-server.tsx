import React from 'react'
import { renderToString } from 'react-dom/server'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import theme from './styles/theme'
import i18n from './i18n'

export function render(url: string = '/de/') {
  let lang = 'de'
  if (url.startsWith('/pt')) {
    lang = 'pt'
  } else if (url.startsWith('/en')) {
    lang = 'en'
  } else {
    lang = 'de'
  }

  i18n.changeLanguage(lang)

  const appHtml = renderToString(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App initialUrl={url} initialLang={lang} />
      </ThemeProvider>
    </React.StrictMode>
  )

  return { appHtml, lang }
}
