import React from 'react';
import { Card, CardContent, Typography, CardActions, Box } from '@mui/material';
import GroupSVG from '../../assets/layer-MC1.svg';
import styles from '../../styles/GroupCard.module.css';
import StyledButton from '../../styles/GlobalStyles';
import GroupService from '../../services/GroupService';

const GroupCard = ({ group, onEdit, onDelete }) => {
    const handleEdit = () => {
        onEdit(group);
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
                <Typography variant="h3" component="div" className={styles.title}>
                    {group.name}
                </Typography>
            </Box>
            <CardContent className={styles.cardContent}>
                <Typography variant="body2">
                    Debes: {group.amountOwed} pesos
                </Typography>
                <Typography variant="body2">
                    Participantes: {group.participants} amigos
                </Typography>
            </CardContent>
            <CardActions className={styles.cardActions}>
                <StyledButton size="small" onClick={handleEdit}>
                    Editar
                </StyledButton>
                <StyledButton size="small" onClick={handleDelete}>
                    Eliminar
                </StyledButton>
            </CardActions>
        </Card>
    );
};

export default GroupCard;
