import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Paper, Typography } from '@mui/material';

const TermsPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f1f7df', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            Términos de servicio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Última actualización: septiembre de 2026
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>1. Qué es Mi Vaquita</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Mi Vaquita es una aplicación para organizar y repartir gastos compartidos entre
            amigos: paseos, natilleras (fondos rotativos de ahorro) y actividades grupales
            como amigo secreto o rifas. La app calcula quién le debe a quién, pero no
            transfiere dinero entre usuarios: cualquier pago acordado se hace por fuera de la
            plataforma (transferencia, efectivo, etc.).
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>2. Tu cuenta</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Eres responsable de mantener segura tu contraseña y de la información que
            ingreses (nombre, correo, gastos, grupos y natilleras que crees). No debes usar
            la cuenta de otra persona sin su autorización.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>3. Uso aceptable</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No está permitido usar Mi Vaquita para registrar información falsa con la
            intención de engañar a otros participantes de un grupo, ni para intentar acceder
            a cuentas o datos que no te pertenecen.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>4. Cancelación de tu cuenta</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Puedes dar de baja tu cuenta en cualquier momento desde el menú de tu perfil.
            Al hacerlo, tu cuenta deja de estar activa (no podrás iniciar sesión ni aparecerás
            en búsquedas de amigos), pero se conserva tu historial de gastos dentro de los
            grupos compartidos con otras personas, para no alterar los saldos de ellas.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>5. Cambios a estos términos</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Podemos actualizar estos términos ocasionalmente. Si los cambios son
            importantes, lo indicaremos dentro de la aplicación.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4 }}>
            Ver también nuestra <Link component={RouterLink} to="/privacidad">política de privacidad</Link>.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsPage;
