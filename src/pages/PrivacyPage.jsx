import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Container, Link, Paper, Typography } from '@mui/material';

const PrivacyPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f1f7df', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            Política de privacidad
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Última actualización: septiembre de 2026
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}><strong>Documento preliminar.</strong> Responsable del tratamiento: [PENDIENTE]. Identificación, domicilio, correo y canal de consultas o reclamos: [PENDIENTE ANTES DE VENDER].</Alert>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Qué datos recogemos</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tu nombre y correo al registrarte; los gastos, grupos, natilleras y actividades
            que crees o en los que participes; y los datos (nombre, correo) de las personas
            que agregas como amigos dentro de la app. Tu contraseña nunca se guarda en texto
            plano: se almacena cifrada (hash).
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Con quién se comparte</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Con nadie fuera de la aplicación, salvo un proveedor de correo transaccional
            (Resend) usado únicamente para enviarte el enlace de recuperación de contraseña
            cuando lo solicitas. No vendemos ni compartimos tus datos con terceros para
            publicidad.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Dónde se almacena</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tus datos se guardan en una base de datos alojada en Supabase (Postgres), con
            acceso restringido por credenciales que solo el backend de la aplicación conoce.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Tus derechos</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Puedes pedir la baja de tu cuenta en cualquier momento desde el menú de tu
            perfil ("Darse de baja"). Esto desactiva tu cuenta de inmediato: dejas de poder
            iniciar sesión y de aparecer en búsquedas de amigos. Conservamos tu historial de
            gastos dentro de grupos compartidos con otras personas, para no alterar sus
            saldos, pero ya no queda asociado a una cuenta activa.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Finalidades, conservación y proveedores</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Usamos los datos para crear cuentas, mostrar participantes autorizados, calcular registros y enviar comunicaciones solicitadas. Intervienen proveedores de alojamiento, base de datos y correo que pueden procesar información fuera de Colombia. [PENDIENTE DE REVISIÓN LEGAL: periodos exactos de conservación, países y mecanismos de transferencia]. No guardamos el contenido de contraseñas, PIN ni enlaces privados en texto plano.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Menores y eliminación</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Mi Vaquita no está dirigida a menores sin acompañamiento de su representante. Puedes solicitar actualización, consulta, corrección o eliminación mediante [CANAL PENDIENTE]. Algunos movimientos compartidos se conservan de forma limitada cuando sean necesarios para no alterar cuentas de otras personas.
          </Typography>

          <Typography variant="body2" sx={{ mt: 4 }}>
            Ver también nuestros <Link component={RouterLink} to="/terminos">términos de servicio</Link>.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
