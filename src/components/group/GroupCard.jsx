import React from 'react';
import { Card, CardContent, Typography, CardActions, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupSVG from '../../assets/layer-MC1.svg';
import styles from '../../styles/GroupCard.module.css';
import StyledButton from '../../styles/GlobalStyles';

const GroupCard = ({ group, onEdit, onDelete }) => {
    return (
        <Card className={styles.groupCard} sx={{ maxWidth: '80%', m: 1, boxSizing: 'border-box' }}>
            <Box className={styles.cardHeader} sx={{ bgcolor: group.color, display: 'flex', alignItems: 'center', padding: 1 }}>
                <img src={GroupSVG} alt="Group logo" className={styles.logo} style={{ width: '40px', height: '40px' }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', flexGrow: 1, marginLeft: 1 }}>
                    {group.name}
                </Typography>
            </Box>
            <CardContent>
                <Typography variant="body2">
                    Debes: {group.amountOwed} pesos
                </Typography>
                <Typography variant="body2">
                    Participantes: {group.participants} amig@s
                </Typography>
            </CardContent>
            <CardActions>
                <StyledButton size="small" startIcon={<EditIcon />} onClick={() => onEdit(group)}>
                    Editar
                </StyledButton>
                <StyledButton size="small" startIcon={<DeleteIcon />} onClick={() => onDelete(group.id)}>
                    Eliminar
                </StyledButton>
            </CardActions>
        </Card>
    );
};

export default GroupCard;
