import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import GroupService from '../../services/GroupService';
import FriendsService from '../../services/FriendsService';
import GroupSVG from '../../assets/layer-MC1.svg';
import styles from '../../styles/GroupCard.module.css';
import StyledButton from '../../styles/GlobalStyles';
import AddFriendsModal from "../friends/AddFriendModal";

const GroupDetailPage = ({ group, onBack, onEdit, onDelete }) => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Café en Cali",
      participants: 8,
      paidBy: "Juan Guillermo",
      value: 25000,
      owe: 0,
    },
    {
      id: 2,
      name: "Cine - Poor things",
      participants: 4,
      paidBy: "Alicia",
      value: 105000,
      owe: 45000,
    },
    {
      id: 3,
      name: "Almuerzo de clase",
      participants: 5,
      paidBy: "Liliana",
      value: 25000,
      owe: 0,
    },
  ]);
 const [isAddFriendsModalOpen, setAddFriendsModalOpen] = useState(false);
  const [participants, setParticipants] = useState(group.participants || []);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await FriendsService.getFriends();
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriends = async (selectedFriends) => {
    try {
      const validSelectedFriends = selectedFriends.filter(friendUserId => friendUserId !== null);
      await GroupService.addGroupParticipants(group.id, validSelectedFriends);
      const updatedParticipants = await GroupService.getGroupParticipants(group.id);
      setParticipants(updatedParticipants);
      setAddFriendsModalOpen(false);
    } catch (error) {
      console.error("Error adding friends to the group:", error);
    }
  };
  

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await GroupService.deleteGroup(groupId);
        onDelete(groupId);
        onBack();
      } catch (error) {
        console.error("Failed to delete the group:", error);
        alert("Failed to delete the group");
      }
    }
  };

  const handleViewFriends = async () => {
    try {
      const participants = await GroupService.getGroupParticipants(group.id);
      alert(`Participantes: ${participants.map(p => p.email).join(", ")}`);
      setParticipants(participants);
    } catch (error) {
      console.error("Failed to get participants:", error);
    }
  };
  

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2, gap: 2 }}>
        <Button
          sx={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "white",
            bgcolor: "#36190D",
            "&:hover": { bgcolor: "#59382e" },
          }}
          onClick={onBack}
        >
          Volver
        </Button>
        <Button
          sx={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "white",
            bgcolor: "#36190D",
            "&:hover": { bgcolor: "#59382e" },
          }}
          onClick={() => onEdit(group)}
        >
          Editar Grupo
        </Button>
        <Button
          sx={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "white",
            bgcolor: "#36190D",
            "&:hover": { bgcolor: "#59382e" },
          }}
          onClick={() => setAddFriendsModalOpen(true)}
        >
          Nuevo Amigo
        </Button>
      </Box>
      <Box>
        <Card className={styles.groupCard}>
          <Box className={styles.cardHeader}>
            <Box className={styles.iconContainer} style={{ backgroundColor: group.color || '#F4F4F4' }}>
              <img src={GroupSVG} alt="Group logo" className={styles.groupIcon} />
            </Box>
            <Typography variant="h3" component="div" className={styles.title}>
              {group.name}
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography variant="body2">
              Debes: {group.amountOwed} pesos
            </Typography>
            <Typography variant="body2">
              Participantes: {participants.length} amigos
            </Typography>
          </CardContent>
          <CardActions className={styles.cardActions}>
            <StyledButton size="small" onClick={handleViewFriends}>
              Ver Amigos
            </StyledButton>
            <StyledButton size="small" onClick={() => handleDeleteGroup(group.id)}>
              Eliminar Grupo
            </StyledButton>
          </CardActions>
        </Card>
      </Box>
      <Typography
        variant="h5"
        sx={{ ml: 2, mt: 4, color: "#36190D", fontWeight: "bold" }}
      >
        Gastos
      </Typography>
      <Grid container spacing={2} sx={{ m: 2 }}>
        {expenses.map((expense) => (
          <Grid item xs={12} key={expense.id}>
            <Box sx={{ border: "1px solid #36190D", borderRadius: 2, p: 2 }}>
              <Typography variant="h6">{expense.name}</Typography>
              <Typography>Participantes: {expense.participants}</Typography>
              <Typography>Pagado por: {expense.paidBy}</Typography>
              <Typography>Monto: {expense.value}</Typography>
              <Typography>
                {expense.owe > 0 ? `Debes: ${expense.owe}` : "No participaste"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "white",
                    bgcolor: "#36190D",
                    "&:hover": { bgcolor: "#59382e" },
                  }}
                  onClick={() => console.log("Editar Gasto")}
                >
                  Editar
                </Button>
                <Button
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "white",
                    bgcolor: "#FF0000",
                    "&:hover": { bgcolor: "#FF3333" },
                  }}
                  onClick={() => console.log("Eliminar Gasto")}
                >
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <AddFriendsModal
        open={isAddFriendsModalOpen}
        onClose={() => setAddFriendsModalOpen(false)}
        friends={friends}
        onAddFriends={handleAddFriends}
      />
    </>
  );
};

export default GroupDetailPage;