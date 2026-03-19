import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1A2E',
      light: '#2D2D44',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8E0D5',
      contrastText: '#1A1A2E',
    },
    background: {
      default: '#FAFAF8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B6B7B',
    },
    success: { main: '#2E7D5E' },
    error: { main: '#C0392B' },
    divider: '#E8E0D5',
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0px 1px 3px rgba(26,26,46,0.06)',
    '0px 4px 16px rgba(26,26,46,0.08)',
    '0px 8px 32px rgba(26,26,46,0.10)',
    ...Array(21).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        containedPrimary: {
          background: '#1A1A2E',
          '&:hover': { background: '#2D2D44', transform: 'translateY(-1px)' },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FAFAF8',
            '&:hover fieldset': { borderColor: '#1A1A2E' },
            '&.Mui-focused fieldset': { borderColor: '#1A1A2E', borderWidth: 1.5 },
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E8E0D5',
          boxShadow: '0px 4px 16px rgba(26,26,46,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' },
      },
    },
  },
});

export default theme;