import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupSVG from '../../assets/Logo.svg'; 
import styles from './GroupCard.module.css'; 

const GroupCard = ({ groupName, amountOwed, participants, color }) => {
    return (
        <Card className={styles.groupCard} style={{ background: color }}>
            <Box className={styles.cardHeader}>
                <img src={GroupSVG} alt="Group logo" style={{ width: '40px', height: '40px' }} />
                <Typography variant="h5" component="div">
                    {groupName}
                </Typography>
            </Box>
            <CardContent className={styles.cardContent}>
                <Typography variant="body2">
                    Debes: {amountOwed} pesos
                </Typography>
                <Typography variant="body2">
                    Participantes: {participants} amig@s
                </Typography>
            </CardContent>
            <CardActions className={styles.cardActions}>
                <Button size="small" startIcon={<EditIcon />}>
                    Editar
                </Button>
                <Button size="small" startIcon={<DeleteIcon />}>
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
};

export default GroupCard;
