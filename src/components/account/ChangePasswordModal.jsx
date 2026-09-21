import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Modal, Typography } from '@mui/material';
import usersService from '../../services/UsersService';
import PasswordField from '../common/PasswordField';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[0-9])/;

const ChangePasswordModal = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [open]);

  const handleSubmit = async () => {
    setError('');
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError('La nueva contraseña debe tener al menos una letra minúscula y un número.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    setSubmitting(true);
    try {
      await usersService.changePassword(currentPassword, newPassword);
      setSuccess('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo cambiar la contraseña.');
    } finally {
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
          width: { xs: '92%', sm: '80%', md: 400 },
          maxWidth: '95vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
          Cambiar contraseña
        </Typography>
        <PasswordField
          label="Contraseña actual"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <PasswordField
          label="Nueva contraseña"
          fullWidth
          margin="normal"
          helperText="Debe incluir al menos una letra minúscula y un número"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordField
          label="Confirmar nueva contraseña"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={submitting || !currentPassword || !newPassword}
          sx={{ mt: 2 }}
        >
          {submitting ? 'Guardando...' : 'Guardar contraseña'}
        </Button>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
