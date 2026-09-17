import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, CardActions, Chip, Divider } from '@mui/material';
import GroupService from '../../services/GroupService';
import FriendsService from '../../services/FriendsService';
import ExpensesService from '../../services/ExpensesService';
import { getCurrentUser } from '../../services/AuthService';
import GroupSVG from '../../assets/layer-MC1.svg';
import styles from '../../styles/GroupCard.module.css';
import StyledButton from '../../styles/GlobalStyles';
import AddFriendsModal from '../friends/AddFriendModal';
import AddExpenseModal from './AddExpenseModal';
import { formatCurrency as currency } from '../../utils/currency';

const GroupDetailPage = ({ group, onBack, onEdit, onDelete }) => {
  const currentUser = getCurrentUser();
  const [isAddFriendsModalOpen, setAddFriendsModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [participants, setParticipants] = useState(group.participants || []);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const loadExpensesAndBalances = useCallback(async () => {
    setLoadingExpenses(true);
    try {
      const [expensesData, balancesData] = await Promise.all([
        ExpensesService.getExpensesByGroup(group.id),
        ExpensesService.getGroupBalances(group.id),
      ]);
      setExpenses(expensesData);
      setBalances(balancesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  }, [group.id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await FriendsService.getFriends();
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
    loadExpensesAndBalances();
  }, [loadExpensesAndBalances]);

  const handleAddFriends = async (selectedFriends) => {
    try {
      const validSelectedFriends = selectedFriends.filter(friendUserId => friendUserId !== null);
      await GroupService.addGroupParticipants(group.id, validSelectedFriends);
      const updatedParticipants = await GroupService.getGroupParticipants(group.id);
      setParticipants(updatedParticipants);
      setAddFriendsModalOpen(false);
    } catch (error) {
      console.error('Error adding friends to the group:', error);
    }
  };

  const handleAddExpense = async ({ description, amount, paidByUserId }) => {
    try {
      await ExpensesService.createExpense({ groupId: group.id, paidByUserId, description, amount });
      await loadExpensesAndBalances();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await ExpensesService.deleteExpense(expenseId);
      await loadExpensesAndBalances();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Seguro que quieres eliminar este grupo?')) {
      try {
        await GroupService.deleteGroup(groupId);
        onDelete(groupId);
        onBack();
      } catch (error) {
        console.error('Failed to delete the group:', error);
        alert('No se pudo eliminar el grupo');
      }
    }
  };

  const handleViewFriends = async () => {
    try {
      const participantsData = await GroupService.getGroupParticipants(group.id);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Failed to get participants:', error);
    }
  };

  const members = balances?.balances ?? [];
  const myBalance = members.find((m) => m.userId === currentUser?.id);

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', m: 2, gap: 1 }}>
        <Button
          sx={{
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: 'white',
            bgcolor: '#36190D',
            '&:hover': { bgcolor: '#59382e' },
          }}
          onClick={onBack}
        >
          Volver
        </Button>
        <Button
          sx={{
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: 'white',
            bgcolor: '#36190D',
            '&:hover': { bgcolor: '#59382e' },
          }}
          onClick={() => onEdit(group)}
        >
          Editar Grupo
        </Button>
        <Button
          sx={{
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: 'white',
            bgcolor: '#36190D',
            '&:hover': { bgcolor: '#59382e' },
          }}
          onClick={() => setAddFriendsModalOpen(true)}
        >
          Nuevo Amigo
        </Button>
      </Box>
      <Box sx={{ px: 2 }}>
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
              {myBalance
                ? myBalance.balance >= 0
                  ? `Te deben ${currency(myBalance.balance)}`
                  : `Debes ${currency(Math.abs(myBalance.balance))}`
                : 'Debes: $0'}
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mx: 2, mt: 4, gap: 1 }}>
        <Typography variant="h5" sx={{ color: '#36190D', fontWeight: 'bold' }}>
          Gastos
        </Typography>
        <Button
          sx={{
            fontWeight: 'bold',
            color: 'white',
            bgcolor: '#36190D',
            '&:hover': { bgcolor: '#59382e' },
          }}
          onClick={() => setAddExpenseModalOpen(true)}
        >
          Agregar Gasto
        </Button>
      </Box>

      {!loadingExpenses && expenses.length === 0 && (
        <Typography sx={{ mx: 2, mt: 2, color: 'text.secondary' }}>
          Todavía no hay gastos registrados en este grupo.
        </Typography>
      )}

      <Grid container spacing={2} sx={{ m: 0, mt: 1, px: 2, width: '100%' }}>
        {expenses.map((expense) => (
          <Grid item xs={12} sm={6} lg={4} key={expense.id}>
            <Box sx={{ border: '1px solid #36190D', borderRadius: 2, p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{expense.description}</Typography>
              <Typography>Pagado por: {expense.paid_by_name}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{currency(expense.amount)}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  size="small"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    bgcolor: '#FF0000',
                    '&:hover': { bgcolor: '#FF3333' },
                  }}
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {balances && balances.balances.length > 0 && (
        <Box sx={{ mx: 2, mt: 4, mb: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#36190D', fontWeight: 'bold', mb: 2 }}>
            Cuentas
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {balances.balances.map((b) => (
              <Chip
                key={b.userId}
                label={`${b.name}: ${b.balance >= 0 ? '+' : ''}${currency(b.balance)}`}
                sx={{
                  bgcolor: b.balance >= 0 ? '#e6f4ea' : '#fdecea',
                  color: b.balance >= 0 ? '#1e7e34' : '#b02a37',
                  fontWeight: 'bold',
                }}
              />
            ))}
          </Box>
          {balances.settlements.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {balances.settlements.map((s, i) => (
                <Typography key={i}>
                  <strong>{s.from.name}</strong> le debe pagar <strong>{currency(s.amount)}</strong> a <strong>{s.to.name}</strong>
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">Todos están a paz y salvo.</Typography>
          )}
        </Box>
      )}

      <AddFriendsModal
        open={isAddFriendsModalOpen}
        onClose={() => setAddFriendsModalOpen(false)}
        friends={friends}
        onAddFriends={handleAddFriends}
      />
      <AddExpenseModal
        open={isAddExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
        members={balances?.balances ?? []}
        currentUserId={currentUser?.id}
      />
    </>
  );
};

export default GroupDetailPage;
