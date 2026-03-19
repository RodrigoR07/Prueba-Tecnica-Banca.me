import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Stack, Chip,
  Grid, Divider, Alert, Skeleton, Avatar, Breadcrumbs,
  Link as MuiLink, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import Layout from '../components/Layout';
import { leadService } from '../services/leadService';
import { evaluateCredit } from '../utils/creditEngine';

const STATUS_CONFIG = {
  pendiente:        { label: 'Pendiente',         color: 'default'  },
  en_evaluacion:    { label: 'En evaluación',     color: 'info'     },
  aprobado:         { label: 'Aprobado',           color: 'success'  },
  rechazado:        { label: 'Rechazado',          color: 'error'    },
  contrato_enviado: { label: 'Contrato enviado',   color: 'warning'  },
};

function StatCard({ icon, label, value, sub }) {
  return (
    <Box sx={{ bgcolor: '#FAFAF8', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
        <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </Box>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preEval, setPreEval] = useState(null);

  useEffect(() => {
    leadService.getById(id)
      .then(data => {
        setLead(data);
        // Pre-evaluación automática si tiene datos financieros
        if (data.income) {
          setPreEval(evaluateCredit({
            income: data.income,
            expenses: data.expenses,
            debts: data.debts,
            amount: data.amount,
          }));
        }
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rounded" height={300} sx={{ mt: 3, borderRadius: 3 }} />
        </Container>
      </Layout>
    );
  }

  if (!lead) return null;

  const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.pendiente;
  const initials = lead.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const canEvaluate = ['pendiente', 'en_evaluacion'].includes(lead.status);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 5 }}>

        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component="button"
            underline="hover"
            color="text.secondary"
            variant="body2"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </MuiLink>
          <Typography variant="body2" color="text.primary" fontWeight={600}>{lead.name}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} gap={2} mb={4}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Typography variant="h4" fontWeight={700}>{lead.name}</Typography>
                <Chip label={status.label} color={status.color} size="small" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Lead desde {new Date(lead.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={1.5}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ borderColor: 'divider', color: 'text.primary' }}
              size="small"
            >
              Volver
            </Button>
            {canEvaluate && (
              <Button
                variant="contained"
                startIcon={<AssessmentOutlinedIcon />}
                onClick={() => navigate(`/leads/${id}/evaluation`)}
                size="small"
              >
                Evaluar crédito
              </Button>
            )}
          </Stack>
        </Stack>

        <Grid container spacing={3}>

          {/* Datos de contacto */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, height: '100%' }}>
              <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                Datos de contacto
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Correo</Typography>
                    <Typography variant="body2" fontWeight={600}>{lead.email}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                    <Typography variant="body2" fontWeight={600}>{lead.phone || '—'}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de solicitud</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Datos financieros */}
          <Grid item xs={12} md={8}>
            {lead.income ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<AttachMoneyIcon fontSize="small" />}
                    label="Monto solicitado"
                    value={`$${lead.amount?.toLocaleString('es-CL')}`}
                    sub="CLP"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<AttachMoneyIcon fontSize="small" />}
                    label="Ingresos mensuales"
                    value={`$${lead.income?.toLocaleString('es-CL')}`}
                    sub="CLP / mes"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<TrendingDownIcon fontSize="small" />}
                    label="Gastos mensuales"
                    value={`$${lead.expenses?.toLocaleString('es-CL')}`}
                    sub={`${((lead.expenses / lead.income) * 100).toFixed(1)}% del ingreso`}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<AccountBalanceOutlinedIcon fontSize="small" />}
                    label="Deudas actuales"
                    value={`$${lead.debts?.toLocaleString('es-CL')}`}
                    sub={`DTI: ${((lead.debts / lead.income) * 100).toFixed(1)}%`}
                  />
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ bgcolor: '#FAFAF8', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box textAlign="center">
                  <Typography variant="body1" fontWeight={600} gutterBottom>Sin datos financieros</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Este lead aún no ha entregado su información financiera. Contáctalo para completar la evaluación.
                  </Typography>
                  {/* <Button variant="contained" size="small" startIcon={<PhoneOutlinedIcon />}>
                    Registrar llamada
                  </Button> */}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Pre-evaluación automática */}
          {preEval && canEvaluate && (
            <Grid item xs={12}>
              <Alert
                severity={preEval.approved ? 'success' : 'warning'}
                sx={{ borderRadius: 3 }}
                action={
                  <Button
                    size="small"
                    variant="contained"
                    color={preEval.approved ? 'success' : 'warning'}
                    onClick={() => navigate(`/leads/${id}/evaluation`)}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Ver evaluación completa
                  </Button>
                }
              >
                <Typography variant="body2" fontWeight={600}>
                  Pre-evaluación automática:{' '}
                  {preEval.approved
                    ? `Perfil con score ${preEval.score}/100 (${preEval.scoreLabel.label}). Apto para continuar evaluación.`
                    : `Score ${preEval.score}/100. Se detectaron alertas que requieren revisión.`}
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Estado final */}
          {['aprobado', 'rechazado', 'contrato_enviado'].includes(lead.status) && (
            <Grid item xs={12}>
              <Alert
                severity={lead.status === 'aprobado' || lead.status === 'contrato_enviado' ? 'success' : 'error'}
                sx={{ borderRadius: 3 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {lead.status === 'aprobado' && 'Crédito aprobado. El contrato ha sido enviado al cliente.'}
                  {lead.status === 'contrato_enviado' && 'Contrato enviado. En espera de firma del cliente.'}
                  {lead.status === 'rechazado' && 'Crédito rechazado. Se notificó al cliente por correo.'}
                </Typography>
              </Alert>
            </Grid>
          )}

        </Grid>
      </Container>
    </Layout>
  );
}