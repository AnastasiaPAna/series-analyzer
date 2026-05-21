'use client';

import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Arial, sans-serif' },
});

export default function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
