import React, { useEffect, useRef, useState } from 'react';
import { Alert, Autocomplete, Box, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FriendsService from '../services/FriendsService';
import UsersService from '../services/UsersService';
import { getCurrentUser } from '../services/AuthService';
import FriendCard from '../components/friends/FriendCard';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import '../styles/FeaturePages.css';

const SEARCH_DEBOUNCE_MS = 300;

const FriendsPage = () => {
  const currentUser = getCurrentUser();
  const [friends, setFriends] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef(null);
  const searchRequestRef = useRef(0);

  const fetchFriends = async () => {
    try {
      const friendsData = await FriendsService.getFriends();
      setFriends(friendsData);
    } catch (err) {
      console.error('Error al obtener los amigos:', err);
      setError('No se pudo cargar tu lista de amigos. Intenta recargar la página.');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const query = inputValue.trim();
    if (!query) {
      searchRequestRef.current += 1;
      setOptions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const requestId = ++searchRequestRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await UsersService.searchUsers(query);
        // Una búsqueda anterior puede responder después de la más
        // reciente. Ignorarla evita mostrar/agregar una persona distinta
        // de la que corresponde al texto visible en el selector.
        if (requestId === searchRequestRef.current) {
          setOptions(Array.isArray(results) ? results : []);
        }
      } catch (err) {
        console.error('Error al buscar usuarios:', err);
        if (requestId === searchRequestRef.current) setOptions([]);
      } finally {
        if (requestId === searchRequestRef.current) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const handleSelectUser = async (_e, selectedUser) => {
    if (!selectedUser) {
      return;
    }
    setError('');
    setSuccess('');

    if (selectedUser.id === currentUser?.id) {
      setError('No puedes agregarte a ti mismo como amigo.');
      return;
    }

    setSubmitting(true);
    try {
      await FriendsService.addFriend({ userId: currentUser?.id, friendUserId: selectedUser.id });
      setSuccess(`¡${selectedUser.name} fue agregado a tus amigos!`);
      setInputValue('');
      setOptions([]);
      await fetchFriends();
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
    setError('');
    setSuccess('');
    try {
      await FriendsService.deleteFriend(friendId);
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (err) {
      console.error('Error al eliminar el amigo:', err);
      setError('No se pudo eliminar el amigo. Intenta de nuevo.');
    }
  };

  return (
    <Box className="mv-page" sx={{ pb: 4 }}>
      <PageHeader
        title="Amig@s"
        subtitle="Las personas con las que compartes grupos y gastos."
        titleColor="accentGreen.dark"
      />

      <Paper className="mv-page-panel" sx={{ mx: { xs: 2, sm: 3 }, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 0.5, color: 'accentGreen.dark', fontWeight: 800 }}>Encuentra a tu gente</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Busca por nombre o correo. Solo agregarás a la persona que selecciones.</Typography>
        <Autocomplete
          options={options}
          filterOptions={(x) => x}
          getOptionLabel={(option) => (option?.name ? `${option.name} (${option.email})` : '')}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          inputValue={inputValue}
          onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
          onChange={handleSelectUser}
          value={null}
          loading={searching}
          disabled={submitting}
          noOptionsText={inputValue.trim() ? 'No encontramos resultados' : 'Escribe un nombre o correo'}
          sx={{ width: '100%', maxWidth: 560 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar amigo por nombre o correo"
              placeholder="Nombre o correo"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searching ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
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
      </Paper>

      <Paper className="mv-page-panel" sx={{ mx: { xs: 2, sm: 3 }, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'accentGreen.dark', fontWeight: 800 }}>Tus amigos</Typography>
        {friends.length === 0 ? (
          <EmptyState
            icon={<PeopleAltOutlinedIcon fontSize="inherit" />}
            title="Todavía no has agregado amigos"
            description="Usa el buscador de arriba y elige a la persona correcta para empezar a compartir planes y gastos."
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
      </Paper>
    </Box>
  );
};

export default FriendsPage;
