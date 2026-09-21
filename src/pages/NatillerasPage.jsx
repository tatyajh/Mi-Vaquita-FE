import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Checkbox,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FriendsService from "../services/FriendsService";
import { searchUsers } from "../services/UsersService";
import { getCurrentUser } from "../services/AuthService";
import { formatCurrency as cop } from "../utils/currency";
import * as api from "../services/NatilleraService";
import * as community from "../services/CommunityService";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import "../styles/FeaturePages.css";
import { formatDateCO } from '../utils/date';

const today = () => new Date().toISOString().slice(0, 10);
const dateText = formatDateCO;
const surface = {
  borderRadius: "20px",
  p: { xs: 2, sm: 3 },
  boxShadow: "none",
  overflow: "visible",
};
const errorText = (e) =>
  e.response?.data?.message || e.message || "No se pudo completar la acción";
const statusLabel = {
  paid: "Pagada",
  partial: "Parcial",
  overdue: "Vencida",
  pending: "Pendiente",
};
const roleLabel = {
  admin: "Administración",
  treasurer: "Tesorería",
  member: "Integrante",
  viewer: "Solo consulta",
};
const FeatureCard = ({
  tone,
  title,
  description,
  action,
  icon: Icon,
  onClick,
}) => (
  <Box className={`mv-feature-card ${tone}`}>
    {!action && (
      <Chip className="mv-info-chip" label="Así funciona" size="small" />
    )}
    <Typography component="h2">{title}</Typography>
    <Typography component="p">{description}</Typography>
    {action && <Button onClick={onClick}>{action}</Button>}
    <Box className="mv-feature-card-art">
      <Icon />
    </Box>
  </Box>
);
export default function NatillerasPage() {
  const { id } = useParams(),
    navigate = useNavigate(),
    current = getCurrentUser();
  const theme = useTheme(),
    mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [items, setItems] = useState([]),
    [detail, setDetail] = useState(null),
    [closure, setClosure] = useState(null),
    [audit, setAudit] = useState([]),
    [friends, setFriends] = useState([]);
  const [dialog, setDialog] = useState(""),
    [tab, setTab] = useState(0),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [borrowerSearch, setBorrowerSearch] = useState("");
  const [borrowerResults, setBorrowerResults] = useState([]);
  const [statusFilter,setStatusFilter]=useState('all');
  const [personFilter,setPersonFilter]=useState('all');
  const [form, setForm] = useState({
    name: "",
    purpose: "",
    startsOn: today(),
    endsOn: today(),
    frequency: "weekly",
    contribution: "",
    profitDistribution: "proportional",
    lateFee: "0",
    participantIds: [],
    userId: "",
    participantId: "",
    dueOn: "",
    amount: "",
    principal: "",
    annualRate: "",
    termMonths: "",
    loanId: "",
    kind: "extraordinary",
    quotaName: "",
    quotaId: "",
    description: "",
    note: "",
    borrowerType: "member",
    role: "member",
  });
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const load = useCallback(async () => {
    try {
      setError("");
      if (id) {
        const d = await api.getNatillera(id);
        setDetail(d);
        setClosure(await api.getClosure(id));
        if (d.owner_id === current?.id)
          setAudit(await api.getContributionAudit(id));
      } else setItems(await api.listNatilleras());
    } catch (e) {
      setError(errorText(e));
    }
  }, [id, current?.id]);
  useEffect(() => {
    load();
    FriendsService.getFriends()
      .then(setFriends)
      .catch(() => {});
  }, [load]);
  const run = async (action, after) => {
    setBusy(true);
    setError("");
    try {
      await action();
      setDialog("");
      await load();
      after?.();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const admin = detail?.owner_id === current?.id;
  const begin = (name, seed = {}) => {
    setError("");
    if (name === "loan") {
      setBorrowerSearch("");
      setBorrowerResults([]);
    }
    setForm((f) => ({ ...f, ...seed }));
    setDialog(name);
  };
  const findBorrowers = async () => {
    if (borrowerSearch.trim().length < 2) {
      setError("Escribe al menos dos letras del nombre o correo.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const results = await searchUsers(borrowerSearch.trim());
      const memberIds = new Set((detail?.members || []).map((m) => Number(m.id)));
      setBorrowerResults(results.filter((u) => !memberIds.has(Number(u.id))));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const submit = () => {
    if (dialog === "create")
      return run(
        () =>
          api.createNatillera({
            ...form,
            guestIds: [],
            contribution: Number(form.contribution),
            lateFee: Number(form.lateFee || 0),
          }),
        () => navigate("/natilleras"),
      );
    if (dialog === "contribution")
      return run(() =>
        api.addContribution(id, {
          userId: Number(form.userId),
          dueOn: form.dueOn,
          amount: Number(form.amount),
        }),
      );
    if (dialog === "correction")
      return run(() =>
        api.correctContribution(id, form.contributionId, {
          amount: Number(form.amount),
        }),
      );
    if (dialog === "loan")
      return run(() =>
        api.addLoan(id, {
          userId: Number(form.userId),
          principal: Number(form.principal),
          annualRate: Number(form.annualRate),
          termMonths: Number(form.termMonths),
        }),
      );
    if (dialog === "payment")
      return run(() =>
        api.addLoanPayment(id, form.loanId, { amount: Number(form.amount) }),
      );
    if (dialog === "quota")
      return run(() =>
        community.addNatilleraQuota(id, {
          kind: form.kind,
          name: form.quotaName,
          dueOn: form.dueOn,
          amount: Number(form.amount),
        }),
      );
    if (dialog === "participantContribution")
      return run(() =>
        community.addNatilleraContribution(id, {
          participantId: Number(form.participantId),
          quotaId: form.quotaId ? Number(form.quotaId) : null,
          amount: Number(form.amount),
          kind: "payment",
          note: form.note || null,
        }),
      );
    if (dialog === "member")
      return run(() => api.addMember(id, { userId: Number(form.userId), role: form.role }));
    if (dialog === "ledger")
      return run(() =>
        community.addNatilleraLedger(id, {
          kind: form.kind,
          amount: Number(form.amount),
          description: form.description,
        }),
      );
  };
  return (
    <Box className="mv-page">
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
        {!id ? (
          <Box className="mv-page-intro">
            <Typography component="h1">Natilleras para ti</Typography>
            <Typography component="p">
              Organiza tu ahorro en grupo con cuentas claras y a tu ritmo.
            </Typography>
          </Box>
        ) : (
          <Box className="mv-page-banner">
            <Box>
              <Typography component="h1">
                {detail?.name || "Natillera"}
              </Typography>
              <Typography component="p">
                Aportes, préstamos y cierre en un mismo lugar.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/natilleras")}
            >
              Volver a natilleras
            </Button>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {!id && (
          <>
            {items.length > 0 && (
              <>
                <Typography className="mv-page-section-title" component="h2">
                  Mis natilleras
                </Typography>
                <Grid container spacing={3} sx={{ mb: 6 }}>
                  {items.map((n, index) => (
                    <Grid item xs={12} sm={6} md={4} key={n.id}>
                      <Card
                        className={`mv-list-card ${["lime", "", "yellow", "green"][index % 4]}`}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Chip
                            label={n.status === "closed" ? "Cerrada" : "Activa"}
                            color={
                              n.status === "closed" ? "default" : "success"
                            }
                            size="small"
                          />
                          <Typography
                            variant="h5"
                            sx={{ my: 2, fontWeight: 800 }}
                          >
                            {n.name}
                          </Typography>
                          <Typography>
                            Cuota: {cop(n.contribution)} ·{" "}
                            {n.frequency === "weekly"
                              ? "Semanal"
                              : n.frequency === "biweekly"
                                ? "Quincenal"
                                : "Mensual"}
                          </Typography>
                          <Typography>
                            {dateText(n.starts_on)} a {dateText(n.ends_on)}
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{
                              mt: 3,
                              color: "inherit",
                              borderColor: "currentColor",
                            }}
                            onClick={() => navigate(`/natilleras/${n.id}`)}
                          >
                            Ver natillera
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            <Typography className="mv-page-section-title" component="h2">
              Ahorra a tu manera
            </Typography>
            <Box className="mv-feature-grid">
              <FeatureCard
                tone="green"
                title="Crea tu natillera"
                description="Ponle nombre, fechas y valor a cada cuota."
                action="Crear natillera"
                icon={SavingsOutlinedIcon}
                onClick={() => begin("create")}
              />
              <FeatureCard
                tone="lavender"
                title="Sigue tus aportes"
                description="Mira lo registrado y lo que falta por aportar."
                icon={CalendarMonthOutlinedIcon}
              />
              <FeatureCard
                tone="yellow"
                title="Cierra con claridad"
                description="Revisa el saldo y el reparto antes de terminar."
                icon={PaidOutlinedIcon}
              />
            </Box>
          </>
        )}
        {detail && (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              <b>Registrado en Mi Vaquita · pagado por fuera.</b> Esta
              aplicación no recibe ni transfiere dinero.
            </Alert>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                ["Aportes registrados", detail.summary.totalContributions],
                ["Dinero disponible", detail.summary.available],
                ["Préstamos pendientes", detail.summary.outstanding],
                ["Intereses cobrados", detail.summary.collectedInterest],
              ].map(([label, value], index) => (
                <Grid item xs={6} md={3} key={label}>
                  <Card
                    className="mv-summary-card"
                    sx={{
                      background: ["#cfe8a8", "#cbb4cc", "#fff69c", "#f7a5be"][
                        index
                      ],
                      color: ["#315818", "#612565", "#67266b", "#9a1546"][
                        index
                      ],
                    }}
                  >
                    <Typography>{label}</Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {cop(value)}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="Aportes" />
              <Tab label="Préstamos" />
              <Tab label="Participantes" />
              <Tab label="Fondo" />
              <Tab label="Cierre" />
            </Tabs>
            {tab === 0 && (
              <Card sx={surface}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Typography variant="h5">Cronograma de cuotas</Typography>
                  {admin && detail.status === "active" && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        begin("contribution", {
                          userId: detail.members[0]?.id || "",
                          dueOn: String(detail.schedule[0]?.dueOn || '').slice(0, 10),
                          amount: "",
                        })
                      }
                    >
                      Registrar aporte
                    </Button>
                  )}
                </Stack>
                <Stack direction={{xs:'column',sm:'row'}} spacing={1.5} sx={{mt:2}}>
                  <TextField select size="small" label="Estado" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} sx={{minWidth:160}}>
                    <MenuItem value="all">Todos</MenuItem>{Object.entries(statusLabel).map(([value,label])=><MenuItem key={value} value={value}>{label}</MenuItem>)}
                  </TextField>
                  <TextField select size="small" label="Persona" value={personFilter} onChange={(e)=>setPersonFilter(e.target.value)} sx={{minWidth:200}}>
                    <MenuItem value="all">Todas</MenuItem>{detail.members.map((m)=><MenuItem key={m.id} value={String(m.id)}>{m.name}</MenuItem>)}
                  </TextField>
                </Stack>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {detail.schedule.filter((s)=>(statusFilter==='all'||s.status===statusFilter)&&(personFilter==='all'||String(s.userId)===personFilter)).map((s, i) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={`${s.userId}-${s.dueOn}-${i}`}
                    >
                      <Box
                        sx={{
                          border: "1px solid #eee",
                          borderRadius: '14px',
                          p: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography fontWeight={700}>
                            {s.name} · {dateText(s.dueOn)}
                          </Typography>
                          <Typography variant="body2">
                            {cop(s.paid)} de {cop(s.due)} · Falta{" "}
                            {cop(s.balance)}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={statusLabel[s.status]}
                          color={
                            s.status === "paid"
                              ? "success"
                              : s.status === "overdue"
                                ? "error"
                                : "warning"
                          }
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Movimientos registrados
                </Typography>
                {detail.contributions.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      borderBottom: "1px solid #eee",
                      py: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      {c.member_name} · {dateText(c.due_on)} · {cop(c.amount)}{" "}
                      {c.corrected_at ? "(corregido)" : ""}
                    </Typography>
                    {admin && detail.status === "active" && (
                      <Button
                        size="small"
                        onClick={() =>
                          begin("correction", {
                            contributionId: c.id,
                            amount: c.amount,
                          })
                        }
                      >
                        Corregir
                      </Button>
                    )}
                  </Box>
                ))}
                {admin && audit.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 3 }}>
                      Historial de correcciones
                    </Typography>
                    {audit.map((a) => (
                      <Typography key={a.id} variant="body2">
                        Aporte #{a.contribution_id}: {cop(a.old_amount)} →{" "}
                        {cop(a.new_amount)} · {dateText(a.changed_at)}
                      </Typography>
                    ))}
                  </>
                )}
              </Card>
            )}
            {tab === 1 && (
              <Card sx={surface}>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography variant="h5">Préstamos</Typography>
                  {admin && detail.status === "active" && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        begin("loan", {
                          userId: detail.members[0]?.id || "",
                          borrowerType: "member",
                          principal: "",
                          annualRate: "",
                          termMonths: "",
                        })
                      }
                    >
                      Nuevo préstamo
                    </Button>
                  )}
                </Stack>
                <TextField select size="small" label="Persona" value={personFilter} onChange={(e)=>setPersonFilter(e.target.value)} sx={{minWidth:200,mt:2}}>
                  <MenuItem value="all">Todas</MenuItem>{detail.loans.map((l)=><MenuItem key={l.id} value={String(l.user_id)}>{l.member_name}</MenuItem>)}
                </TextField>
                {detail.loans.filter((l)=>personFilter==='all'||String(l.user_id)===personFilter).map((l) => (
                  <Box
                    key={l.id}
                    sx={{ borderBottom: "1px solid #eee", py: 2 }}
                  >
                    <Typography fontWeight={700}>
                      {l.member_name} · {cop(l.principal)}{" "}
                      {!l.is_member && (
                        <Chip size="small" color="secondary" label="Externo" />
                      )}
                    </Typography>
                    <Typography>
                      Interés sobre saldo: {l.annual_rate}% anual, estimado para {l.term_months}{" "}
                      meses · {cop(l.interest)}
                    </Typography>
                    <Typography>
                      Capital pendiente: {cop(l.capitalPending)} · Interés
                      pendiente: {cop(l.interestPending)}
                    </Typography>
                    <Typography color="text.secondary">
                      Pagado a capital: {cop(l.capitalPaid)} · Pagado a
                      intereses: {cop(l.interestPaid)} · Saldo total: {cop(l.balance)}
                    </Typography>
                    {l.schedule?.find((q) => q.balance > 0) && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Próxima cuota: {dateText(l.schedule.find((q) => q.balance > 0).due_on)} ·{" "}
                        {cop(l.schedule.find((q) => q.balance > 0).balance)}
                      </Typography>
                    )}
                    {admin && detail.status === "active" && l.balance > 0 && (
                      <Button
                        onClick={() =>
                          begin("payment", { loanId: l.id, amount: "" })
                        }
                      >
                        Registrar abono
                      </Button>
                    )}
                  </Box>
                ))}
                {!detail.loans.length && (
                  <Typography sx={{ mt: 2 }}>Aún no hay préstamos.</Typography>
                )}
              </Card>
            )}
            {tab === 2 && (
              <Card sx={surface}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h5">Participantes</Typography>
                    <Typography color="text.secondary">
                      Roles, aportes e invitaciones privadas.
                    </Typography>
                  </Box>
                  {admin && detail.status === "active" && (
                    <Stack direction={{xs:'column',sm:'row'}} spacing={1}>
                    <Button variant="contained" onClick={() => begin('member',{userId:'',role:'member'})}>Agregar integrante</Button>
                    <Button variant="outlined" onClick={() =>
                        begin("participantContribution", {
                          participantId:
                            detail.participants?.[0]?.participant_id || "",
                          amount: "",
                          quotaId: "",
                          note: "",
                        })
                      }
                    >
                      Registrar aporte flexible
                    </Button>
                    </Stack>
                  )}
                </Stack>
                {detail.participants?.map((p) => (
                  <Box
                    key={p.participant_id}
                    sx={{
                      borderBottom: "1px solid #eee",
                      py: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={800}>
                        {p.name}{" "}
                        {admin && p.user_id !== detail.owner_id ? (
                          <TextField select size="small" value={p.role} onChange={(e)=>run(()=>api.updateParticipantRole(id,p.participant_id,e.target.value))} sx={{minWidth:140,ml:1}}>
                            {Object.entries(roleLabel).map(([value,label])=><MenuItem value={value} key={value}>{label}</MenuItem>)}
                          </TextField>
                        ) : (
                          <Chip size="small" label={roleLabel[p.role] || p.role}/>
                        )}
                      </Typography>
                      <Typography variant="body2">
                        {p.email || p.phone || "Sin contacto"} · Aportado{" "}
                        {cop(p.contributed)}
                      </Typography>
                    </Box>
                    {admin && p.guest_id && (
                      <Button
                        size="small"
                        onClick={async () => {
                          try {
                            const result = await community.inviteNatilleraGuest(
                              id,
                              p.participant_id,
                            );
                            if (result.whatsappUrl)
                              window.open(
                                result.whatsappUrl,
                                "_blank",
                                "noopener,noreferrer",
                              );
                          } catch (e) {
                            setError(errorText(e));
                          }
                        }}
                      >
                        Enviar invitación
                      </Button>
                    )}
                  </Box>
                ))}
              </Card>
            )}
            {tab === 3 && (
              <Card sx={surface}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h5">Fondo y reglas</Typography>
                    <Typography color="text.secondary">
                      {detail.purpose || "Sin propósito registrado"} · Reparto{" "}
                      {detail.profit_distribution === "equal"
                        ? "por partes iguales"
                        : "proporcional a aportes"}{" "}
                      · Mora {cop(detail.late_fee || 0)}
                    </Typography>
                  </Box>
                  {admin && detail.status === "active" && (
                    <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          begin("quota", {
                            kind: "extraordinary",
                            quotaName: "",
                            dueOn: today(),
                            amount: "",
                          })
                        }
                      >
                        Cuota extraordinaria
                      </Button>
                      <Button
                        variant="green"
                        onClick={() =>
                          begin("ledger", {
                            kind: "general_expense",
                            amount: "",
                            description: "",
                          })
                        }
                      >
                        Movimiento del fondo
                      </Button>
                    </Stack>
                  )}
                </Stack>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {[
                    ["Utilidad actividades", detail.summary.activityProfit],
                    ["Gastos generales", detail.summary.generalExpenses],
                    ["Utilidad estimada", detail.summary.estimatedProfit],
                  ].map(([label, value]) => (
                    <Grid item xs={12} sm={4} key={label}>
                      <Box
                        sx={{ p: 2, borderRadius: '14px', background: "#f1f7df" }}
                      >
                        <Typography>{label}</Typography>
                        <Typography variant="h6">{cop(value)}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Movimientos
                </Typography>
                {detail.ledger?.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography>{m.description}</Typography>
                    <Typography fontWeight={800}>{cop(m.amount)}</Typography>
                  </Box>
                ))}
              </Card>
            )}
            {tab === 4 && (
              <Card sx={surface}>
                <Typography variant="h5">Resumen de cierre</Typography>
                <Typography sx={{ mt: 2 }}>
                  Disponible: {cop(closure?.available)} · Préstamos pendientes:{" "}
                  {cop(closure?.outstanding)}
                </Typography>
                {closure?.reason && (
                  <Alert severity="warning" sx={{ my: 2 }}>
                    {closure.reason}
                  </Alert>
                )}
                {closure?.payouts?.map((p, index) => (
                  <Box
                    key={p.participantId || p.userId || index}
                    sx={{ borderBottom: "1px solid #eee", py: 1 }}
                  >
                    {p.name}: aportes {cop(p.contributed)} + utilidad{" "}
                    {cop(p.profit)} = <b>{cop(p.payout)}</b>
                  </Box>
                ))}
                {admin && detail.status === "active" && (
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    disabled={!closure?.canClose || busy}
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Confirmar el cierre? No se podrán registrar nuevos movimientos.",
                        )
                      )
                        run(() => api.closeNatillera(id));
                    }}
                  >
                    Confirmar cierre
                  </Button>
                )}
                {detail.status === "closed" && (
                  <Chip
                    label="Natillera cerrada"
                    color="success"
                    sx={{ mt: 2 }}
                  />
                )}
              </Card>
            )}
          </>
        )}
        <Dialog
          open={Boolean(dialog)}
          onClose={() => setDialog("")}
          fullWidth
          maxWidth="sm"
          fullScreen={mobile}
        >
          <DialogTitle>
            {
              {
                create: "Nueva natillera",
                contribution: "Registrar aporte",
                correction: "Corregir aporte",
                loan: "Nuevo préstamo",
                payment: "Registrar abono",
                quota: "Nueva cuota extraordinaria",
                participantContribution: "Registrar aporte flexible",
                member: "Agregar integrante",
                ledger: "Movimiento del fondo",
              }[dialog]
            }
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialog === "create" && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Completa las reglas del ahorro y después selecciona las
                    personas que participarán.
                  </Typography>
                  <TextField
                    required
                    label="Nombre de la natillera"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                  <TextField
                    label="Propósito (opcional)"
                    value={form.purpose}
                    onChange={(e) => update("purpose", e.target.value)}
                  />
                  <TextField
                    label="Inicio"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.startsOn}
                    onChange={(e) => update("startsOn", e.target.value)}
                  />
                  <TextField
                    label="Fin"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.endsOn}
                    onChange={(e) => update("endsOn", e.target.value)}
                  />
                  <TextField
                    select
                    label="Frecuencia"
                    value={form.frequency}
                    onChange={(e) => update("frequency", e.target.value)}
                  >
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="biweekly">Quincenal</MenuItem>
                    <MenuItem value="monthly">Mensual</MenuItem>
                  </TextField>
                  <TextField
                    required
                    label="Valor por cuota (COP)"
                    type="number"
                    value={form.contribution}
                    onChange={(e) => update("contribution", e.target.value)}
                  />
                  <TextField
                    select
                    label="Reparto de utilidad"
                    value={form.profitDistribution}
                    onChange={(e) =>
                      update("profitDistribution", e.target.value)
                    }
                  >
                    <MenuItem value="proportional">
                      Proporcional a los aportes
                    </MenuItem>
                    <MenuItem value="equal">Partes iguales</MenuItem>
                  </TextField>
                  <TextField
                    label="Mora o multa (COP)"
                    type="number"
                    value={form.lateFee}
                    onChange={(e) => update("lateFee", e.target.value)}
                  />
                  {friends.length > 0 && (
                    <Box>
                      <Typography fontWeight={800}>
                        Amigos registrados
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Marca únicamente a quienes pertenecerán a esta
                        natillera.
                      </Typography>
                      {friends.map((f) => (
                        <FormControlLabel
                          key={f.friend_user_id}
                          control={
                            <Checkbox
                              checked={form.participantIds.includes(
                                f.friend_user_id,
                              )}
                              onChange={(e) =>
                                update(
                                  "participantIds",
                                  e.target.checked
                                    ? [...form.participantIds, f.friend_user_id]
                                    : form.participantIds.filter(
                                        (x) => x !== f.friend_user_id,
                                      ),
                                )
                              }
                            />
                          }
                          label={f.name}
                        />
                      ))}
                    </Box>
                  )}
                  <Alert severity="info">
                    Todas las personas de una natillera deben tener una cuenta
                    en Mi Vaquita. Los invitados sin cuenta se pueden agregar
                    después a las actividades.
                  </Alert>
                </>
              )}
              {dialog === "contribution" && (
                <TextField
                  select
                  label="Participante"
                  value={form.userId}
                  onChange={(e) => update("userId", e.target.value)}
                >
                  {detail?.members.map((m) => (
                    <MenuItem value={m.id} key={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {dialog === "member" && (
                <>
                  <Alert severity="info">Solo se muestran amistades con una cuenta activa. La incorporación y los cambios de rol quedarán auditados.</Alert>
                  <TextField select label="Persona" value={form.userId} onChange={(e)=>update('userId',e.target.value)}>
                    {friends.filter((f)=>!detail?.members?.some((m)=>Number(m.id)===Number(f.friend_user_id))).map((f)=><MenuItem key={f.friend_user_id} value={f.friend_user_id}>{f.name}</MenuItem>)}
                  </TextField>
                  <TextField select label="Rol" value={form.role} onChange={(e)=>update('role',e.target.value)}>
                    {Object.entries(roleLabel).map(([value,label])=><MenuItem key={value} value={value}>{label}</MenuItem>)}
                  </TextField>
                </>
              )}
              {dialog === "contribution" && (
                <TextField
                  select
                  label="Cuota"
                  value={form.dueOn}
                  onChange={(e) => update("dueOn", e.target.value)}
                >
                  {[...new Set(detail?.schedule.map((s) => s.dueOn))].map(
                    (d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              )}
              {["contribution", "correction", "payment"].includes(dialog) && (
                <TextField
                  label="Valor (COP)"
                  type="number"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                />
              )}
              {dialog === "loan" && (
                <>
                  <Alert severity="info">
                    El préstamo se registra aquí, pero el dinero se entrega y
                    se paga por fuera de Mi Vaquita.
                  </Alert>
                  <TextField
                    select
                    label="Tipo de prestatario"
                    value={form.borrowerType}
                    onChange={(e) => {
                      update("borrowerType", e.target.value);
                      update(
                        "userId",
                        e.target.value === "member"
                          ? detail?.members?.[0]?.id || ""
                          : "",
                      );
                    }}
                  >
                    <MenuItem value="member">Integrante de la natillera</MenuItem>
                    <MenuItem value="external">Usuario externo registrado</MenuItem>
                  </TextField>
                  {form.borrowerType === "member" ? (
                    <TextField
                      select
                      label="Integrante"
                      value={form.userId}
                      onChange={(e) => update("userId", e.target.value)}
                    >
                      {detail?.members.map((m) => (
                        <MenuItem value={m.id} key={m.id}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <Box>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <TextField
                          fullWidth
                          label="Buscar por nombre o correo"
                          value={borrowerSearch}
                          onChange={(e) => setBorrowerSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              findBorrowers();
                            }
                          }}
                        />
                        <Button variant="outlined" onClick={findBorrowers} disabled={busy}>
                          Buscar
                        </Button>
                      </Stack>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {borrowerResults.map((u) => (
                          <Button
                            key={u.id}
                            variant={Number(form.userId) === Number(u.id) ? "contained" : "outlined"}
                            onClick={() => update("userId", u.id)}
                            sx={{ justifyContent: "flex-start", textAlign: "left" }}
                          >
                            {u.name} · {u.email}
                          </Button>
                        ))}
                        {borrowerResults.length === 0 && borrowerSearch.length >= 2 && (
                          <Typography variant="body2" color="text.secondary">
                            Si no aparece, primero debe crear una cuenta en Mi Vaquita. No será agregado como integrante.
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}
                  <TextField
                    label="Capital (COP)"
                    type="number"
                    value={form.principal}
                    onChange={(e) => update("principal", e.target.value)}
                  />
                  <TextField
                    label="Tasa anual simple (%)"
                    type="number"
                    value={form.annualRate}
                    onChange={(e) => update("annualRate", e.target.value)}
                  />
                  <TextField
                    label="Plazo (meses)"
                    type="number"
                    value={form.termMonths}
                    onChange={(e) => update("termMonths", e.target.value)}
                  />
                </>
              )}
              {dialog === "quota" && (
                <>
                  <TextField
                    label="Nombre de la cuota"
                    value={form.quotaName}
                    onChange={(e) => update("quotaName", e.target.value)}
                  />
                  <TextField
                    label="Fecha"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.dueOn}
                    onChange={(e) => update("dueOn", e.target.value)}
                  />
                  <TextField
                    label="Valor (COP)"
                    type="number"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                  />
                </>
              )}
              {dialog === "participantContribution" && (
                <>
                  <TextField
                    select
                    label="Participante"
                    value={form.participantId}
                    onChange={(e) => update("participantId", e.target.value)}
                  >
                    {detail?.participants?.map((p) => (
                      <MenuItem key={p.participant_id} value={p.participant_id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  {detail?.quotas?.length > 0 && (
                    <TextField
                      select
                      label="Cuota"
                      value={form.quotaId}
                      onChange={(e) => update("quotaId", e.target.value)}
                    >
                      <MenuItem value="">Aporte general sin cuota</MenuItem>
                      {detail.quotas.map((q) => (
                        <MenuItem key={q.id} value={q.id}>
                          {q.name} · {q.due_on} · {cop(q.amount)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  <TextField
                    label="Valor (COP)"
                    type="number"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                  />
                  <TextField
                    label="Nota"
                    value={form.note}
                    onChange={(e) => update("note", e.target.value)}
                  />
                </>
              )}
              {dialog === "ledger" && (
                <>
                  <TextField
                    select
                    label="Tipo"
                    value={form.kind}
                    onChange={(e) => update("kind", e.target.value)}
                  >
                    <MenuItem value="general_expense">Gasto general</MenuItem>
                    <MenuItem value="late_fee">Mora o multa</MenuItem>
                    <MenuItem value="adjustment">Ajuste</MenuItem>
                  </TextField>
                  <TextField
                    label="Descripción"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                  <TextField
                    label="Valor (COP)"
                    type="number"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                  />
                </>
              )}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog("")}>Cancelar</Button>
            <Button variant="contained" disabled={busy} onClick={submit}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
