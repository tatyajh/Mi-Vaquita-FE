import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as api from "../services/CommunityService";
import { formatCurrency as cop } from "../utils/currency";
import { getCurrentUser } from "../services/AuthService";
import FriendsService from "../services/FriendsService";
import GuestFields from "../components/common/GuestFields";
import * as natilleraApi from "../services/NatilleraService";
import "../styles/FeaturePages.css";

const today = () => new Date().toISOString().slice(0, 10);
const errorText = (e) =>
  e.response?.data?.message || e.message || "No se pudo completar la acción";
const labels = {
  secret_santa: "Amigo secreto",
  raffle: "Rifa",
  sale: "Venta",
  bazaar: "Bazar",
  bingo: "Bingo",
  game: "Juego",
  food: "Comida",
  other: "Otra actividad",
};
const fundraising = new Set([
  "sale",
  "bazaar",
  "bingo",
  "game",
  "food",
  "other",
]);

export default function CommunityActivitiesPage() {
  const { activityId } = useParams(),
    navigate = useNavigate(),
    theme = useTheme(),
    mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const current = getCurrentUser();
  const [items, setItems] = useState([]),
    [activity, setActivity] = useState(null),
    [dialog, setDialog] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [friends, setFriends] = useState([]),
    [natilleras, setNatilleras] = useState([]),
    [natilleraMembers, setNatilleraMembers] = useState([]),
    [whatsappLinks, setWhatsappLinks] = useState([]);
  const [form, setForm] = useState({
    type: "secret_santa",
    name: "",
    eventOn: today(),
    budget: "",
    description: "",
    guests: [{ name: "", email: "", phone: "" }],
    registeredIds: [],
    natilleraId: "",
    leaderKey: "self",
    kind: "income",
    amount: "",
    receiptUrl: "",
    productName: "",
    unit: "unidad",
    costPrice: "",
    salePrice: "",
    initialQuantity: "",
    productId: "",
    movementKind: "sale",
    quantity: "",
    unitPrice: "",
    note: "",
    exclusions: [],
    numbers: {},
  });
  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const load = useCallback(async () => {
    try {
      setError("");
      if (activityId) {
        setItems([]);
        const detail = await api.getActivity(activityId);
        setActivity(detail);
        setWhatsappLinks(detail.preparedWhatsapp || []);
      } else {
        setActivity(null);
        setWhatsappLinks([]);
        setItems(await api.listActivities());
      }
    } catch (e) {
      setError(errorText(e));
    }
  }, [activityId]);
  useEffect(() => {
    load();
    FriendsService.getFriends()
      .then(setFriends)
      .catch(() => {});
    natilleraApi
      .listNatilleras()
      .then(setNatilleras)
      .catch(() => {});
  }, [load]);
  useEffect(() => {
    if (!form.natilleraId) return setNatilleraMembers([]);
    natilleraApi
      .getNatillera(form.natilleraId)
      .then((item) => setNatilleraMembers(item.members || []))
      .catch(() => setNatilleraMembers([]));
  }, [form.natilleraId]);
  const run = async (task, message) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await task();
      setDialog("");
      setNotice(message || "Cambios guardados.");
      await load();
      return result;
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const parseGuests = () =>
    form.guests
      .map((guest) => ({
        name: guest.name.trim(),
        email: guest.email.trim() || null,
        phone: guest.phone.trim() || null,
      }))
      .filter((guest) => guest.name || guest.email || guest.phone);
  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const guests = [];
      for (const guest of parseGuests()) {
        if (!guest.name || (!guest.email && !guest.phone))
          throw new Error("Cada invitado necesita nombre y correo o WhatsApp.");
        guests.push(await api.createGuest(guest));
      }
      const participants = [
        ...form.registeredIds.map((userId) => ({
          userId,
          role:
            form.leaderKey === `user:${userId}` ? "responsible" : "participant",
        })),
        ...guests.map((g, index) => ({
          guestId: g.id,
          role:
            form.leaderKey === `guest:${index}` ? "responsible" : "participant",
        })),
      ];
      const result = await api.createActivity({
        type: form.type,
        name: form.name,
        eventOn: form.eventOn,
        budget: form.budget ? Number(form.budget) : null,
        description: form.description || null,
        natilleraId: form.natilleraId ? Number(form.natilleraId) : null,
        leaderUserId: form.leaderKey.startsWith("user:")
          ? Number(form.leaderKey.split(":")[1])
          : null,
        participants,
      });
      setDialog("");
      navigate(`/activities/${result.id}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const addTransaction = () =>
    run(
      () =>
        api.addTransaction(activityId, {
          kind: form.kind,
          description: form.description,
          amount: Number(form.amount),
          receiptUrl: form.receiptUrl || null,
        }),
      "Movimiento registrado.",
    );
  const addProduct = () =>
    run(
      () =>
        api.addProduct(activityId, {
          name: form.productName,
          unit: form.unit,
          costPrice: Number(form.costPrice || 0),
          salePrice: Number(form.salePrice || 0),
          initialQuantity: Number(form.initialQuantity || 0),
        }),
      "Producto agregado.",
    );
  const addMovement = () =>
    run(
      () =>
        api.addInventoryMovement(activityId, form.productId, {
          kind: form.movementKind,
          quantity: Number(form.quantity),
          unitPrice: form.unitPrice ? Number(form.unitPrice) : null,
          note: form.note || null,
        }),
      "Inventario actualizado.",
    );
  const draw = async () => {
    if (!window.confirm("El sorteo se guardará una sola vez. ¿Continuar?"))
      return;
    const result = await run(
      () => api.drawActivity(activityId),
      "Sorteo realizado y notificaciones procesadas.",
    );
    if (result?.whatsapp?.length) setWhatsappLinks(result.whatsapp);
  };
  const retry = async () => {
    const result = await run(
      () => api.retryNotifications(activityId),
      "Notificaciones pendientes reintentadas.",
    );
    if (result?.whatsapp?.length) setWhatsappLinks(result.whatsapp);
    if (result?.failedCount) {
      setNotice("");
      setError(
        result.failureCode === "resend_test_sender"
          ? "Resend rechazó el correo: el remitente de prueba solo puede escribir al correo propietario de la cuenta. Para enviar a invitados debes verificar un dominio en Resend y usarlo como remitente."
          : `El proveedor volvió a rechazar ${result.failedCount} correo${result.failedCount === 1 ? "" : "s"}. No se modificó el sorteo; puedes volver a intentar cuando el servicio esté disponible.`,
      );
    }
  };
  const complete = () => {
    if (
      !window.confirm(
        "¿Marcar esta actividad como terminada? El sorteo y sus asignaciones se conservarán sin cambios.",
      )
    )
      return;
    run(
      () => api.completeActivity(activityId),
      "Actividad marcada como terminada.",
    );
  };
  const ownParticipant = activity?.participants?.find(
    (p) => Number(p.user_id) === Number(current?.id),
  );
  const saveExclusions = () =>
    run(
      () => api.setExclusions(activityId, ownParticipant.id, form.exclusions),
      "Exclusiones guardadas.",
    );
  const saveNumbers = () =>
    run(
      () =>
        api.setNumbers(
          activityId,
          Object.entries(form.numbers)
            .filter(([, number]) => number !== "" && number != null)
            .map(([participantId, number]) => ({
              participantId: Number(participantId),
              number: Number(number),
            })),
        ),
      "Números guardados.",
    );
  const invite = async (participant) => {
    const result = await run(
      () => api.inviteGuest(activityId, participant.id),
      `Invitación para ${participant.name} enviada.`,
    );
    if (result?.emailStatus === "failed") {
      setNotice("");
      setError(
        "La invitación quedó creada, pero Resend no pudo enviar el correo. El remitente de prueba solo permite enviar al correo propietario de la cuenta; para otros correos debes verificar un dominio en Resend.",
      );
    }
    if (result?.whatsappUrl)
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Box className="mv-page">
      <Box sx={{ maxWidth: 1180, mx: "auto", p: { xs: 2, md: 4 } }}>
        {!activityId ? (
          <Box className="mv-page-intro">
            <Typography component="h1">Actividades para compartir</Typography>
            <Typography component="p">
              Organiza sorteos, ventas y recaudos con participantes propios.
            </Typography>
          </Box>
        ) : (
          <Box className="mv-page-banner">
            <Box>
              <Typography component="h1">
                {labels[activity?.type] || "Actividad"}
              </Typography>
              <Typography component="p">{activity?.name}</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/activities")}
            >
              Volver
            </Button>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {notice && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setNotice("")}
          >
            {notice}
          </Alert>
        )}
        {!activityId && (
          <>
            <Paper
              className="mv-page-panel"
              sx={{
                mb: 4,
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography variant="h5" color="accentGreen.dark">
                  Una lista diferente para cada plan
                </Typography>
                <Typography color="text.secondary">
                  Agrega invitados con correo o WhatsApp sin convertirlos en
                  amigos.
                </Typography>
              </Box>
              <Button
                variant="green"
                size="large"
                sx={{ minHeight: 44 }}
                onClick={() => setDialog("create")}
              >
                Nueva actividad
              </Button>
            </Paper>
            <Grid container spacing={3}>
              {items.map((a, index) => (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
                  <Card
                    className={`mv-list-card ${["green", "yellow", "", "lime"][index % 4]}`}
                    sx={{ p: 3 }}
                  >
                    <Chip label={labels[a.type] || a.type} />
                    <Typography variant="h5" sx={{ my: 2 }}>
                      {a.name}
                    </Typography>
                    <Typography>
                      {String(a.event_on || "").slice(0, 10)} ·{" "}
                      {a.status === "draft"
                        ? "En preparación"
                        : a.status === "closed"
                          ? "Conciliada"
                          : "Sorteada"}
                    </Typography>
                    <Button
                      sx={{
                        mt: 3,
                        color: "inherit",
                        borderColor: "currentColor",
                      }}
                      variant="outlined"
                      onClick={() => navigate(`/activities/${a.id}`)}
                    >
                      Abrir actividad
                    </Button>
                  </Card>
                </Grid>
              ))}
              {!items.length && (
                <Grid item xs={12}>
                  <Paper className="mv-page-panel">
                    <Typography align="center" color="text.secondary">
                      Aún no hay actividades. Crea la primera con el botón de
                      arriba.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </>
        )}
        {activityId && activity && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              <b>Registrado en Mi Vaquita · pagado por fuera.</b> La aplicación
              no vende números ni recibe dinero.
            </Alert>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {(fundraising.has(activity.type)
                ? [
                    ["Ingresos", cop(activity.summary?.income || 0)],
                    ["Costos y gastos", cop(activity.summary?.costs || 0)],
                    ["Utilidad neta", cop(activity.summary?.net || 0)],
                  ]
                : [
                    ["Fecha", String(activity.event_on || "").slice(0, 10)],
                    [
                      "Presupuesto sugerido",
                      activity.budget ? cop(activity.budget) : "Sin definir",
                    ],
                    [
                      "Estado",
                      activity.status === "draft"
                        ? "Por sortear"
                        : activity.status === "drawn"
                          ? "Sorteo realizado"
                          : "Cerrada",
                    ],
                  ]
              ).map(([label, value], i) => (
                <Grid item xs={12} sm={4} key={label}>
                  <Card
                    className="mv-summary-card"
                    sx={{ background: ["#cfe8a8", "#f7b9dc", "#fff69c"][i] }}
                  >
                    <Typography>{label}</Typography>
                    <Typography variant="h5" fontWeight={800}>
                      {value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Paper className="mv-page-panel" sx={{ mb: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography variant="h5" color="accentGreen.dark">
                    Participantes
                  </Typography>
                  <Typography color="text.secondary">
                    Los invitados reciben un acceso privado por correo o
                    WhatsApp.
                  </Typography>
                </Box>
                {activity.type === "secret_santa" &&
                  activity.status === "draft" && (
                    <Button variant="contained" disabled={busy} onClick={draw}>
                      Sortear y notificar
                    </Button>
                  )}
              </Stack>
              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                {activity.participants?.map((p) => (
                  <Grid item xs={12} sm={6} md={4} key={p.id}>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid #dcebbd",
                        borderRadius: '14px',
                        background:
                          p.role === "responsible" || p.role === "admin"
                            ? "#f1f7df"
                            : "transparent",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography fontWeight={800}>{p.name}</Typography>
                        {(p.role === "responsible" || p.role === "admin") && (
                          <Chip
                            size="small"
                            color="success"
                            label="Líder de la actividad"
                            sx={{
                              color: "#fff",
                              "& .MuiChip-label": { color: "#fff" },
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {p.user_email ||
                          p.guest_email ||
                          p.phone ||
                          "Sin contacto"}
                      </Typography>
                      {p.guest_id && (
                        <Button
                          size="small"
                          onClick={() => invite(p)}
                          disabled={busy}
                        >
                          Enviar invitación
                        </Button>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {["drawn", "closed"].includes(activity.status) && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 2 }}
                >
                  {activity.notifications?.some(
                    (notification) => notification.status === "failed",
                  ) && (
                    <Button variant="outlined" disabled={busy} onClick={retry}>
                      Reintentar correos fallidos
                    </Button>
                  )}
                  {activity.status === "drawn" &&
                    ["secret_santa", "raffle"].includes(activity.type) &&
                    Number(activity.effective_owner) === Number(current?.id) && (
                      <Button variant="green" disabled={busy} onClick={complete}>
                        Finalizar actividad
                      </Button>
                    )}
                </Stack>
              )}
              {activity.status === "closed" && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Esta actividad está terminada. El resultado quedó guardado y
                  no se volverá a sortear.
                </Alert>
              )}
              {whatsappLinks.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography fontWeight={800} sx={{ mb: 1 }}>
                    Mensajes listos para enviar manualmente
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    flexWrap="wrap"
                    gap={1}
                  >
                    {whatsappLinks.map((link, index) => (
                      <Stack
                        key={`${link.participantId}-${index}`}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                      >
                        <Button
                          variant="outlined"
                          href={link.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir WhatsApp {index + 1}
                        </Button>
                        <Button
                          color="success"
                          onClick={() =>
                            run(
                              () =>
                                api.markNotificationManualSent(
                                  activityId,
                                  link.notificationId,
                                ),
                              "Envío manual confirmado.",
                            ).then((result) => {
                              if (result)
                                setWhatsappLinks((items) =>
                                  items.filter(
                                    (item) =>
                                      item.notificationId !==
                                      link.notificationId,
                                  ),
                                );
                            })
                          }
                        >
                          Marcar enviado
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                </Alert>
              )}
            </Paper>
            {activity.type === "secret_santa" &&
              activity.status === "draft" &&
              ownParticipant && (
                <Paper className="mv-page-panel" sx={{ mb: 3 }}>
                  <Typography variant="h5" color="accentGreen.dark">
                    Mis exclusiones
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Marca personas que no deben tocarte en el sorteo.
                  </Typography>
                  {activity.participants
                    .filter((p) => p.id !== ownParticipant.id)
                    .map((p) => (
                      <Box
                        component="label"
                        key={p.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          py: 0.5,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.exclusions.includes(p.id)}
                          onChange={(e) =>
                            change(
                              "exclusions",
                              e.target.checked
                                ? [...form.exclusions, p.id]
                                : form.exclusions.filter((id) => id !== p.id),
                            )
                          }
                        />
                        <span>{p.name}</span>
                      </Box>
                    ))}
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    disabled={busy}
                    onClick={saveExclusions}
                  >
                    Guardar exclusiones
                  </Button>
                </Paper>
              )}
            {activity.type === "raffle" && (
              <Paper className="mv-page-panel" sx={{ mb: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h5" color="accentGreen.dark">
                      Números de la rifa
                    </Typography>
                    <Typography color="text.secondary">
                      Solo participan números asignados y no se cobran en la
                      app.
                    </Typography>
                  </Box>
                  {activity.status === "draft" && (
                    <Button variant="contained" onClick={draw} disabled={busy}>
                      Sortear ganador
                    </Button>
                  )}
                </Stack>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {activity.participants.map((p) => (
                    <Grid item xs={12} sm={6} md={4} key={p.id}>
                      <TextField
                        size="small"
                        type="number"
                        label={p.name}
                        disabled={activity.status !== "draft"}
                        value={form.numbers[p.id] ?? p.number ?? ""}
                        onChange={(e) =>
                          change("numbers", {
                            ...form.numbers,
                            [p.id]: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
                {activity.status === "draft" && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={saveNumbers}
                    disabled={busy}
                  >
                    Guardar números
                  </Button>
                )}
                {activity.winner && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Ganó {activity.winner.name} con el número{" "}
                    {activity.winner.number}.
                  </Alert>
                )}
              </Paper>
            )}
            {activity.notifications?.length > 0 && (
              <Paper className="mv-page-panel" sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  color="accentGreen.dark"
                  sx={{ mb: 1 }}
                >
                  Estado de los avisos
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Los correos se envían automáticamente. Los mensajes de
                  WhatsApp quedan preparados para que tú los abras y envíes.
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {activity.notifications.map((n) => (
                    <Chip
                      sx={{
                        color: "#fff",
                        fontWeight: 800,
                        "& .MuiChip-label": { color: "#fff" },
                      }}
                      key={`${n.status}-${n.channel}`}
                      label={`${n.channel === "email" ? "Correo" : "WhatsApp"}: ${n.count} ${n.status === "sent" ? "enviado" : n.status === "manual_sent" ? "enviado manualmente" : n.status === "failed" ? "fallido" : n.status === "prepared" ? "listo para enviar" : "pendiente"}`}
                      color={
                        n.status === "sent"
                          ? "success"
                          : n.status === "failed"
                            ? "error"
                            : "primary"
                      }
                    />
                  ))}
                </Stack>
              </Paper>
            )}
            {fundraising.has(activity.type) && (
              <>
                <Paper className="mv-page-panel" sx={{ mb: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Box>
                      <Typography variant="h5" color="accentGreen.dark">
                        Caja de la actividad
                      </Typography>
                      <Typography color="text.secondary">
                        Registra ingresos, costos y gastos para calcular la
                        utilidad.
                      </Typography>
                    </Box>
                    <Button
                      variant="green"
                      onClick={() => setDialog("transaction")}
                    >
                      Registrar movimiento
                    </Button>
                  </Stack>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {activity.transactions?.map((t) => (
                      <Box
                        key={t.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          borderBottom: "1px solid #e5edcf",
                          py: 1,
                        }}
                      >
                        <Typography>{t.description}</Typography>
                        <Typography fontWeight={800}>
                          {t.kind === "income" ? "+" : "-"} {cop(t.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
                {["sale", "bazaar", "food"].includes(activity.type) && (
                  <Paper className="mv-page-panel" sx={{ mb: 3 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box>
                        <Typography variant="h5" color="accentGreen.dark">
                          Inventario
                        </Typography>
                        <Typography color="text.secondary">
                          Controla existencias, ventas, entradas y pérdidas.
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setDialog("product")}
                      >
                        Agregar producto
                      </Button>
                    </Stack>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {activity.products?.map((p) => (
                        <Grid item xs={12} sm={6} key={p.id}>
                          <Box
                            sx={{
                              p: 2,
                              border: "1px solid #dcebbd",
                              borderRadius: '14px',
                            }}
                          >
                            <Typography fontWeight={800}>{p.name}</Typography>
                            <Typography>
                              Existencias: {p.stock} {p.unit}
                            </Typography>
                            <Typography variant="body2">
                              Costo {cop(p.cost_price)} · Venta{" "}
                              {cop(p.sale_price)}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => {
                                change("productId", p.id);
                                setDialog("movement");
                              }}
                            >
                              Registrar movimiento
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
                {fundraising.has(activity.type) && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={busy || activity.status === "closed"}
                    onClick={() =>
                      window.confirm("¿Conciliar y cerrar esta actividad?") &&
                      run(
                        () => api.reconcileActivity(activityId),
                        "Actividad conciliada.",
                      )
                    }
                  >
                    Conciliar actividad
                  </Button>
                )}
              </>
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
                create: "Nueva actividad",
                transaction: "Registrar movimiento",
                product: "Agregar producto",
                movement: "Movimiento de inventario",
              }[dialog]
            }
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialog === "create" && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Primero completa los datos del plan y después selecciona
                    quiénes participan.
                  </Typography>
                  <TextField
                    select
                    label="Tipo de actividad"
                    value={form.type}
                    onChange={(e) => change("type", e.target.value)}
                  >
                    {Object.entries(labels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    required
                    label="Nombre de la actividad"
                    value={form.name}
                    onChange={(e) => change("name", e.target.value)}
                  />
                  <TextField
                    required
                    label="Fecha"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.eventOn}
                    onChange={(e) => change("eventOn", e.target.value)}
                  />
                  <TextField
                    label="Presupuesto orientativo (COP)"
                    type="number"
                    value={form.budget}
                    onChange={(e) => change("budget", e.target.value)}
                  />
                  <TextField
                    label="Descripción (opcional)"
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                  />
                  <TextField
                    select
                    label="Vincular una natillera (opcional)"
                    value={form.natilleraId}
                    onChange={(e) => change("natilleraId", e.target.value)}
                    helperText="Al elegirla, todas las personas registradas de esa natillera se agregan automáticamente."
                  >
                    <MenuItem value="">Actividad independiente</MenuItem>
                    {natilleras.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                        Marca únicamente a quienes participarán en esta
                        actividad.
                      </Typography>
                      {friends.map((friend) => (
                        <FormControlLabel
                          key={friend.friend_user_id}
                          control={
                            <Checkbox
                              checked={form.registeredIds.includes(
                                friend.friend_user_id,
                              )}
                              onChange={(e) =>
                                change(
                                  "registeredIds",
                                  e.target.checked
                                    ? [
                                        ...form.registeredIds,
                                        friend.friend_user_id,
                                      ]
                                    : form.registeredIds.filter(
                                        (id) => id !== friend.friend_user_id,
                                      ),
                                )
                              }
                            />
                          }
                          label={friend.name}
                        />
                      ))}
                    </Box>
                  )}
                  <GuestFields
                    value={form.guests}
                    onChange={(value) => change("guests", value)}
                  />
                  <TextField
                    select
                    label="Persona líder de la actividad"
                    value={form.leaderKey}
                    onChange={(e) => change("leaderKey", e.target.value)}
                    helperText="Será la persona visible como responsable de coordinar el plan."
                  >
                    <MenuItem value="self">Yo organizaré la actividad</MenuItem>
                    {natilleraMembers
                      .filter(
                        (member) => Number(member.id) !== Number(current?.id),
                      )
                      .map((member) => (
                        <MenuItem
                          key={`natillera-${member.id}`}
                          value={`user:${member.id}`}
                        >
                          {member.name} · natillera
                        </MenuItem>
                      ))}
                    {friends
                      .filter((friend) =>
                        form.registeredIds.includes(friend.friend_user_id),
                      )
                      .map((friend) => (
                        <MenuItem
                          key={friend.friend_user_id}
                          value={`user:${friend.friend_user_id}`}
                        >
                          {friend.name}
                        </MenuItem>
                      ))}
                    {form.guests.map((guest, index) =>
                      guest.name.trim() ? (
                        <MenuItem key={index} value={`guest:${index}`}>
                          {guest.name}
                        </MenuItem>
                      ) : null,
                    )}
                  </TextField>
                </>
              )}
              {dialog === "transaction" && (
                <>
                  <TextField
                    select
                    label="Tipo"
                    value={form.kind}
                    onChange={(e) => change("kind", e.target.value)}
                  >
                    <MenuItem value="income">Ingreso</MenuItem>
                    <MenuItem value="cost">Costo</MenuItem>
                    <MenuItem value="expense">Gasto</MenuItem>
                    <MenuItem value="adjustment">Ajuste positivo</MenuItem>
                  </TextField>
                  <TextField
                    label="Concepto"
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                  />
                  <TextField
                    label="Valor (COP)"
                    type="number"
                    value={form.amount}
                    onChange={(e) => change("amount", e.target.value)}
                  />
                  <TextField
                    label="Enlace del comprobante (opcional)"
                    value={form.receiptUrl}
                    onChange={(e) => change("receiptUrl", e.target.value)}
                  />
                </>
              )}
              {dialog === "product" && (
                <>
                  <TextField
                    label="Producto"
                    value={form.productName}
                    onChange={(e) => change("productName", e.target.value)}
                  />
                  <TextField
                    label="Unidad"
                    value={form.unit}
                    onChange={(e) => change("unit", e.target.value)}
                  />
                  <TextField
                    label="Cantidad inicial"
                    type="number"
                    value={form.initialQuantity}
                    onChange={(e) => change("initialQuantity", e.target.value)}
                  />
                  <TextField
                    label="Costo unitario"
                    type="number"
                    value={form.costPrice}
                    onChange={(e) => change("costPrice", e.target.value)}
                  />
                  <TextField
                    label="Precio de venta"
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => change("salePrice", e.target.value)}
                  />
                </>
              )}
              {dialog === "movement" && (
                <>
                  <TextField
                    select
                    label="Movimiento"
                    value={form.movementKind}
                    onChange={(e) => change("movementKind", e.target.value)}
                  >
                    <MenuItem value="entry">Entrada</MenuItem>
                    <MenuItem value="sale">Venta</MenuItem>
                    <MenuItem value="loss">Pérdida</MenuItem>
                    <MenuItem value="adjustment">Ajuste</MenuItem>
                  </TextField>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => change("quantity", e.target.value)}
                  />
                  <TextField
                    label="Valor unitario (opcional)"
                    type="number"
                    value={form.unitPrice}
                    onChange={(e) => change("unitPrice", e.target.value)}
                  />
                  <TextField
                    label="Nota"
                    value={form.note}
                    onChange={(e) => change("note", e.target.value)}
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog("")}>Cancelar</Button>
            <Button
              variant="contained"
              disabled={busy}
              onClick={
                dialog === "create"
                  ? create
                  : dialog === "transaction"
                    ? addTransaction
                    : dialog === "product"
                      ? addProduct
                      : addMovement
              }
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
