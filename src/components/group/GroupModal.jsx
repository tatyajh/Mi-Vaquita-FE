import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';
import GroupService from '../../services/GroupService';

const GroupModal = ({ open, onClose, onCreate }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('');

    const handleCreateGroup = async () => {
        try {
            const groupData = {
                name: groupName,
                color: groupColor.hex || groupColor
            };
            const createdGroup = await GroupService.createGroup(groupData);
            console.log('Grupo creado:', createdGroup);
            onClose();
            onCreate(createdGroup);
        } catch (error) {
            console.error('Error al crear el grupo:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                <Typography variant="h6" component="h2">
                    Crear Nuevo Grupo
                </Typography>
                <TextField
                    label="Nombre del Grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <SketchPicker
                    color={groupColor}
                    onChangeComplete={(color) => setGroupColor(color)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateGroup}
                    sx={{ mt: 2 }}
                >
                    Crear
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
