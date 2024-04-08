import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';

const GroupModal = ({ open, onClose, onSave, group }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setGroupColor(group.color);
        } else {
            setGroupName('');
            setGroupColor('');
        }
        setError(false);
    }, [group]);

    const handleSave = async () => {
        if (!groupName.trim()) {
            setError(true);
            return;
        }

        const groupData = {
            ...group,
            name: groupName,
            color: groupColor.hex || groupColor,
        };

        onSave(groupData);
    };

    const handleChange = (event) => {
        setGroupName(event.target.value);
        if (error) {
            setError(false);
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    {group ? "Editar Grupo" : "Nuevo Grupo"}
                </Typography>
                <TextField
                    label="Nombre del Grupo"
                    value={groupName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={error}
                    helperText={error && "Este campo es obligatorio."}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <SketchPicker
                        color={groupColor}
                        onChangeComplete={(color) => setGroupColor(color)}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        mt: 2,
                        width: '100%',
                        bgcolor: '#36190D',
                        '&:hover': {
                            bgcolor: '#59382e',
                        },
                    }}
                >
                    {group ? "Guardar" : "Crear"}
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
