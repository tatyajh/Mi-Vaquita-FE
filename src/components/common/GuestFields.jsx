import React from 'react';
import { Box, Button, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MILK_BAG_RADIUS } from '../../utils/shape';

const emptyGuest = () => ({ name: '', email: '', phone: '' });

export default function GuestFields({ value = [], onChange }) {
  const guests = value.length ? value : [emptyGuest()];
  const update = (index, key, nextValue) => onChange(guests.map((guest, i) => i === index ? { ...guest, [key]: nextValue } : guest));
  const remove = index => onChange(guests.filter((_, i) => i !== index));

  return <Box>
    <Typography fontWeight={800}>Invitados que no tienen cuenta</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
      Escribe el nombre y al menos un correo o número de WhatsApp. No necesitas usar separadores.
    </Typography>
    {guests.map((guest, index) => <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: MILK_BAG_RADIUS, position: 'relative' }}>
      <Grid container spacing={1.5}>
        <Grid item xs={12}><TextField fullWidth label="Nombre del invitado" value={guest.name} onChange={e => update(index, 'name', e.target.value)} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth type="email" label="Correo (opcional)" value={guest.email} onChange={e => update(index, 'email', e.target.value)} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth type="tel" label="WhatsApp (opcional)" placeholder="Ej. 300 123 4567" value={guest.phone} onChange={e => update(index, 'phone', e.target.value)} /></Grid>
      </Grid>
      {guests.length > 1 && <IconButton aria-label={`Quitar invitado ${index + 1}`} onClick={() => remove(index)} sx={{ position: 'absolute', right: 4, top: 4 }}><DeleteOutlineIcon /></IconButton>}
    </Paper>)}
    <Button startIcon={<AddIcon />} variant="outlined" onClick={() => onChange([...guests, emptyGuest()])}>Agregar otro invitado</Button>
  </Box>;
}
