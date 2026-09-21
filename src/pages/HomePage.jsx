import React from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import { getCurrentUser } from '../services/AuthService';
import '../styles/FeaturePages.css';

const options = [
  { tone: 'green', icon: SavingsOutlinedIcon, title: 'Organiza una natillera', copy: 'Planea cuotas, préstamos, ventas y el reparto final.', to: '/natilleras', action: 'Ver natilleras' },
  { tone: 'lavender', icon: GroupsOutlinedIcon, title: 'Comparte gastos', copy: 'Crea un grupo para una salida y lleva las cuentas claras.', to: '/groups', action: 'Ver grupos' },
  { tone: 'yellow', icon: CelebrationOutlinedIcon, title: 'Prepara una actividad', copy: 'Amigo secreto, rifas, ventas y otros planes con tu propia lista.', to: '/activities', action: 'Ver actividades' },
];

export default function HomePage() {
  const user = getCurrentUser();
  return <Box className="mv-page"><Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
    <Box className="mv-home-hero">
      <Box>
        <Chip label="Todo en un solo lugar" className="mv-home-chip" />
        <Typography component="h1">Hola, {user?.name?.split(' ')[0] || 'bienvenida'}</Typography>
        <Typography component="p">Organiza el ahorro, los gastos y los planes del grupo sin perder de vista quién aportó y qué falta.</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button component={Link} to="/natilleras" variant="contained" color="secondary">Crear una natillera</Button>
          <Button component={Link} to="/activities" variant="outlined">Nueva actividad</Button>
        </Stack>
      </Box>
      <Box className="mv-home-visual" aria-hidden="true"><SavingsOutlinedIcon /><span>$</span></Box>
    </Box>
    <Typography className="mv-page-section-title" component="h2">¿Qué quieres organizar hoy?</Typography>
    <Grid container spacing={3}>{options.map(({ tone, icon: Icon, title, copy, to, action }) => <Grid item xs={12} md={4} key={to}>
      <Paper className={`mv-home-option ${tone}`}>
        <Icon />
        <Typography component="h3">{title}</Typography>
        <Typography>{copy}</Typography>
        <Button component={Link} to={to}>{action}</Button>
      </Paper>
    </Grid>)}</Grid>
  </Box></Box>;
}
