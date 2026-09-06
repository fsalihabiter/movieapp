import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import axios from 'axios';

import App from './App';
import i18n from './i18n';

import './index.css';

axios.interceptors.request.use(config => {
  if (config.url && config.url.includes('api.themoviedb.org')) {
    const lang = i18n.resolvedLanguage === 'tr' ? 'tr-TR' : 'en-US';
    // Sadece statik olan tr-TR parametresini dinamik dile çevirir. 
    // Eğer bir servis özel olarak en-US istiyorsa (Örn. Fallback servisi) onu bozmaz.
    if (config.url.includes('language=tr-TR')) {
        config.url = config.url.replace('language=tr-TR', `language=${lang}`);
    }
  }
  return config;
});

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    mode: 'dark',
    body4: {
      light: '#484848',
      main: '#212121',
      dark: '#000000',
      contrastText: '#484848',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          textTransform: 'none',
          letterSpacing: '0.1rem'
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#fff',
          textDecoration: 'none',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '10px 30px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: 0,
          maxWidth: '100%',
          width: '100%'
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backgroundImage: 'none'
        },
      },
    },
  },
});

theme.typography.body4 = {
  fontSize: '0.9rem',
  color: 'rgba(255,255,255,0.4)',
};

theme.typography.body5 = {
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.4)',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </AuthProvider>
);