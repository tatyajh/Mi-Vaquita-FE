import { createTheme } from '@mui/material/styles';

// Centralized "candy" theme for Mi Vaquita: saturated, appetizing colors,
// playful rounded typography and organic wavy dividers, applied app-wide.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff2d78', // hot pink / magenta
      light: '#ff6fa5',
      dark: '#c4005c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7b2ff7', // saturated purple
      light: '#a978ff',
      dark: '#5411c9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e8382f',
      light: '#fdecea',
      dark: '#b12b23',
      contrastText: '#e8382f',
    },
    success: {
      main: '#2fbf5b',
      light: '#e6f9ec',
      dark: '#1f8f42',
      contrastText: '#2fbf5b',
    },
    // Verde real de marca (tipo Cosechas: #9FCB3B/#23B24A), pensado
    // para usarse como acento de UI de verdad (botones, banners,
    // badges) — no solo como una opción más de `flavors`.
    accentGreen: {
      main: '#9fcb3b',
      light: '#d9eab1',
      dark: '#23b24a',
      contrastText: '#1a4d0f',
    },
    background: {
      default: '#fffaf3',
      paper: '#ffffff',
    },
    text: {
      primary: '#36190d',
    },
    // Candy "flavor" accents, used for group cards without their own color
    // (and for Friends/Expenses cards), cycled/hashed by id.
    flavors: {
      fresa: '#ff2d78', // strawberry - hot pink
      mango: '#ffc93c', // mango - bright yellow
      uva: '#7b2ff7', // grape - purple
      limon: '#8bd346', // lime - lime green
      durazno: '#ff8c42', // peach - coral/salmon
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
        {
          props: { variant: 'green' },
          style: {
            backgroundColor: '#9fcb3b',
            color: '#1a4d0f',
            boxShadow: '0 6px 14px rgba(159, 203, 59, 0.55)',
            '&:hover': {
              backgroundColor: '#8bbd2c',
            },
          },
        },
      ],
    },
  },
});

export default theme;
