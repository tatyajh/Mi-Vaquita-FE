import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import usersService from '../../services/UsersService';
import { logout } from '../../services/AuthService';
import { MILK_BAG_RADIUS } from '../../utils/shape';

const CONFIRM_WORD = 'DAR DE BAJA';

const DeactivateAccountModal = ({ open, onClose, onDeactivated }) => {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmText('');
      setError('');
    }
  }, [open]);

  const handleConfirm = async () => {
    if (confirmText.trim().toUpperCase() !== CONFIRM_WORD) {
      setError(`Escribe "${CONFIRM_WORD}" para confirmar.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await usersService.deactivateAccount();
      logout();
      onDeactivated();
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo dar de baja la cuenta. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: '80%', md: 420 },
          maxWidth: '95vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
          borderRadius: MILK_BAG_RADIUS,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1, color: 'error.dark' }}>
          Dar de baja tu cuenta
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          Esto es permanente: no podrás volver a iniciar sesión con esta cuenta ni te podrán agregar como amigo.
          Tus gastos ya registrados se mantienen para que los grupos que compartiste no pierdan su historial.
        </Typography>
        <TextField
          label={`Escribe "${CONFIRM_WORD}" para confirmar`}
          fullWidth
          margin="normal"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" fullWidth onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Procesando...' : 'Dar de baja'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeactivateAccountModal;
