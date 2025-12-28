
'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: 'monospace',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#00ff00',
    },
    h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#00ff00',
    },
    h3: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#00ff00',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                border: '1px solid #2a2a2a',
            }
        }
    }
  },
});

export default theme;
