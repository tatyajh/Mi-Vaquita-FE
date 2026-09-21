import React,{useEffect,useState} from 'react';
import {Alert,Box,Card,Chip,CircularProgress,Grid,Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import * as api from '../services/CommunityService';
import {formatCurrency as cop} from '../utils/currency';
import '../styles/FeaturePages.css';

export default function PrivateNatilleraPage(){
  const {natilleraId}=useParams(),[item,setItem]=useState(null),[error,setError]=useState('');
  useEffect(()=>{api.getPrivateNatillera(natilleraId).then(setItem).catch(e=>setError(e.response?.data?.message||'No pudimos abrir esta natillera.'));},[natilleraId]);
  return <Box className="mv-page"><Box sx={{maxWidth:760,mx:'auto',p:{xs:2,md:5}}}>{error&&<Alert severity="error">{error}</Alert>}{!item&&!error&&<Box sx={{textAlign:'center',p:6}}><CircularProgress color="success"/></Box>}{item&&<><Box className="mv-page-banner"><Box><Typography component="h1">{item.name}</Typography><Typography>{item.purpose||'Tu ahorro en grupo'}</Typography></Box></Box><Alert severity="info" sx={{mb:3}}>{item.notice}</Alert><Grid container spacing={2}><Grid item xs={12} sm={6}><Card className="mv-summary-card" sx={{background:'#cfe8a8'}}><Typography>Tu aporte registrado</Typography><Typography variant="h4">{cop(item.contributed)}</Typography></Card></Grid><Grid item xs={12} sm={6}><Card className="mv-summary-card" sx={{background:'#cbb4cc'}}><Typography>Valor de la cuota</Typography><Typography variant="h4">{cop(item.contribution)}</Typography></Card></Grid></Grid><Card sx={{p:3,mt:3,borderRadius:5,boxShadow:'none'}}><Chip color={item.status==='active'?'success':'default'} label={item.status==='active'?'Activa':'Cerrada'}/><Typography sx={{mt:2}}>Frecuencia: {item.frequency==='weekly'?'semanal':item.frequency==='biweekly'?'quincenal':'mensual'}</Typography><Typography>Periodo: {String(item.starts_on).slice(0,10)} a {String(item.ends_on).slice(0,10)}</Typography><Typography>Reparto: {item.profit_distribution==='equal'?'partes iguales':'proporcional a los aportes'}</Typography></Card></>}</Box></Box>;
}
