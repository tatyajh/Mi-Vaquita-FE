import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Box, Button } from '@mui/material';
import GroupSVG from '../../assets/layer-MC1.svg';
import GroupService from '../../services/GroupService';
import ExpensesService from '../../services/ExpensesService';
import { getCurrentUser } from '../../services/AuthService';
import { formatCurrency } from '../../utils/currency';

const GroupCard = ({ group, onView, onDelete }) => {
  const currentUser = getCurrentUser();
  const [participantCount, setParticipantCount] = useState(null);
  const [myBalance, setMyBalance] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const [participants, balances] = await Promise.all([
          GroupService.getGroupParticipants(group.id),
          ExpensesService.getGroupBalances(group.id),
        ]);
        if (!isMounted) return;
        setParticipantCount(participants.length);
        setMyBalance(balances.balances.find((b) => b.userId === currentUser?.id)?.balance ?? 0);
      } catch (error) {
        console.error('Error al cargar el resumen del grupo:', error);
        // Evita que la tarjeta se quede en "Cargando..." para siempre
        // si la petición falla (red, backend caído, etc).
        if (isMounted) {
          setParticipantCount(0);
          setMyBalance(0);
        }
      }
    };

    loadSummary();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id]);

  const handleView = () => {
    onView(group);
  };

  const handleDelete = async () => {
    try {
      await GroupService.deleteGroup(group.id);
      onDelete(group.id);
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          p: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: 3,
            mr: 2,
            bgcolor: group.color || 'secondary.light',
          }}
        >
          <img src={GroupSVG} alt="Group logo" width={60} height={60} style={{ display: 'block' }} />
        </Box>
        <Typography
          component="div"
          title={group.name}
          sx={{
            fontWeight: 'bold',
            minWidth: 0,
            flex: '1 1 auto',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            lineHeight: 1.25,
          }}
        >
          {group.name}
        </Typography>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2">
          {myBalance === null
            ? 'Cargando saldo…'
            : myBalance >= 0
              ? `Te deben ${formatCurrency(myBalance)}`
              : `Debes ${formatCurrency(Math.abs(myBalance))}`}
        </Typography>
        <Typography variant="body2">
          Participantes: {participantCount ?? '—'} amigos
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
        <Button size="small" variant="soft" onClick={handleView}>
          Ver
        </Button>
        <Button size="small" variant="soft" onClick={handleDelete}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default GroupCard;
