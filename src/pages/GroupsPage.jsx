import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import GroupModal from '../components/group/GroupModal';
import GroupCard from '../components/group/GroupCard';
import GroupService from '../services/GroupService';

const GroupsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    console.log('Fetching groups...');
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await GroupService.getGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
      }
    };
  
    fetchGroups();
  }, []);

  const handleOpenModalForCreate = () => {
    setSelectedGroup(null);
    setModalOpen(true);
  };

  const handleOpenModalForEdit = (group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Typography variant="h3" sx={{ color: '#36190D', fontWeight: 'bold', textTransform: 'uppercase', ml: 2 }}>Grupos</Typography>
      <Typography variant="h5" sx={{ ml: 2 }}>
        Debes: <span style={{ color: 'red' }}>{totalDue}</span> pesos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }}>
        <Button
          sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'white', bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
          onClick={handleOpenModalForCreate}
        >
          Nuevo Grupo
        </Button>
      </Box>
      {isModalOpen && (
        <GroupModal
          open={isModalOpen}
          onClose={handleCloseModal}
          group={selectedGroup}
          onSave={(savedGroup) => {
            setModalOpen(false);
            if (selectedGroup) {
              setGroups(prev => prev.map(g => g.id === savedGroup.id ? savedGroup : g));
            } else {
              setGroups(prev => [...prev, savedGroup]);
            }
          }}
        />
      )}
      <Grid container spacing={2} sx={{ m: 2 }}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
            <GroupCard
              group={group}
              onEdit={handleOpenModalForEdit}
              onDelete={(id) => setGroups(prev => prev.filter(g => g.id !== id))}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GroupsPage;
