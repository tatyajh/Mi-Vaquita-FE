import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupService from '../../services/GroupService';
import { TRIP_TYPES } from '../../data/savingsTips';
import ColorSwatchPicker, { GROUP_COLORS } from './ColorSwatchPicker';

const GroupModal = ({ open, onClose, group, onSave }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState(GROUP_COLORS[0]);
    const [tripType, setTripType] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setGroupColor(group.color || GROUP_COLORS[0]);
            setTripType(group.trip_type || '');
        } else {
            setGroupName('');
            setGroupColor(GROUP_COLORS[0]);
            setTripType('');
        }
        setError('');
    }, [group]);

    const handleSave = async () => {
        const trimmedName = groupName.trim();
        const groupData = {
            name: trimmedName,
            color: groupColor,
            tripType: tripType || null,
        };

        try {
            let response;
            if (group?.id) {
                response = await GroupService.updateGroup(group.id, groupData);
            } else {
                response = await GroupService.createGroup(groupData);
            }
            onSave(response);
        } catch (error) {
            setError(error.response?.data?.message || 'Ocurrió un error al guardar el grupo.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '92%', sm: '80%', md: 440 },
                    maxWidth: '95vw',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                }}
            >
                <IconButton
                    onClick={onClose}
                    aria-label="Cerrar"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', mb: 2 }}
                >
                    {group ? "Editar Grupo" : "Nuevo Grupo"}
                </Typography>
                <TextField
                    label="Nombre del Grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!!error}
                    helperText={error}
                />
                <TextField
                    select
                    label="Tipo de paseo"
                    helperText="Para darte consejos de ahorro relacionados"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="">Sin especificar</MenuItem>
                    {TRIP_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>{t.emoji} {t.label}</MenuItem>
                    ))}
                </TextField>
                <ColorSwatchPicker value={groupColor} onChange={setGroupColor} />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSave}
                    sx={{ mt: 3 }}
                >
                    {group ? "Guardar" : "Crear"}
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
