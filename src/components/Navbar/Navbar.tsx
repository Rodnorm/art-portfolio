import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import {
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material'
import { FaTiktok } from 'react-icons/fa'
import type { NavLink } from '../../types'
import styles from './Navbar.module.css'

const navLinks: NavLink[] = [
  { name: 'home', href: '#home' },
  { name: 'work', href: '#trabalhos' },
  { name: 'about', href: '#about' },
  { name: 'prices', href: '#precos' },
  { name: 'contact', href: '#contato' },
  { name: 'tiktok', href: 'https://www.tiktok.com/@atelier.normando', external: true },
]

const languages = [
  { code: 'en', label: 'nav.en' },
  { code: 'pt', label: 'nav.pt' },
  { code: 'de', label: 'nav.de' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  })
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#29251f')
    } else {
      document.documentElement.removeAttribute('data-theme')
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f2ebdd')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const closeDrawer = () => setOpen(false)

  const closeDrawerAndRestoreFocus = () => {
    setOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    closeDrawer()
  }

  const renderLinkLabel = (link: NavLink) =>
    link.name === 'tiktok' ? (
      <>
        <FaTiktok aria-hidden="true" />
        <span>{t('nav.tiktok')}</span>
      </>
    ) : (
      t(`nav.${link.name}`)
    )

  return (
    <>
      <AppBar component="header" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <a className={styles.brand} href="#home">
            Rodrigo Normando
          </a>

          <Box
            component="nav"
            className={styles.desktopNavigation}
            aria-label={t('nav.main_navigation')}
          >
            <Box className={styles.desktopLinks}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  className={styles.navigationLink}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {renderLinkLabel(link)}
                </a>
              ))}
            </Box>

            <Box
              className={styles.languageGroup}
              role="group"
              aria-label={t('nav.language')}
            >
              {languages.map((language) => (
                <Button
                  key={language.code}
                  className={`${styles.languageButton} ${
                    i18n.resolvedLanguage === language.code ? styles.languageActive : ''
                  }`}
                  onClick={() => changeLanguage(language.code)}
                  aria-pressed={i18n.resolvedLanguage === language.code}
                >
                  {language.code.toUpperCase()}
                </Button>
              ))}
            </Box>

            <IconButton
              onClick={toggleTheme}
              aria-label={t('nav.toggle_theme')}
              className={styles.themeToggleDesktop}
              sx={{ ml: 2, color: 'var(--color-text)' }}
            >
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          <IconButton
            onClick={toggleTheme}
            aria-label={t('nav.toggle_theme')}
            className={styles.themeToggleMobile}
            sx={{ ml: 'auto', color: 'var(--color-text)' }}
          >
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            ref={menuButtonRef}
            id="menuIcon"
            className={styles.menuButton}
            aria-label={t('nav.menu_aria')}
            aria-expanded={open}
            aria-controls={open ? 'navigation-drawer' : undefined}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        id="navigation-drawer"
        anchor="right"
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') closeDrawerAndRestoreFocus()
          else closeDrawer()
        }}
        PaperProps={{ className: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <span className={styles.drawerBrand}>Rodrigo Normando</span>
          <IconButton
            onClick={closeDrawerAndRestoreFocus}
            aria-label={t('nav.close_menu')}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Divider />

        <List component="nav" aria-label={t('nav.main_navigation')}>
          {navLinks.map((link) => (
            <ListItem key={link.name} disablePadding>
              <ListItemButton
                component="a"
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={closeDrawer}
                className={styles.drawerLink}
              >
                <ListItemText primary={renderLinkLabel(link)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <Box className={styles.drawerLanguages}>
          <span className={styles.languageLabel}>{t('nav.language')}</span>
          <Box
            className={styles.languageGroup}
            role="group"
            aria-label={t('nav.language')}
          >
            {languages.map((language) => (
              <Button
                key={language.code}
                className={`${styles.languageButton} ${
                  i18n.resolvedLanguage === language.code ? styles.languageActive : ''
                }`}
                onClick={() => changeLanguage(language.code)}
                aria-pressed={i18n.resolvedLanguage === language.code}
              >
                {language.code.toUpperCase()}
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
