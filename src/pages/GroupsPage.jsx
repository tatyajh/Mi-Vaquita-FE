import React, { useState } from 'react';
import Button from '@mui/material/Button';
import GroupModal from '../components/group/GroupModal';
import GroupCard from '../components/group/GroupCard';

const GroupsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateGroup = (group) => {
    console.log('Creando grupo:', group);
    setGroups(prevGroups => [...prevGroups, group]);
    handleCloseModal();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Nuevo Grupo
      </Button>
      <GroupModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateGroup}
      />
      {groups.map(group => (
        <GroupCard key={group.id} name={group.name} color={group.color} />
      ))}
    </div>
  );
};

export default GroupsPage;
