import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Box, Button, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GroupSVG from '../../assets/layer-MC1.svg';
import GroupService from '../../services/GroupService';
import ExpensesService from '../../services/ExpensesService';
import { getCurrentUser } from '../../services/AuthService';
import { formatCurrency } from '../../utils/currency';
import { hasUnseenExpenses } from '../../utils/lastViewed';
import { resolveAccentColor } from '../../utils/color';
import { MILK_BAG_RADIUS } from '../../utils/shape';

const GroupCard = ({ group, onView, onDelete }) => {
  const theme = useTheme();
  const currentUser = getCurrentUser();
  const [participantCount, setParticipantCount] = useState(null);
  const [myBalance, setMyBalance] = useState(null);
  const [hasNews, setHasNews] = useState(false);

  // Grupos con color blanco/casi blanco (por ejemplo los creados antes de
  // tener selector de color) recaían en un botón blanco-sobre-blanco
  // ilegible; con color casi blanco se usa un acento de marca en su lugar.
  const accentColor = resolveAccentColor(theme.palette.flavors, group.id, group.color);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const [participants, balances, expenses] = await Promise.all([
          GroupService.getGroupParticipants(group.id),
          ExpensesService.getGroupBalances(group.id),
          ExpensesService.getExpensesByGroup(group.id),
        ]);
        if (!isMounted) return;
        setParticipantCount(participants.length);
        setMyBalance(balances.balances.find((b) => b.userId === currentUser?.id)?.balance ?? 0);
        setHasNews(hasUnseenExpenses(group.id, expenses));
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
    <Card
      sx={{
        maxWidth: '100%',
        borderRadius: MILK_BAG_RADIUS,
        overflow: 'hidden',
        boxShadow: `0 10px 24px ${accentColor}55`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          p: 2,
          background: `linear-gradient(160deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
          color: '#ffffff',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: '50%',
            mr: 2,
            bgcolor: 'rgba(255,255,255,0.9)',
          }}
        >
          <img src={GroupSVG} alt="Group logo" width={60} height={60} style={{ display: 'block' }} />
        </Box>
        <Typography
          component="div"
          title={group.name}
          sx={{
            fontWeight: 800,
            minWidth: 0,
            flex: '1 1 auto',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
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
      <CardContent sx={{ p: 2.5, bgcolor: `${accentColor}14` }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {myBalance === null
            ? 'Cargando saldo…'
            : myBalance >= 0
              ? `Te deben ${formatCurrency(myBalance)}`
              : `Debes ${formatCurrency(Math.abs(myBalance))}`}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
          Participantes: {participantCount ?? '—'} amigos
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0, bgcolor: `${accentColor}14` }}>
        <Badge color="error" variant="dot" invisible={!hasNews} sx={{ '& .MuiBadge-badge': { top: 6, right: 6 } }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleView}
            sx={{ bgcolor: accentColor, '&:hover': { bgcolor: accentColor } }}
          >
            Ver
          </Button>
        </Badge>
        <Button size="small" variant="soft" onClick={handleDelete}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default GroupCard;
