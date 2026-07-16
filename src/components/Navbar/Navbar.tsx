import { useState } from 'react'
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

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

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
            id="menuIcon"
            aria-label="open drawer"
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
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundImage: 'url(./textura.jpg)',
            backgroundPosition: 'center',
            color: 'white',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1 }}>
          <IconButton onClick={handleDrawerClose} style={{ color: 'white' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Divider />

        <List>
          {navLinks.map((link) => (
            <ListItem key={link.name} disablePadding>
              <ListItemButton
                component="a"
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.name === 'tiktok' ? (
                  <FaTiktok size={24} />
                ) : (
                  <ListItemText primary={t(`nav.${link.name}`)} />
                )}
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {languages.map((lang) => (
            <ListItem key={lang.code} disablePadding>
              <ListItemButton onClick={() => changeLanguage(lang.code)}>
                <ListItemText primary={t(lang.label)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}