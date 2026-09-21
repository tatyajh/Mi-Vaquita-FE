import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupService from '../../services/GroupService';
import { TRIP_TYPES } from '../../data/savingsTips';
import ColorSwatchPicker, { GROUP_COLORS } from './ColorSwatchPicker';
import { MILK_BAG_RADIUS } from '../../utils/shape';

const GroupModal = ({ open, onClose, group, onSave }) => {
    const [groupName, setGroupName] = useState('');
    const [groupColor, setGroupColor] = useState(GROUP_COLORS[0]);
    const [tripType, setTripType] = useState('');
    const [photoData, setPhotoData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setGroupColor(group.color || GROUP_COLORS[0]);
            setTripType(group.trip_type || '');
            setPhotoData(group.photo_data || null);
        } else {
            setGroupName('');
            setGroupColor(GROUP_COLORS[0]);
            setTripType('');
            setPhotoData(null);
        }
        setError('');
    }, [group]);

    const handleSave = async () => {
        const trimmedName = groupName.trim();
        const groupData = {
            name: trimmedName,
            color: groupColor,
            tripType: tripType || null,
            photoData,
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
                    borderRadius: MILK_BAG_RADIUS,
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
                <Box sx={{ mt: 2 }}>
                    <Typography fontWeight={700} sx={{ mb: 1 }}>Foto de la salida (opcional)</Typography>
                    <Button component="label" variant="outlined" fullWidth>
                        {photoData ? 'Cambiar foto' : 'Elegir foto'}
                        <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                            const file=event.target.files?.[0];if(!file)return;
                            if(file.size>8*1024*1024){setError('La foto no puede pesar más de 8 MB.');return;}
                            const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const size=Math.min(720,Math.max(image.width,image.height));const scale=size/Math.max(image.width,image.height);const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);setPhotoData(canvas.toDataURL('image/jpeg',.78));};image.src=reader.result;};reader.readAsDataURL(file);
                        }} />
                    </Button>
                    {photoData&&<Box sx={{mt:1.5,display:'flex',alignItems:'center',gap:2}}><img src={photoData} alt="Vista previa" width="72" height="72" style={{objectFit:'cover',borderRadius:18}}/><Button color="error" onClick={()=>setPhotoData(null)}>Quitar</Button></Box>}
                </Box>
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
