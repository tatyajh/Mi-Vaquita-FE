import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, MenuItem } from '@mui/material';
import { SketchPicker } from 'react-color';
import GroupService from '../../services/GroupService';
import { TRIP_TYPES } from '../../data/savingsTips';

const GroupModal = ({ open, onClose, group, onSave }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('#ED1651'); // default to brand magenta
    const [tripType, setTripType] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setGroupColor(group.color || '#FFFFFF');
            setTripType(group.trip_type || '');
        } else {
            setGroupName('');
            setGroupColor('#ED1651');
            setTripType('');
        }
        setError('');
    }, [group]);

    const handleSave = async () => {
        const trimmedName = groupName.trim();
        const groupData = {
            name: trimmedName,
            color: groupColor.hex || groupColor,
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
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
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
                    label="Tipo de paseo (para consejos de ahorro)"
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <SketchPicker
                        color={groupColor}
                        onChangeComplete={(color) => setGroupColor(color)}
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSave}
                    sx={{ mt: 2 }}
                >
                    {group ? "Guardar" : "Crear"}
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
