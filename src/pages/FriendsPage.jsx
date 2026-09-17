import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Select, MenuItem } from '@mui/material';
import FriendsService from '../services/FriendsService';
import UsersService from '../services/UsersService';
import { getCurrentUser } from '../services/AuthService';

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
      <Typography variant="h4" sx={{ mb: 3, color: '#36190D', fontWeight: 'bold' }}>Lista de amigos</Typography>
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
          disabled={!selectedUser}
          onClick={handleAddFriend}
          sx={{ bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
        >
          Agregar
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Amigos:</Typography>
        {friends.length === 0 && (
          <Typography color="text.secondary">Todavía no has agregado amigos.</Typography>
        )}
        {friends.map((friend) => (
          <Box
            key={friend.id}
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1, py: 1, borderBottom: '1px solid #eee' }}
          >
            <Typography sx={{ flexGrow: 1, wordBreak: 'break-word' }}>{friend.name} ({friend.email})</Typography>
            <Button
              variant="contained"
              onClick={() => handleDeleteFriend(friend.id)}
              sx={{ bgcolor: '#FF0000', '&:hover': { bgcolor: '#FF3333' } }}
            >
              Eliminar
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FriendsPage;
