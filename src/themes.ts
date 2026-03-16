// src/themes.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

// Tema escuro
export const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
  },
});
