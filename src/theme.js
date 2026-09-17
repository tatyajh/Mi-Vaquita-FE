import { createTheme } from '@mui/material/styles';

// Centralized "kawaii" theme for Mi Vaquita: soft rounded corners, gentle
// shadows and the brand's brown/cream cow palette, applied app-wide.
const theme = createTheme({
  palette: {
    primary: {
      main: '#36190d',
      light: '#59382e',
      dark: '#210f08',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f4a259',
      light: '#ffd8a8',
      dark: '#c97d38',
      contrastText: '#36190d',
    },
    error: {
      main: '#e5484d',
    },
    success: {
      main: '#2f9e44',
    },
    background: {
      default: '#fffaf3',
      paper: '#ffffff',
    },
    text: {
      primary: '#36190d',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: [
      '"Nunito"',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 6px 16px rgba(54, 25, 13, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});

export default theme;
