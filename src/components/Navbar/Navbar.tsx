import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { FaTiktok } from 'react-icons/fa'
import type { NavLink } from '../../types'

const drawerWidth = 240

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
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => {
    setOpen(false)
    menuButtonRef.current?.focus()
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    handleDrawerClose()
  }

  // Keyboard navigation - close drawer with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        handleDrawerClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus management
  useEffect(() => {
    if (open) {
      // Focus first focusable element in drawer
      const firstFocusable = drawerRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    }
  }, [open])

  return (
    <Box sx={{ display: 'flex', position: 'absolute' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignSelf: 'end' }}>
          <IconButton
            ref={menuButtonRef}
            id="menuIcon"
            aria-label={t('nav.menu_aria')}
            aria-expanded={open}
            aria-controls="navigation-drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={[open && { display: 'none' }]}
            style={{
              color: 'rgb(244, 244, 244)',
              backgroundColor: '#848282',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        ref={drawerRef}
        id="navigation-drawer"
        aria-label={t('nav.navigation_menu')}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundImage: 'url(./textura.jpg)',
            backgroundPosition: 'center',
            color: '#ffffff',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1 }}>
          <IconButton
            onClick={handleDrawerClose}
            style={{ color: '#ffffff' }}
            aria-label={t('nav.close_menu')}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Divider />

        <List role="navigation" aria-label={t('nav.main_navigation')}>
          {navLinks.map((link) => (
            <ListItem key={link.name} disablePadding>
              <ListItemButton
                component="a"
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{ color: '#ffffff' }}
              >
                {link.name === 'tiktok' ? (
                  <FaTiktok size={24} aria-hidden="true" />
                ) : (
                  <ListItemText
                    primary={t(`nav.${link.name}`)}
                    primaryTypographyProps={{ style: { color: '#ffffff' } }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemText
              primary={t('nav.language')}
              primaryTypographyProps={{
                style: { color: '#cccccc', fontSize: '0.875rem' } }}
            />
          </ListItem>

          {languages.map((lang) => (
            <ListItem key={lang.code} disablePadding>
              <ListItemButton
                onClick={() => changeLanguage(lang.code)}
                style={{ color: '#ffffff' }}
                aria-pressed={i18n.language === lang.code}
              >
                <ListItemText primary={t(lang.label)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}