'use client';

import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8dff',
      dark: '#244a8f',
      light: '#d7e8ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b57',
      contrastText: '#ffffff',
    },
    background: {
      default: '#c7def7',
      paper: 'rgba(223, 238, 255, 0.92)',
    },
    text: {
      primary: '#132238',
      secondary: '#56677d',
    },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background: [
            'radial-gradient(circle at 10% 12%, rgba(72, 176, 255, 0.34), transparent 0 28%)',
            'radial-gradient(circle at 88% 10%, rgba(255, 82, 82, 0.22), transparent 0 19%)',
            'radial-gradient(circle at 50% 100%, rgba(56, 135, 255, 0.24), transparent 0 30%)',
            'linear-gradient(180deg, #d9ecff 0%, #cae1fb 28%, #b7d5f6 64%, #d8ecff 100%)'
          ].join(','),
          backgroundAttachment: 'fixed',
        },
        '#__next': {
          minHeight: '100vh',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #11253f 0%, #1f3f68 56%, #12283f 100%)',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 16px 34px rgba(17, 34, 61, 0.32)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(232,244,255,0.95) 0%, rgba(212,229,247,0.92) 100%)',
          border: '1px solid rgba(79, 141, 255, 0.18)',
          boxShadow: '0 20px 42px rgba(42, 79, 122, 0.14)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 22px 44px rgba(42, 79, 122, 0.16)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          boxShadow: '0 14px 30px rgba(79, 141, 255, 0.28)',
        },
      },
    },
  },
});

export default function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}


