import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as calendarApi from '../services/CalendarService';
import { formatCurrency } from '../utils/currency';
import '../styles/CalendarPage.css';
import '../styles/FeaturePages.css';

const iso = d => d.toISOString().slice(0,10);
const localDate = value => new Date(`${value}T12:00:00`);
const label = value => localDate(value).toLocaleDateString('es-CO',{day:'numeric',month:'short'});
const types={contribution:'Aporte',activity:'Actividad',natillera:'Natillera',loan:'Préstamo'};

export default function CalendarPage(){
  const [month,setMonth]=useState(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1);});
  const [data,setData]=useState({events:[],reminders:[],preferences:null});
  const [error,setError]=useState('');
  const range=useMemo(()=>({start:iso(new Date(Date.UTC(month.getFullYear(),month.getMonth(),1))),end:iso(new Date(Date.UTC(month.getFullYear(),month.getMonth()+1,0)))}),[month]);
  const load=useCallback(()=>calendarApi.getCalendar(range.start,range.end).then(setData).catch(e=>setError(e.response?.data?.message||'No pudimos cargar el calendario.')),[range]);
  useEffect(()=>{load();},[load]);
  const firstOffset=new Date(`${range.start}T12:00:00`).getDay();
  const days=Array.from({length:new Date(month.getFullYear(),month.getMonth()+1,0).getDate()},(_,i)=>`${range.start.slice(0,8)}${String(i+1).padStart(2,'0')}`);
  const changePrefs=async key=>{const current=data.preferences||{in_app_enabled:true,email_enabled:true};const body={inAppEnabled:key==='in_app_enabled'?!current.in_app_enabled:current.in_app_enabled,emailEnabled:key==='email_enabled'?!current.email_enabled:current.email_enabled};try{const preferences=await calendarApi.updatePreferences(body);setData(x=>({...x,preferences}));}catch(e){setError(e.response?.data?.message||'No se pudo guardar la preferencia. Intenta de nuevo.');}};
  const read=async id=>{try{await calendarApi.markReminderRead(id);setData(x=>({...x,reminders:x.reminders.filter(r=>r.id!==id)}));}catch(e){setError(e.response?.data?.message||'No se pudo marcar el recordatorio como leído.');}};
  return <Box className="mv-page"><Box sx={{maxWidth:1200,mx:'auto',p:{xs:2,md:4}}}>
    <Box className="mv-page-banner calendar-banner"><Box><Typography component="h1">Tu calendario</Typography><Typography>Fechas importantes de tus natilleras, aportes y actividades.</Typography></Box><CalendarMonthOutlinedIcon/></Box>
    {error&&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}
    {data.reminders.length>0&&<Paper className="mv-page-panel" sx={{mb:3}}><Typography variant="h5" color="accentGreen.dark" fontWeight={800}>Recordatorios</Typography><Stack spacing={1} sx={{mt:2}}>{data.reminders.map(r=><Box className="calendar-reminder" key={r.id}><Box><Typography fontWeight={800}>{r.title}</Typography><Typography variant="body2">{r.timing==='overdue'?'Venció':r.timing==='1_day'?'Mañana':'En 7 días'} · {label(String(r.event_date).slice(0,10))}</Typography></Box><Stack direction="row" gap={1}><Button component={Link} to={r.link} size="small">Ver</Button><Button size="small" color="inherit" onClick={()=>read(r.id)}>Leído</Button></Stack></Box>)}</Stack></Paper>}
    <Paper className="mv-page-panel calendar-controls"><Stack direction="row" alignItems="center" justifyContent="space-between"><Button aria-label="Mes anterior" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeftIcon/></Button><Typography component="h2">{month.toLocaleDateString('es-CO',{month:'long',year:'numeric'})}</Typography><Button aria-label="Mes siguiente" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRightIcon/></Button></Stack><Button onClick={()=>{const d=new Date();setMonth(new Date(d.getFullYear(),d.getMonth(),1));}}>Hoy</Button></Paper>
    <Box className="calendar-weekdays">{['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(x=><span key={x}>{x}</span>)}</Box>
    <Box className="calendar-grid">{Array.from({length:firstOffset},(_,i)=><Box className="calendar-day empty" key={`e${i}`}/>)}{days.map(day=><Box className={`calendar-day ${day===iso(new Date())?'today':''}`} key={day}><Typography className="day-number">{Number(day.slice(-2))}</Typography>{data.events.filter(e=>e.date===day).map(e=><Button component={Link} to={e.link} className={`calendar-event ${e.type} ${e.status}`} key={e.id}><span>{e.title}</span>{e.amount!=null&&<small>{formatCurrency(e.amount)}</small>}</Button>)}</Box>)}</Box>
    <Box className="calendar-agenda"><Typography component="h2" className="mv-page-section-title">Agenda del mes</Typography>{data.events.length===0?<Paper className="mv-page-panel"><Typography color="text.secondary">No tienes compromisos este mes.</Typography></Paper>:<Stack spacing={1.5}>{data.events.map(e=><Paper className={`agenda-item ${e.type}`} key={e.id}><Box><Chip size="small" label={types[e.type]||e.type}/><Typography fontWeight={800}>{e.title}</Typography><Typography>{label(e.date)}{e.amount!=null?` · ${formatCurrency(e.amount)}`:''}</Typography></Box><Button component={Link} to={e.link}>Abrir</Button></Paper>)}</Stack>}</Box>
    <Paper className="mv-page-panel" sx={{mt:4}}><Typography variant="h5" color="accentGreen.dark" fontWeight={800}>Mis recordatorios</Typography><Typography color="text.secondary" sx={{mb:1}}>Se crean 7 días antes, 1 día antes y una vez después del vencimiento.</Typography><FormControlLabel control={<Switch checked={data.preferences?.in_app_enabled??true} onChange={()=>changePrefs('in_app_enabled')}/>} label="Mostrar avisos dentro de Mi Vaquita"/><FormControlLabel control={<Switch checked={data.preferences?.email_enabled??true} onChange={()=>changePrefs('email_enabled')}/>} label="Enviar recordatorios por correo"/></Paper>
  </Box></Box>;
}
