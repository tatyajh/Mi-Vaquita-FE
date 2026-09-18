import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import FriendsService from '../services/FriendsService';
import UsersService from '../services/UsersService';
import { getCurrentUser } from '../services/AuthService';
import FriendCard from '../components/friends/FriendCard';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';

const FriendsPage = () => {
  const currentUser = getCurrentUser();
  const [friends, setFriends] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFriends = async () => {
    try {
      const friendsData = await FriendsService.getFriends();
      setFriends(friendsData);
    } catch (err) {
      console.error('Error al obtener los amigos:', err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const email = emailInput.trim();
    if (!email) {
      setError('Ingresa un correo para buscar.');
      return;
    }

    setSubmitting(true);
    try {
      const foundUser = await UsersService.getUserByEmail(email);

      if (foundUser?.id === currentUser?.id) {
        setError('No puedes agregarte a ti mismo como amigo.');
        return;
      }

      await FriendsService.addFriend({ userId: currentUser?.id, friendUserId: foundUser.id });
      setSuccess(`¡${foundUser.name} fue agregado a tus amigos!`);
      setEmailInput('');
      fetchFriends();
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;

      if (status === 404) {
        setError('No encontramos una cuenta con ese correo. Pídele que se registre en Mi Vaquita primero.');
      } else if (status === 409) {
        setError(serverMessage || 'Ya son amigos.');
      } else if (!err?.response) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.');
      } else {
        setError(serverMessage || 'No se pudo agregar el amigo. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await FriendsService.deleteFriend(friendId);
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (err) {
      console.error('Error al eliminar el amigo:', err);
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        title="Amig@s"
        subtitle="Las personas con las que compartes grupos y gastos."
      />

      <Box sx={{ px: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          component="form"
          onSubmit={handleAddFriend}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}
        >
          <TextField
            type="email"
            label="Buscar por correo"
            placeholder="amigo@correo.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ minWidth: 240, flexGrow: { xs: 1, sm: 0 } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!emailInput.trim() || submitting}
          >
            Agregar amigo
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} data-testid="friends-error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }} data-testid="friends-success">
            {success}
          </Alert>
        )}
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Amigos</Typography>
        {friends.length === 0 ? (
          <EmptyState
            title="Todavía no has agregado amigos"
            description="Busca a alguien por su correo y presiona 'Agregar amigo' para empezar a compartir gastos con ellos."
          />
        ) : (
          <Grid container spacing={2}>
            {friends.map((friend) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
                <FriendCard friend={friend} onDelete={handleDeleteFriend} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default FriendsPage;
