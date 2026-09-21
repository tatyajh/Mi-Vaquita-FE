import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupService from '../../services/GroupService';
import FriendsService from '../../services/FriendsService';
import ExpensesService from '../../services/ExpensesService';
import { getCurrentUser } from '../../services/AuthService';
import GroupSVG from '../../assets/layer-MC1.svg';
import AddFriendsModal from '../friends/AddFriendModal';
import AddExpenseModal from './AddExpenseModal';
import ExpenseCard from './ExpenseCard';
import EmptyState from '../common/EmptyState';
import { formatCurrency as currency } from '../../utils/currency';
import { getTipsForTripType } from '../../data/savingsTips';
import { MILK_BAG_RADIUS } from '../../utils/shape';
import { markGroupViewed } from '../../utils/lastViewed';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link } from 'react-router-dom';

const initials = (name = '', email = '') => (name || email || '?').trim().charAt(0).toUpperCase();

const GroupDetailPage = ({ group, onBack, onEdit, onDelete }) => {
  const currentUser = getCurrentUser();
  const [isAddFriendsModalOpen, setAddFriendsModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [participants, setParticipants] = useState(group.participants || []);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
    // Marca el grupo como "visto" al entrar al detalle, para que el
    // indicador de gastos nuevos en la lista de grupos desaparezca.
    markGroupViewed(group.id);
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

    const fetchParticipants = async () => {
      try {
        const participantsData = await GroupService.getGroupParticipants(group.id);
        setParticipants(participantsData);
      } catch (error) {
        console.error('Failed to get participants:', error);
      }
    };

    fetchFriends();
    fetchParticipants();
    loadExpensesAndBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      alert(error.response?.data?.message || 'No se pudieron agregar los amigos al grupo.');
    }
  };

  const handleAddExpense = async ({ description, amount, paidByUserId, receiptFile, category, paymentMethod }) => {
    try {
      // El upload del recibo es best-effort: si falla o el backend no
      // lo tiene configurado (uploadReceipt ya devuelve null en ese
      // caso), el gasto se crea igual sin receiptUrl.
      let receiptUrl = null;
      if (receiptFile) {
        receiptUrl = await ExpensesService.uploadReceipt(receiptFile);
      }
      await ExpensesService.createExpense({ groupId: group.id, paidByUserId, description, amount, receiptUrl, category, paymentMethod });
      await loadExpensesAndBalances();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert(error.response?.data?.message || 'No se pudo registrar el gasto. Intenta de nuevo.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await ExpensesService.deleteExpense(expenseId);
      await loadExpensesAndBalances();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert(error.response?.data?.message || 'No se pudo eliminar el gasto. Intenta de nuevo.');
    }
  };

  const handleExport = async () => {
    try {
      const csvBlob = await ExpensesService.exportGroupExpenses(group.id);
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `grupo-${group.id}-gastos.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 403) {
        if (window.confirm('Exportar a Excel es una función Pro. ¿Quieres ver los planes?')) {
          window.location.href = '/precios';
        }
        return;
      }
      console.error('Error exporting group expenses:', error);
      alert('No se pudo exportar el grupo. Intenta de nuevo.');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    setMenuAnchor(null);
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

  const members = balances?.balances ?? [];
  const settlements = balances?.settlements ?? [];
  const tips = getTipsForTripType(group.trip_type).slice(0, 3);

  const handleShare = () => {
    const lines = [`🐮 *${group.name}* — resumen de gastos`, ''];
    if (expenses.length === 0) {
      lines.push('Todavía no hay gastos registrados.');
    } else {
      expenses.forEach((e) => {
        lines.push(`• ${e.description}: ${currency(e.amount)} (pagó ${e.paid_by_name})`);
      });
      lines.push('');
      lines.push('*¿Quién le debe a quién?*');
      if (settlements.length === 0) {
        lines.push('Todos están a paz y salvo 🎉');
      } else {
        settlements.forEach((s) => {
          lines.push(`• ${s.from.name} le paga ${currency(s.amount)} a ${s.to.name}`);
        });
      }
    }
    const text = lines.join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIosNewIcon fontSize="small" />}
          size="small"
          sx={{ color: 'text.secondary', fontWeight: 600, pl: 0 }}
        >
          Volver
        </Button>
        <Button component={Link} to={`/groups/${group.id}/activities`} sx={{ ml: 2 }} variant="contained">Amigo secreto y rifas</Button>
      </Box>

      {/* Group header, washed in the group's own color */}
      <Box
        sx={{
          mx: { xs: 2, sm: 3 },
          mt: 1,
          p: { xs: 2, sm: 3 },
          borderRadius: MILK_BAG_RADIUS,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          background: `linear-gradient(135deg, ${group.color || '#FAA918'}33 0%, ${group.color || '#FAA918'}0d 100%)`,
          border: '1px solid',
          borderColor: `${group.color || '#FAA918'}55`,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: 3,
            bgcolor: group.color || 'secondary.light',
            boxShadow: `0 6px 14px ${group.color || '#FAA918'}66`,
          }}
        >
          <img src={GroupSVG} alt="" width={48} height={48} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800, wordBreak: 'break-word' }}>
            {group.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.85rem', bgcolor: 'primary.main' } }}>
              {participants.map((p) => (
                <Tooltip key={p.userId || p.id} title={p.name || p.email || ''}>
                  <Avatar>{initials(p.name, p.email)}</Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            <Typography variant="body2" color="text.secondary">
              {participants.length} {participants.length === 1 ? 'participante' : 'participantes'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Más opciones">
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => { setMenuAnchor(null); onEdit(group); }}>Editar Grupo</MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); setAddFriendsModalOpen(true); }}>Agregar amigos al grupo</MenuItem>
          <MenuItem onClick={() => handleDeleteGroup(group.id)} sx={{ color: 'error.dark' }}>Eliminar Grupo</MenuItem>
        </Menu>
      </Box>


      {/* Balances / settle-up section, promoted directly under the header */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mt: 3 }}>
        <Box
          sx={{
            bgcolor: 'secondary.light',
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Cuentas
            </Typography>
            <Button size="small" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Exportar a Excel
            </Button>
          </Box>

          {settlements.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {settlements.map((s, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    px: 2,
                    py: 1.25,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>{s.from.name}</Typography>
                  <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    le paga <ArrowForwardIcon fontSize="small" />
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{s.to.name}</Typography>
                  <Typography variant="h5" sx={{ ml: 'auto', fontWeight: 900, color: 'primary.main' }}>
                    {currency(s.amount)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyState title="Todos están a paz y salvo 🐄" description="No hay pagos pendientes en este grupo." />
          )}

          {members.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {members.map((b) => (
                <Chip
                  key={b.userId}
                  size="small"
                  label={`${b.name}: ${b.balance >= 0 ? '+' : ''}${currency(b.balance)}`}
                  sx={{
                    bgcolor: b.balance >= 0 ? 'success.light' : 'error.light',
                    color: b.balance >= 0 ? 'success.dark' : 'error.dark',
                    fontWeight: 700,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Primary action */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-start' } }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddCircleIcon />}
          onClick={() => setAddExpenseModalOpen(true)}
          sx={{ px: 4, py: 1.25, fontSize: '1rem', width: { xs: '100%', sm: 'auto' } }}
        >
          Agregar gasto
        </Button>
        <Button
          variant="green"
          size="large"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          sx={{ px: 3, width: { xs: '100%', sm: 'auto' } }}
        >
          Compartir por WhatsApp
        </Button>
      </Box>

      {/* Consejos de ahorro contextuales */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mt: 3 }}>
        <Box sx={{ bgcolor: `${group.color || '#9FCB3B'}1a`, borderRadius: 4, p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            💡 Consejos para ahorrar
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {tips.map((tip, i) => (
              <Typography key={i} component="li" variant="body2" color="text.secondary">
                {tip}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Expense list */}
      <Box sx={{ px: { xs: 2, sm: 3 }, mt: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 1.5 }}>
          Gastos
        </Typography>

        {!loadingExpenses && expenses.length === 0 && (
          <EmptyState
            title="Todavía no hay gastos"
            description="Registra el primer gasto del grupo con el botón 'Agregar gasto'."
          />
        )}

        <Grid container spacing={2}>
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={expense.id}>
              <ExpenseCard expense={expense} onDelete={handleDeleteExpense} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <AddFriendsModal
        open={isAddFriendsModalOpen}
        onClose={() => setAddFriendsModalOpen(false)}
        friends={friends}
        onAddFriends={handleAddFriends}
        currentMemberCount={participants.length}
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
