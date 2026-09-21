import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';

const steps = [
  { title: 'Bienvenida a Mi Vaquita', body: 'Aquí puedes organizar aportes, préstamos, actividades y fechas sin mover dinero desde la aplicación.' },
  { title: 'Empieza por una natillera', body: 'Crea el ciclo, agrega integrantes registrados y define quién administra o lleva la tesorería.' },
  { title: 'Practica sin riesgo', body: 'Este ejemplo es ficticio y no guarda movimientos reales. Te muestra cómo se verá un resumen.' },
];

export default function OnboardingDialog({ open, onClose }) {
  const [step, setStep] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const finish = () => { setStep(0); onClose(); };
  return <Dialog open={open} onClose={finish} fullScreen={fullScreen} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: { xs: 0, sm: 5 } } }}>
    <DialogTitle sx={{ color: 'success.dark', fontWeight: 800 }}>{steps[step].title}</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">{steps[step].body}</Typography>
      {step === 2 && <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 4, bgcolor: '#f1f7df' }}>
        <Stack direction="row" spacing={2} alignItems="center"><SavingsOutlinedIcon color="success" fontSize="large" /><Box>
          <Typography fontWeight={800}>Ejemplo · Natillera Las Vecinas</Typography>
          <Typography variant="body2">Aportes registrados: $600.000 · Próxima cuota: 30 de septiembre</Typography>
        </Box></Stack>
      </Paper>}
    </DialogContent>
    <MobileStepper variant="dots" steps={steps.length} position="static" activeStep={step} sx={{ bgcolor: 'transparent', px: 3 }} nextButton={<span />} backButton={<span />} />
    <DialogActions sx={{ p: 2.5 }}>
      {step > 0 && <Button onClick={() => setStep(step - 1)}>Atrás</Button>}
      <Button variant="contained" onClick={() => step === steps.length - 1 ? finish() : setStep(step + 1)}>{step === steps.length - 1 ? 'Empezar' : 'Siguiente'}</Button>
    </DialogActions>
  </Dialog>;
}
