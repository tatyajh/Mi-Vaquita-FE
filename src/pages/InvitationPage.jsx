import React,{useState} from 'react';
import {Alert,Box,Button,Paper,Stack,TextField,Typography} from '@mui/material';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {MILK_BAG_RADIUS} from '../utils/shape';
import * as api from '../services/CommunityService';

export default function InvitationPage(){
  const [params]=useSearchParams(),navigate=useNavigate(),token=params.get('token')||'';
  const [pin,setPin]=useState(''),[confirmPin,setConfirmPin]=useState(''),[returning,setReturning]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const submit=async()=>{if(!/^\d{4,8}$/.test(pin))return setError('El PIN debe tener entre 4 y 8 números.');if(!returning&&pin!==confirmPin)return setError('Los PIN no coinciden.');setBusy(true);setError('');try{const result=returning?await api.accessInvitation(token,pin):await api.claimInvitation(token,pin);
      // Llave separada de 'token' (la sesión real): un token de
      // invitado solo sirve para ver esta actividad/natillera puntual
      // (el backend lo acepta vía req.principal.guestId, no
      // req.userId). Guardarlo como 'token' pisaba la sesión de
      // cualquiera que ya estuviera logueado y, para un invitado
      // nuevo, lo dejaba "logueado" en toda la app sin serlo — de ahí
      // que grupos/amigos/actividades generales se vieran vacíos justo
      // después de meter el PIN.
      localStorage.setItem('guestAccessToken',result.accessToken);const target=result.scope?.type==='activity'?`/actividades/${result.scope.id}/privado`:`/natilleras/${result.scope.id}/privado`;navigate(target,{replace:true});}catch(e){setError(e.response?.data?.message||'El enlace o el PIN no son válidos.');}finally{setBusy(false);}};
  return <Box sx={{minHeight:'100vh',background:'#f1f7df',display:'grid',placeItems:'center',p:2}}><Paper sx={{width:'100%',maxWidth:460,p:{xs:3,sm:5},borderRadius:MILK_BAG_RADIUS}}><Stack spacing={2}><Typography variant="h4" color="accentGreen.dark">Tu invitación</Typography><Typography color="text.secondary">{returning?'Escribe el PIN que creaste para volver a entrar.':'Crea un PIN numérico para acceder solo a esta actividad.'}</Typography>{error&&<Alert severity="error">{error}</Alert>}<TextField label="PIN" type="password" inputProps={{inputMode:'numeric',maxLength:8}} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))}/>{!returning&&<TextField label="Confirmar PIN" type="password" inputProps={{inputMode:'numeric',maxLength:8}} value={confirmPin} onChange={e=>setConfirmPin(e.target.value.replace(/\D/g,''))}/>}<Button variant="green" size="large" disabled={busy||!token} onClick={submit}>{returning?'Entrar':'Aceptar invitación'}</Button><Button onClick={()=>{setReturning(v=>!v);setError('');}}>{returning?'Es la primera vez que entro':'Ya tengo un PIN'}</Button></Stack></Paper></Box>;
}
