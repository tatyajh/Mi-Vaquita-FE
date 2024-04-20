import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { SketchPicker } from 'react-color';
import GroupService from '../../services/GroupService';

const GroupModal = ({ open, onClose, group, onSave }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setGroupColor(group.color);
        } else {
            setGroupName('');
            setGroupColor('');
        }
        setError('');
    }, [group]);

    const handleSave = async () => {
        const trimmedName = groupName.trim();
        if (!trimmedName) {
            setError('Elije un nombre para continuar.');
            return;
        }
        if (trimmedName.length > 30) {
            setError('El nombre del grupo no puede tener más de 30 caracteres.');
            return;
        }

        const groupData = {
            ...group,
            name: trimmedName,
            color: groupColor.hex || groupColor,
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
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Ocurrió un error al guardar el grupo.');
            }
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
                    width: { xs: '90%', sm: '80%', md: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <SketchPicker
                        color={groupColor}
                        onChangeComplete={(color) => setGroupColor(color)}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ mt: 2, width: '100%', bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
                >
                    {group ? "Guardar" : "Crear"}
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
