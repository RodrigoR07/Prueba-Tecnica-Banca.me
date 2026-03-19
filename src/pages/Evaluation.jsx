import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Typography, Button, Stack, Chip,
  Grid, Alert, Skeleton, Paper, TextField,
  Divider, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Stepper,
  Step, StepLabel, Collapse, InputAdornment,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Layout from '../components/Layout';
import ScoreGauge from '../components/ScoreGauge';
import { leadService } from '../services/leadService';
import { evaluationService } from '../services/evaluationService';
import { contractService } from '../services/contractService';
import { emailService } from '../services/emailService';
import { evaluateCredit } from '../utils/creditEngine';

const STEPS = ['Datos financieros', 'Análisis automático', 'Confirmación colaborador', 'Resultado'];

function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1} gap={4}>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'right' }}>{value}</Typography>
    </Stack>
  );
}

export default function Evaluation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [evalResult, setEvalResult] = useState(null);
  const [editingFinancials, setEditingFinancials] = useState(false);
  const [financials, setFinancials] = useState(null);
  const [decision, setDecision] = useState(null);         // 'approved' | 'rejected'
  const [confirmDialog, setConfirmDialog] = useState(null); // 'approved' | 'rejected' | null
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    leadService.getById(id)
      .then(data => {
        setLead(data);
        if (data.income) {
          const fin = { income: data.income, expenses: data.expenses, debts: data.debts, amount: data.amount };
          setFinancials(fin);
          const result = evaluateCredit(fin);
          setEvalResult(result);
          setActiveStep(1);
        }
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Paso 1: guardar/editar financieros
  const onSubmitFinancials = (data) => {
    const fin = {
      income: Number(data.income),
      expenses: Number(data.expenses),
      debts: Number(data.debts),
      amount: lead.amount,
    };
    setFinancials(fin);
    setEvalResult(evaluateCredit(fin));
    setEditingFinancials(false);
    setActiveStep(1);
  };

  // Paso 2 → 3: el colaborador revisa y confirma
  const handleConfirmDecision = async () => {
    setSending(true);
    try {
      await evaluationService.save(id, evalResult, '', decision);
      await leadService.updateStatus(id, decision === 'approved' ? 'aprobado' : 'rechazado');

      if (decision === 'approved') {
        const contract = await contractService.generate(lead, evalResult);
        await emailService.sendContractEmail({ ...lead, contract });
        await leadService.updateStatus(id, 'contrato_enviado');
      } else {
        await emailService.sendRejectionEmail(lead);
      }

      setActiveStep(3);
      setDone(true);
    } finally {
      setSending(false);
      setConfirmDialog(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
        </Container>
      </Layout>
    );
  }

  // ── PASO FINAL ──────────────────────────────────────────────
  if (done) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Box textAlign="center">
            {decision === 'approved'
              ? <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
              : <CancelOutlinedIcon sx={{ fontSize: 72, color: 'error.main', mb: 2 }} />}
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {decision === 'approved' ? '¡Crédito aprobado!' : 'Crédito rechazado'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {decision === 'approved'
                ? `Se envió el contrato digital a `
                : `Se envió la notificación de rechazo a `}
              <strong>{lead.email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {decision === 'approved'
                ? 'El cliente deberá firmarlo para activar el desembolso.'
                : 'El cliente fue informado de los motivos y puede volver a solicitar en 90 días.'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 5 }}>

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Evaluación crediticia</Typography>
            <Typography variant="body2" color="text.secondary">{lead?.name}</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/leads/${id}`)}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            size="small"
          >
            Volver
          </Button>
        </Stack>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': { fontSize: '0.78rem', fontWeight: 600 },
                  '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                  '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ── STEP 0: Datos financieros ─────────────────────── */}
        {(activeStep === 0 || editingFinancials) && (
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700}>Datos financieros del cliente</Typography>
              {editingFinancials && (
                <Button size="small" onClick={() => { setEditingFinancials(false); reset(); }}>
                  Cancelar
                </Button>
              )}
            </Stack>
            <Box component="form" onSubmit={handleSubmit(onSubmitFinancials)}>
              <Grid container spacing={2.5}>
                {[
                  { name: 'income',   label: 'Ingresos mensuales',  defaultValue: financials?.income   },
                  { name: 'expenses', label: 'Gastos mensuales',     defaultValue: financials?.expenses },
                  { name: 'debts',    label: 'Deudas actuales',      defaultValue: financials?.debts    },
                ].map(({ name, label, defaultValue }) => (
                  <Grid item xs={12} sm={4} key={name}>
                    <TextField
                      label={label}
                      fullWidth
                      type="number"
                      defaultValue={defaultValue || ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors[name]}
                      helperText={errors[name] ? 'Campo obligatorio' : 'CLP / mes'}
                      {...register(name, { required: true, min: 0 })}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: '#FAFAF8', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Monto solicitado:</strong> ${lead?.amount?.toLocaleString('es-CL')} CLP
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" startIcon={<AssessmentOutlinedIcon />}>
                    Analizar crédito
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        {/* ── STEP 1 + 2: Análisis + Confirmación ─────────── */}
        {activeStep >= 1 && !editingFinancials && evalResult && (
          <Stack spacing={3}>

            {/* Score y métricas */}
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Typography variant="h6" fontWeight={700}>Resultado del análisis automático</Typography>
                <Button
                  size="small"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => { setEditingFinancials(true); reset(financials); }}
                  sx={{ color: 'text.secondary' }}
                >
                  Editar datos
                </Button>
              </Stack>

              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ScoreGauge score={evalResult.score} />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Stack spacing={0.5} divider={<Divider />}>
                    <InfoRow label="Ingreso mensual"    value={`$${financials.income.toLocaleString('es-CL')}`} />
                    <InfoRow label="Gastos mensuales"   value={`$${financials.expenses.toLocaleString('es-CL')} (${evalResult.expenseRatio}%)`} />
                    <InfoRow label="Deudas actuales"    value={`$${financials.debts.toLocaleString('es-CL')}`} />
                    <InfoRow label="Ratio DTI"          value={`${evalResult.dti}%`} />
                    <InfoRow label="Ingreso neto disp." value={`$${evalResult.netIncome.toLocaleString('es-CL')}`} />
                    <InfoRow label="Cuota estimada"     value={`$${evalResult.monthlyPayment.toLocaleString('es-CL')} / mes`} />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Alertas del motor */}
            <Collapse in={evalResult.reasons.length > 0 || evalResult.warnings.length > 0}>
              <Stack spacing={1.5}>
                {evalResult.reasons.map((r, i) => (
                  <Alert key={i} severity="error" sx={{ borderRadius: 2 }}
                    icon={<CancelOutlinedIcon fontSize="small" />}>
                    {r}
                  </Alert>
                ))}
                {evalResult.warnings.map((w, i) => (
                  <Alert key={i} severity="warning" sx={{ borderRadius: 2 }}
                    icon={<WarningAmberOutlinedIcon fontSize="small" />}>
                    {w}
                  </Alert>
                ))}
              </Stack>
            </Collapse>

            {/* Recomendación automática */}
            <Alert
              severity={evalResult.approved ? 'success' : 'error'}
              sx={{ borderRadius: 2 }}
              icon={evalResult.approved
                ? <CheckCircleOutlineIcon fontSize="small" />
                : <CancelOutlinedIcon fontSize="small" />}
            >
              <Typography variant="body2" fontWeight={600}>
                Recomendación automática:{' '}
                {evalResult.approved
                  ? `Aprobar crédito. Score ${evalResult.score}/100 — ${evalResult.scoreLabel.label}.`
                  : `Rechazar crédito. Score ${evalResult.score}/100 — ${evalResult.scoreLabel.label}.`}
              </Typography>
            </Alert>

            {/* ── STEP 2: Decisión del colaborador ─────────── */}
            {activeStep >= 1 && (
              <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Confirmación del colaborador
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  El análisis automático es una recomendación. La decisión final es tuya.
                  Al confirmar, se enviará un correo automático al cliente.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => { setDecision('approved'); setConfirmDialog('approved'); }}
                    sx={{ flex: 1, py: 1.5 }}
                  >
                    Aprobar y enviar contrato
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={() => { setDecision('rejected'); setConfirmDialog('rejected'); }}
                    sx={{ flex: 1, py: 1.5 }}
                  >
                    Rechazar crédito
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>
        )}

        {/* ── Dialog de confirmación ────────────────────────── */}
        <Dialog
          open={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle fontWeight={700}>
            {confirmDialog === 'approved' ? '¿Aprobar este crédito?' : '¿Rechazar este crédito?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDialog === 'approved'
                ? `Se generará un contrato digital y se enviará a ${lead?.email}. El cliente deberá firmarlo para activar el desembolso.`
                : `Se enviará una notificación de rechazo a ${lead?.email} con los motivos correspondientes. Esta acción no se puede deshacer.`}
            </DialogContentText>
            <Box sx={{ bgcolor: '#FAFAF8', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, mt: 2 }}>
              <Typography variant="body2">
                <strong>Cliente:</strong> {lead?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Monto:</strong> ${lead?.amount?.toLocaleString('es-CL')} CLP
              </Typography>
              {confirmDialog === 'approved' && (
                <Typography variant="body2">
                  <strong>Cuota estimada:</strong> ${evalResult?.monthlyPayment?.toLocaleString('es-CL')} / mes · 24 meses
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setConfirmDialog(null)} variant="outlined"
              sx={{ borderColor: 'divider', color: 'text.primary' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDecision}
              variant="contained"
              color={confirmDialog === 'approved' ? 'success' : 'error'}
              disabled={sending}
              startIcon={<SendOutlinedIcon />}
            >
              {sending ? 'Enviando...' : confirmDialog === 'approved' ? 'Confirmar aprobación' : 'Confirmar rechazo'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Layout>
  );
}