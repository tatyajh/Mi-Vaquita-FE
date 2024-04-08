import GroupModal from '../components/group/GroupModal';
import GroupCard from '../components/group/GroupCard';
import GroupService from '../services/GroupService';
import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';

const GroupsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);

  const handleOpenModalForCreate = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (group) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGroup(null);
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await GroupService.createGroup(groupData);
      setGroups(prevGroups => [...prevGroups, newGroup]);
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };


  const handleUpdateGroup = async (groupData) => {
    try {
      console.log('Actualizando grupo con datos:', groupData);
      const updatedGroup = await GroupService.updateGroup(groupData.id, groupData);
      setGroups(prevGroups =>
        prevGroups.map(g => (g.id === updatedGroup.id ? updatedGroup : g))
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
    }
  };


  const handleDeleteGroup = async (groupId) => {
    try {
      await GroupService.deleteGroup(groupId);
      setGroups(currentGroups => currentGroups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }}>
        <Button
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            color: 'white',
            bgcolor: '#36190D',
            '&:hover': {
              bgcolor: '#59382e'
            }
          }}
          onClick={handleOpenModalForCreate}
        >
          Nuevo Grupo
        </Button>
      </Box>
      <GroupModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={editingGroup ? handleUpdateGroup : handleCreateGroup}
        group={editingGroup}
      />
      <Grid container spacing={2} sx={{ m: 2 }}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
            <GroupCard
              group={group}
              onEdit={handleOpenModalForEdit}
              onDelete={handleDeleteGroup}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GroupsPage;


