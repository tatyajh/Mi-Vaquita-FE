import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Box } from '@mui/material';
import GroupSVG from '../../assets/layer-MC1.svg';
import styles from '../../styles/GroupCard.module.css';
import StyledButton from '../../styles/GlobalStyles';
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
    <Card className={styles.groupCard}>
      <Box className={styles.cardHeader}>
        <Box className={styles.iconContainer} style={{ backgroundColor: group.color || '#F4F4F4' }}>
          <img src={GroupSVG} alt="Group logo" className={styles.groupIcon} />
        </Box>
        <Typography
          component="div"
          className={styles.title}
          title={group.name}
          sx={{
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
      <CardContent className={styles.cardContent}>
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
      <CardActions className={styles.cardActions}>
        <StyledButton size="small" onClick={handleView}>
          Ver
        </StyledButton>
        <StyledButton size="small" onClick={handleDelete}>
          Eliminar
        </StyledButton>
      </CardActions>
    </Card>
  );
};

export default GroupCard;
