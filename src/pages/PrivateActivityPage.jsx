import React,{useEffect,useState} from 'react';
import {Alert,Box,Card,Chip,CircularProgress,Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import * as api from '../services/CommunityService';
import {formatCurrency as cop} from '../utils/currency';
import '../styles/FeaturePages.css';

export default function PrivateActivityPage(){
  const {activityId}=useParams(),[activity,setActivity]=useState(null),[error,setError]=useState('');
  useEffect(()=>{api.getPrivateActivity(activityId).then(setActivity).catch(e=>setError(e.response?.data?.message||'No pudimos abrir tu asignación.'));},[activityId]);
  return <Box className="mv-page"><Box sx={{maxWidth:720,mx:'auto',p:{xs:2,md:5}}}>{error&&<Alert severity="error">{error}</Alert>}{!activity&&!error&&<Box sx={{textAlign:'center',p:6}}><CircularProgress color="success"/></Box>}{activity&&<><Box className="mv-page-banner"><Box><Typography component="h1">{activity.name}</Typography><Typography>{activity.type==='secret_santa'?'Tu asignación privada':'Tu actividad privada'}</Typography></Box></Box><Card sx={{p:{xs:3,sm:5},borderRadius:6,textAlign:'center',boxShadow:'none'}}><Chip color="success" label={activity.status==='drawn'?'Sorteo realizado':'Pendiente'}/>{activity.myRecipient?<><Typography sx={{mt:3}} color="text.secondary">Te tocó regalarle a</Typography><Typography variant="h3" color="accentGreen.dark" sx={{my:2}}>{activity.myRecipient.name}</Typography></>:<Typography sx={{my:4}}>Tu asignación aparecerá aquí cuando se realice el sorteo.</Typography>}{activity.budget&&<Typography>Presupuesto orientativo: <b>{cop(activity.budget)}</b></Typography>}<Alert severity="info" sx={{mt:3,textAlign:'left'}}>Esta información es privada. No compartas el enlace ni tu PIN.</Alert></Card></>}</Box></Box>;
}
