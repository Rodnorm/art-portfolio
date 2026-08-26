import { createTheme } from '@mui/material/styles'

const colors = {
  paper50: '#FBF8F1',
  paper100: '#F2EBDD',
  paper200: '#E4D7C4',
  ink900: '#29251F',
  ink700: '#514A40',
  terracotta600: '#A6533F',
  terracotta800: '#71382D',
  olive600: '#66704A',
  olive800: '#3E472F',
  ochre500: '#C58B32',
  error700: '#9A342D',
  success700: '#3F684B',
  white: '#FFFFFF',
} as const

const bodyFont = "system-ui, -apple-system, 'Segoe UI', sans-serif"
const displayFont = "'Playfair Display', Georgia, 'Times New Roman', serif"

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.paper100,
      paper: colors.paper50,
    },
    text: {
      primary: colors.ink900,
      secondary: colors.ink700,
    },
    primary: {
      light: colors.terracotta600,
      main: colors.terracotta800,
      dark: colors.ink900,
      contrastText: colors.white,
    },
    secondary: {
      light: colors.olive600,
      main: colors.olive800,
      dark: colors.ink900,
      contrastText: colors.white,
    },
    divider: colors.paper200,
    warning: {
      main: colors.ochre500,
    },
    error: {
      main: colors.error700,
    },
    success: {
      main: colors.success700,
    },
  },
  spacing: 4,
  shape: {
    borderRadius: 4,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: bodyFont,
    fontSize: 16,
    h1: {
      fontFamily: displayFont,
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: displayFont,
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: displayFont,
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: displayFont,
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: displayFont,
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: displayFont,
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
  },
  transitions: {
    duration: {
      shortest: 160,
      shorter: 160,
      short: 240,
      standard: 240,
      complex: 400,
      enteringScreen: 240,
      leavingScreen: 160,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.paper100,
          color: colors.ink900,
        },
      },
    },
  },
})

export default theme
