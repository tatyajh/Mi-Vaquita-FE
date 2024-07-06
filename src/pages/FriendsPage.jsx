import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Select, MenuItem } from '@mui/material';
import FriendsService from '../services/FriendsService';
import UsersService from '../services/UsersService';

const FriendsPage = () => {
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
      const userId = 1; // ID temporal del usuario autenticado
      await FriendsService.addFriend({ userId, friendUserId: selectedUser });
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Lista de amigos</Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          displayEmpty
          sx={{ mr: 2, minWidth: 200 }}
        >
          <MenuItem value="" disabled>Seleccionar Usuario</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.email} ({user.name})
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleAddFriend}>Agregar</Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Amigos:</Typography>
        {friends.map((friend) => (
          <Box key={friend.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ flexGrow: 1 }}>{friend.name} ({friend.email})</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteFriend(friend.id)}>Eliminar</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FriendsPage;
