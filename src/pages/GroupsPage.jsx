import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import GroupModal from '../components/group/GroupModal';
import GroupCard from '../components/group/GroupCard';
import GroupService from '../services/GroupService';
import GroupDetailPage from './GroupDetailPage';

const GroupsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);

  useEffect(() => {
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

  const handleViewGroup = (group) => {
    setViewingGroup(group);
  };

  const handleBackToGroups = () => {
    setViewingGroup(null);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const handleSaveGroup = (savedGroup) => {
    setModalOpen(false);
    if (selectedGroup) {
      setGroups(prev => prev.map(g => g.id === savedGroup.id ? savedGroup : g));
    } else {
      setGroups(prev => [...prev, savedGroup]);
    }
    if (viewingGroup) {
      setViewingGroup(savedGroup);
    }
  };

  return (
    <>
      <Typography variant="h3" sx={{ color: '#36190D', fontWeight: 'bold', textTransform: 'uppercase', ml: 2 }}>Grupos</Typography>
      {viewingGroup ? (
        <GroupDetailPage group={viewingGroup} onBack={handleBackToGroups} onEdit={handleOpenModalForEdit} onDelete={handleDeleteGroup} />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }}>
            <Button
              sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'white', bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
              onClick={handleOpenModalForCreate}
            >
              Nuevo Grupo
            </Button>
          </Box>
          <Grid container spacing={2} sx={{ m: 2 }}>
            {groups.map(group => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
                <GroupCard
                  group={group}
                  onView={handleViewGroup}
                  onDelete={(id) => setGroups(prev => prev.filter(g => g.id !== id))}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {isModalOpen && (
        <GroupModal
          open={isModalOpen}
          onClose={handleCloseModal}
          group={selectedGroup}
          onSave={handleSaveGroup}
        />
      )}
    </>
  );
};

export default GroupsPage;
