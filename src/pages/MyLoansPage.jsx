import React, { useEffect, useMemo, useState } from "react";
import { MILK_BAG_RADIUS } from "../utils/shape";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import * as api from "../services/NatilleraService";
import { formatCurrency as cop } from "../utils/currency";
import "../styles/FeaturePages.css";
import { formatDateCO } from '../utils/date';

const labels = { paid: "Pagada", partial: "Parcial", overdue: "Vencida", pending: "Pendiente" };
const colors = { paid: "success", partial: "warning", overdue: "error", pending: "default" };
const dateText = formatDateCO;

export default function MyLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMyLoans()
      .then(setLoans)
      .catch((e) => setError(e.response?.data?.message || "No pudimos cargar tus préstamos"))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => loans.reduce((acc, loan) => ({
    balance: acc.balance + Number(loan.balance || 0),
    interest: acc.interest + Number(loan.interestPending || 0),
  }), { balance: 0, interest: 0 }), [loans]);

  if (loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 360 }}><CircularProgress /></Box>;

  return (
    <Box className="mv-page">
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
        <Box className="mv-page-intro">
          <Typography component="h1">Mis préstamos</Typography>
          <Typography component="p">Consulta tus cuotas, abonos, capital e intereses sin entrar a la natillera.</Typography>
        </Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Registrado en Mi Vaquita · pagado por fuera.</strong> La aplicación no presta, recibe ni transfiere dinero.
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {!!loans.length && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}><Card sx={{ borderRadius: MILK_BAG_RADIUS, bgcolor: "#cfeaa5", boxShadow: "none" }}><CardContent><Typography>Saldo total pendiente</Typography><Typography variant="h4" fontWeight={800}>{cop(totals.balance)}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} sm={6}><Card sx={{ borderRadius: MILK_BAG_RADIUS, bgcolor: "#fff39a", boxShadow: "none" }}><CardContent><Typography>Intereses pendientes</Typography><Typography variant="h4" fontWeight={800}>{cop(totals.interest)}</Typography></CardContent></Card></Grid>
          </Grid>
        )}
        <Stack spacing={3}>
          {loans.map((loan) => {
            const total = Number(loan.principal) + Number(loan.interest);
            const progress = total ? Math.min(100, Number(loan.repaid) / total * 100) : 0;
            const next = loan.schedule?.find((q) => Number(q.balance) > 0);
            return (
              <Card key={loan.id} sx={{ borderRadius: MILK_BAG_RADIUS, boxShadow: "none", border: "1px solid #d7e6b8" }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="h5" fontWeight={800}>{loan.natillera_name}</Typography>
                        {loan.isExternal && <Chip label="Prestatario externo" color="secondary" size="small" />}
                      </Stack>
                      <Typography color="text.secondary">Otorgado el {dateText(loan.issued_on)} · {loan.term_months} meses · {loan.annual_rate}% anual simple</Typography>
                    </Box>
                    <Box sx={{ textAlign: { xs: "left", sm: "right" } }}><Typography variant="body2">Saldo pendiente</Typography><Typography variant="h5" fontWeight={800}>{cop(loan.balance)}</Typography></Box>
                  </Stack>
                  <LinearProgress variant="determinate" value={progress} sx={{ my: 2, height: 10, borderRadius: '8px' }} />
                  <Grid container spacing={1.5}>
                    {[["Capital inicial", loan.principal], ["Interés estimado del plan", loan.interest], ["Capital pendiente", loan.capitalPending], ["Interés pendiente (real)", loan.interestPending]].map(([label, value]) => (
                      <Grid item xs={6} md={3} key={label}><Box sx={{ bgcolor: "#f5f9e9", borderRadius: '14px', p: 1.5, height: "100%" }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography fontWeight={800}>{cop(value)}</Typography></Box></Grid>
                    ))}
                  </Grid>
                  {next && <Alert severity={next.status === "overdue" ? "warning" : "success"} sx={{ mt: 2 }}>Próxima cuota: <strong>{dateText(next.due_on)}</strong> · pendiente {cop(next.balance)}</Alert>}
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Cronograma</Typography>
                  <Grid container spacing={1}>
                    {loan.schedule?.map((q) => <Grid item xs={12} sm={6} key={q.id}><Box sx={{ border: "1px solid #e2e7d7", borderRadius: '14px', p: 1.5 }}><Stack direction="row" justifyContent="space-between" gap={1}><Box><Typography fontWeight={700}>Cuota {q.installment_number} · {dateText(q.due_on)}</Typography><Typography variant="body2">Capital {cop(q.principal_due)} · interés {cop(q.interest_due)}</Typography></Box><Chip size="small" label={labels[q.status]} color={colors[q.status]} /></Stack><Typography variant="body2" sx={{ mt: 0.5 }}>Pendiente: {cop(q.balance)}</Typography></Box></Grid>)}
                  </Grid>
                  {!!loan.payments?.length && <><Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Abonos registrados</Typography>{loan.payments.map((p) => <Typography key={p.id} variant="body2" sx={{ py: 0.5 }}>{dateText(p.created_at)} · {cop(p.amount)} — capital {cop(p.capital_amount || 0)}, interés {cop(p.interest_amount || 0)}</Typography>)}</>}
                </CardContent>
              </Card>
            );
          })}
          {!loans.length && <Card sx={{ borderRadius: MILK_BAG_RADIUS, boxShadow: "none" }}><CardContent><Typography variant="h5" color="primary">No tienes préstamos registrados</Typography><Typography color="text.secondary">Cuando una natillera te registre un préstamo, aparecerá aquí con sus fechas y movimientos.</Typography></CardContent></Card>}
        </Stack>
      </Box>
    </Box>
  );
}
