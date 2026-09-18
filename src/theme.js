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
      main: '#b02a37',
      light: '#fdecea',
      dark: '#8c2129',
      contrastText: '#b02a37',
    },
    success: {
      main: '#1e7e34',
      light: '#e6f4ea',
      dark: '#155d27',
      contrastText: '#1e7e34',
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          textTransform: 'none',
        },
      },
      variants: [
        {
          props: { variant: 'soft' },
          style: {
            backgroundColor: 'rgba(54, 25, 13, 0.08)',
            color: '#36190d',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'rgba(54, 25, 13, 0.16)',
            },
          },
        },
      ],
    },
  },
});

export default theme;
