import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, Grid } from '@mui/material';
import FriendsService from '../services/FriendsService';
import UsersService from '../services/UsersService';
import { getCurrentUser } from '../services/AuthService';
import FriendCard from '../components/friends/FriendCard';

const FriendsPage = () => {
  const currentUser = getCurrentUser();
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const fetchUsersAndFriends = async () => {
    try {
      const usersData = await UsersService.getAllUsers();
      setUsers(usersData);
      const friendsData = await FriendsService.getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchUsersAndFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      await FriendsService.addFriend({ userId: currentUser?.id, friendUserId: selectedUser });
      fetchUsersAndFriends(); // Volver a cargar amigos y usuarios
      setSelectedUser('');
    } catch (error) {
      console.error('Error al agregar el amigo:', error);
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await FriendsService.deleteFriend(friendId);
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error('Error al eliminar el amigo:', error);
    }
  };

  const availableUsers = users.filter((user) => user.id !== currentUser?.id);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>Lista de amigos</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200, flexGrow: { xs: 1, sm: 0 } }}
        >
          <MenuItem value="" disabled>Seleccionar Usuario</MenuItem>
          {availableUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.email} ({user.name})
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedUser}
          onClick={handleAddFriend}
        >
          Agregar
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Amigos:</Typography>
        {friends.length === 0 && (
          <Typography color="text.secondary">Todavía no has agregado amigos.</Typography>
        )}
        <Grid container spacing={2}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
              <FriendCard friend={friend} onDelete={handleDeleteFriend} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default FriendsPage;
