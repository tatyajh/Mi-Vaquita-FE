import { createTheme } from '@mui/material/styles';

// Tema de marca "Cosechas" para Mi Vaquita: la paleta y tipografía real
// de cosechasexpress.com (magenta vibrante, ámbar, verdes de marca),
// tipografía redondeada tipo display para títulos, y las mismas curvas
// orgánicas/formas de píldora que ya traía el tema anterior.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ED1651', // magenta Cosechas
      light: '#FF5C8A',
      dark: '#B80F3D',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FAA918', // ámbar Cosechas
      light: '#FFC65C',
      dark: '#D68A00',
      contrastText: '#36190d',
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
      default: '#FFF8EF',
      paper: '#ffffff',
    },
    text: {
      primary: '#36190d',
    },
    // Acentos "de marca" (antes "flavors" de candy), usados para tarjetas
    // de grupo/amigo/gasto sin color propio, cicladas/hasheadas por id.
    flavors: {
      magenta: '#ED1651',
      ambar: '#FAA918',
      ciruela: '#6D236A',
      lima: '#9FCB3B',
      coral: '#FF6F91',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: { fontWeight: 800, fontFamily: '"Comfortaa", "Montserrat", sans-serif' },
    h4: { fontWeight: 800, fontFamily: '"Comfortaa", "Montserrat", sans-serif' },
    h5: { fontWeight: 700, fontFamily: '"Comfortaa", "Montserrat", sans-serif' },
    h6: { fontWeight: 700, fontFamily: '"Comfortaa", "Montserrat", sans-serif' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        // Función en vez de objeto plano: así se puede usar
        // `theme.transitions.create(...)` en vez de escribir una
        // duración/curva de animación a mano, y queda consistente con
        // el resto de transiciones de MUI.
        root: ({ theme }) => ({
          borderRadius: 20,
          boxShadow: '0 6px 16px rgba(54, 25, 13, 0.12)',
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 14px 28px rgba(54, 25, 13, 0.18)',
          },
        }),
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
