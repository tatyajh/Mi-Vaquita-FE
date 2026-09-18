import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import GroupModal from '../components/group/GroupModal';
import GroupCard from '../components/group/GroupCard';
import GroupService from '../services/GroupService';
import GroupDetailPage from '../components/group/GroupDetailPage';
import { getCurrentUser } from '../services/AuthService';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
import WaveDivider from '../components/common/WaveDivider';

const GroupsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await GroupService.getGroups(currentUser.id);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
      }
    };

    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

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
      {viewingGroup ? (
        <GroupDetailPage group={viewingGroup} onBack={handleBackToGroups} onEdit={handleOpenModalForEdit} onDelete={handleDeleteGroup} />
      ) : (
        <>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ED1651 0%, #FAA918 100%)',
              pb: 0,
            }}
          >
            <PageHeader
              title="Grupos"
              subtitle="Tus paseos y planes compartidos con amigos."
              actionLabel={groups.length === 0 ? 'Crear tu primer parche' : 'Nuevo Grupo'}
              onAction={handleOpenModalForCreate}
              titleColor="#ffffff"
              subtitleColor="rgba(255,255,255,0.85)"
            />
          </Box>
          <WaveDivider color="#FAA918" sx={{ mb: 2 }} />
          {groups.length === 0 ? (
            <EmptyState
              title="Todavía no tienes grupos"
              description={'1. Crea un grupo\n2. Agrega amigos\n3. Anota los gastos\n4. Mira quién le debe a quién'}
              actionLabel="Crear tu primer parche"
              onAction={handleOpenModalForCreate}
            />
          ) : (
            <Grid container spacing={2} sx={{ px: { xs: 2, sm: 3 }, m: 0, width: '100%' }}>
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
          )}
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
