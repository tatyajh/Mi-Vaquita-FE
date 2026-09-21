import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { getCurrentUser } from '../services/AuthService';
import '../styles/FeaturePages.css';
import * as calendarApi from '../services/CalendarService';
import { formatCurrency } from '../utils/currency';

const options = [
  { tone: 'green', icon: SavingsOutlinedIcon, title: 'Organiza una natillera', copy: 'Planea cuotas, préstamos, ventas y el reparto final.', to: '/natilleras', action: 'Ver natilleras' },
  { tone: 'lavender', icon: GroupsOutlinedIcon, title: 'Comparte gastos', copy: 'Crea un grupo para una salida y lleva las cuentas claras.', to: '/groups', action: 'Ver grupos' },
  { tone: 'yellow', icon: CelebrationOutlinedIcon, title: 'Prepara una actividad', copy: 'Amigo secreto, rifas, ventas y otros planes con tu propia lista.', to: '/activities', action: 'Ver actividades' },
];

export default function HomePage() {
  const user = getCurrentUser();
  const [upcoming,setUpcoming]=useState([]);
  useEffect(()=>{const now=new Date(),end=new Date();end.setDate(end.getDate()+60);calendarApi.getCalendar(now.toISOString().slice(0,10),end.toISOString().slice(0,10)).then(x=>setUpcoming(x.events.filter(e=>e.status!=='completed').slice(0,5))).catch(()=>{});},[]);
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
    <Paper className="mv-page-panel" sx={{my:4}}>
      <Stack direction={{xs:'column',sm:'row'}} justifyContent="space-between" alignItems={{xs:'stretch',sm:'center'}} gap={2}>
        <Box><Typography variant="h5" color="accentGreen.dark" fontWeight={800}>Próximos compromisos</Typography><Typography color="text.secondary">Tus fechas más cercanas, reunidas en un solo lugar.</Typography></Box>
        <Button component={Link} to="/calendario" variant="green" startIcon={<CalendarMonthOutlinedIcon/>}>Ver calendario</Button>
      </Stack>
      <Stack spacing={1} sx={{mt:2}}>{upcoming.length?upcoming.map(e=><Box key={e.id} sx={{display:'flex',alignItems:{xs:'flex-start',sm:'center'},justifyContent:'space-between',gap:2,p:1.5,borderRadius:3,background:'#f1f7df',flexDirection:{xs:'column',sm:'row'}}}><Box><Typography fontWeight={800}>{e.title}</Typography><Typography variant="body2" color="text.secondary">{new Date(`${e.date}T12:00:00`).toLocaleDateString('es-CO',{day:'numeric',month:'long'})}{e.amount!=null?` · ${formatCurrency(e.amount)}`:''}</Typography></Box><Button component={Link} to={e.link} size="small">Abrir</Button></Box>):<Typography color="text.secondary" sx={{py:1}}>No tienes compromisos en los próximos 60 días.</Typography>}</Stack>
    </Paper>
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
