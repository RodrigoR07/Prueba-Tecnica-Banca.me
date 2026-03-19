import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Typography, Button, Stack, Stepper,
  Step, StepLabel, Paper, TextField, Checkbox, FormControlLabel,
  Alert, Divider, Fade, CircularProgress, InputAdornment,
  Grid, Chip, Link,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { identityService } from '../services/identityService';
import { leadService } from '../services/leadService';
import { emailService } from '../services/emailService';

const STEPS = ['Bienvenida', 'Verificar RUT', 'ClaveÚnica', 'Tu información', 'Confirmación'];

const AMOUNTS = [
  { label: '$500.000',   value: 500000   },
  { label: '$1.000.000', value: 1000000  },
  { label: '$3.000.000', value: 3000000  },
  { label: '$5.000.000', value: 5000000  },
];

// ── Helpers ──────────────────────────────────────────────────
function StepHeader({ title, subtitle }) {
  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
  );
}

function FileUploadField({ label, hint, onChange }) {
  const [fileName, setFileName] = useState('');
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{label}</Typography>
      <Box
        component="label"
        sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          border: '1.5px dashed', borderColor: 'divider',
          borderRadius: 2, p: 2, cursor: 'pointer',
          bgcolor: '#FAFAF8', transition: 'border-color 0.15s',
          '&:hover': { borderColor: 'primary.main' },
        }}
      >
        <UploadFileOutlinedIcon sx={{ color: 'text.secondary' }} />
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fileName || 'Seleccionar archivo'}
          </Typography>
          <Typography variant="caption" color="text.secondary">{hint}</Typography>
        </Box>
        <input
          type="file"
          hidden
          accept=".pdf,.jpg,.png"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) { setFileName(file.name); onChange(file); }
          }}
        />
      </Box>
    </Box>
  );
}

// ── Steps ─────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(false);

  const handleNext = () => {
    if (!accepted) { setError(true); return; }
    onNext();
  };

  return (
    <Fade in>
      <Box>
        <StepHeader
          title="¡Hola! Estás a punto de comenzar"
          subtitle=""
        />

        <Box sx={{ bgcolor: '#F5F3EF', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3 }}>
          <Typography variant="body1" fontWeight={600} gutterBottom>
            Solicitud de crédito responsable
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            Estás a punto de comenzar una solicitud de un crédito responsable con nosotros.
            Te pediremos algunos datos para evaluar tu situación, como tu <strong>RUT</strong>,
            tu <strong>última liquidación de sueldo</strong> y finalmente tu{' '}
            <strong>ClaveÚnica</strong>, o tus <strong>últimas 12 cotizaciones de AFP</strong>.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3 }}>
          <Typography variant="body2" fontWeight={700} color="text.secondary"
            sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
            Términos y condiciones
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ mb: 2 }}>
            Al continuar, autorizas a <strong>banca.me</strong> a consultar tu historial crediticio,
            deudas asociadas a tu RUT y demás antecedentes financieros necesarios para la evaluación
            de tu solicitud, todo conforme a la Ley N° 19.628 sobre Protección de Datos Personales.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(e) => { setAccepted(e.target.checked); setError(false); }}
                sx={{ '&.Mui-checked': { color: 'primary.main' } }}
              />
            }
            label={
              <Typography variant="body2">
                Acepto los{' '}
                <Link href="#" underline="hover" fontWeight={600}>términos y condiciones</Link>
                {' '}y{' '}
                <Link href="#" underline="hover" fontWeight={600}>política de privacidad</Link>
                , lo que incluye la consulta de cuentas y deudas asociadas a mi RUT.
              </Typography>
            }
          />
          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Por favor acepta los términos y condiciones y la política de privacidad.
            </Typography>
          )}
        </Box>

        <Stack spacing={2}>
        <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            sx={{ py: 1.5 }}
        >
            Comenzar
        </Button>
        <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<ArrowBackIcon />}
            sx={{ py: 1.5, borderColor: 'divider', color: 'text.primary' }}
        >
            Volver al inicio
        </Button>
        </Stack>
      </Box>
    </Fade>
  );
}

function StepRut({ onNext, onBack, setVerifiedRut }) {
  const [rut, setRut] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!rut.trim()) { setError('Ingresa tu RUT'); return; }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await identityService.checkRut(rut);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!result?.qualifies) return;
    setVerifiedRut(rut);
    onNext();
  };

  return (
    <Fade in>
      <Box>
        <StepHeader
          title="Verificación de identidad"
          subtitle="Ingresa tu RUT para comprobar que pre-calificas para un crédito responsable."
        />

        <Stack spacing={2.5}>
          <TextField
            label="RUT"
            fullWidth
            placeholder="12345678-9"
            value={rut}
            onChange={(e) => { setRut(e.target.value); setResult(null); }}
            error={!!error}
            helperText={error || 'Formato: 12345678-9'}
            InputProps={{
              startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon fontSize="small" /></InputAdornment>,
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
          />

          <Button
            variant="outlined"
            onClick={handleCheck}
            disabled={loading}
            sx={{ borderColor: 'divider', color: 'text.primary', py: 1.2 }}
            startIcon={loading ? <CircularProgress size={16} /> : <VerifiedUserOutlinedIcon />}
          >
            {loading ? 'Verificando...' : 'Verificar RUT'}
          </Button>

          {result && (
            <Alert
              severity={result.qualifies ? 'success' : 'error'}
              sx={{ borderRadius: 2 }}
              icon={result.qualifies ? <CheckCircleOutlineIcon fontSize="small" /> : undefined}
            >
              {result.message}
            </Alert>
          )}

          {/* hint demo */}
          <Box sx={{ bgcolor: '#F5F3EF', borderRadius: 2, p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Demo:</strong> RUTs válidos: 12345678-9 · 11111111-1 · 15000000-0
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            disabled={!result?.qualifies}
            sx={{ flex: 1, py: 1.5 }}
          >
            Continuar
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
}

function StepClave({ onNext, onBack, verifiedRut }) {
  const [clave, setClave] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tcError, setTcError] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!accepted) { setTcError(true); return; }
    if (!clave.trim()) { setError('Ingresa tu ClaveÚnica'); return; }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await identityService.verifyClave(verifiedRut, clave);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in>
      <Box>
        <StepHeader
          title="Verificación con ClaveÚnica"
          subtitle="Usaremos tu ClaveÚnica para obtener tu información financiera desde SII, AFC y SUSESO."
        />

        <Stack spacing={3}>
          {/* Autorización */}
          <Box sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
            <Typography variant="body2" fontWeight={700} color="text.secondary"
              sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
              Autorización de uso
            </Typography>
            <Stack spacing={1} mb={2}>
              {[
                { icon: '🏛️', label: 'SII', desc: 'Servicio de Impuestos Internos — situación tributaria' },
                { icon: '📊', label: 'AFC', desc: 'Administradora de Fondos de Cesantía — historial laboral' },
                { icon: '🏥', label: 'SUSESO', desc: 'Superintendencia de Seguridad Social — cotizaciones' },
              ].map((s) => (
                <Stack key={s.label} direction="row" alignItems="center" gap={1.5} py={0.5}>
                  <Typography fontSize={18}>{s.icon}</Typography>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{s.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.desc}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => { setAccepted(e.target.checked); setTcError(false); }}
                  sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                />
              }
              label={
                <Typography variant="body2">
                  Autorizo el uso de mi ClaveÚnica para ingresar al SII, AFC y SUSESO con el
                  fin exclusivo de evaluar mi solicitud de crédito.
                </Typography>
              }
            />
            {tcError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                Debes autorizar el uso de la ClaveÚnica para continuar.
              </Typography>
            )}
          </Box>

          <TextField
            label="ClaveÚnica"
            fullWidth
            type="password"
            placeholder="Ingresa tu ClaveÚnica"
            value={clave}
            onChange={(e) => { setClave(e.target.value); setResult(null); setError(''); }}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
            }}
          />

          <Button
            variant="outlined"
            onClick={handleVerify}
            disabled={loading}
            sx={{ borderColor: 'divider', color: 'text.primary', py: 1.2 }}
            startIcon={loading ? <CircularProgress size={16} /> : <VerifiedUserOutlinedIcon />}
          >
            {loading ? 'Verificando...' : 'Verificar ClaveÚnica'}
          </Button>

          {result && (
            <Alert severity={result.valid ? 'success' : 'error'} sx={{ borderRadius: 2 }}>
              {result.message}
            </Alert>
          )}

          {/* hint demo */}
          <Box sx={{ bgcolor: '#F5F3EF', borderRadius: 2, p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Demo:</strong> RUT 12345678-9 → clave: 1234 · RUT 11111111-1 → clave: 0000
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onNext}
            disabled={!result?.valid}
            sx={{ flex: 1, py: 1.5 }}
          >
            Continuar
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
}

function StepForm({ onNext, onBack, verifiedRut }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [liquidacion, setLiquidacion] = useState(null);
  const [cotizaciones, setCotizaciones] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount) return;
    setSubmitting(true);
    try {
      const lead = await leadService.create({
        ...data,
        rut: verifiedRut,
        amount,
        income: Number(data.income),
        expenses: Number(data.expenses),
        debts: Number(data.debts),
        hasLiquidacion: !!liquidacion,
        hasCotizaciones: !!cotizaciones,
      });
      await emailService.sendConfirmationEmail(lead);
      onNext();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fade in>
      <Box>
        <StepHeader
          title="Tu información"
          subtitle="Completa tus datos personales y financieros para continuar con tu solicitud."
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>

            {/* Datos personales */}
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
                Datos personales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre completo"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon fontSize="small" /></InputAdornment> }}
                    {...register('name', { required: 'El nombre es obligatorio' })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Correo electrónico"
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment> }}
                    {...register('email', {
                      required: 'El correo es obligatorio',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' },
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment> }}
                    {...register('phone', { required: 'El teléfono es obligatorio' })}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Datos financieros */}
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
                Datos financieros
              </Typography>
              <Grid container spacing={2}>
                {[
                  { name: 'income',   label: 'Ingresos mensuales',  helper: 'CLP / mes' },
                  { name: 'expenses', label: 'Gastos mensuales',     helper: 'CLP / mes' },
                  { name: 'debts',    label: 'Deudas actuales',      helper: 'Total deuda vigente en CLP' },
                ].map(({ name, label, helper }) => (
                  <Grid item xs={12} sm={4} key={name}>
                    <TextField
                      label={label}
                      fullWidth
                      type="number"
                      error={!!errors[name]}
                      helperText={errors[name] ? 'Campo obligatorio' : helper}
                      InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment> }}
                      {...register(name, { required: true, min: 0 })}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider />

            {/* Monto */}
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
                Monto solicitado (CLP)
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {AMOUNTS.map((a) => (
                  <Grid item xs={6} sm={3} key={a.value}>
                    <Box
                      onClick={() => { setSelectedAmount(a.value); setCustomAmount(''); setValue('amount', a.value); }}
                      sx={{
                        border: '1.5px solid',
                        borderColor: selectedAmount === a.value ? 'primary.main' : 'divider',
                        borderRadius: 2, p: 1.5, textAlign: 'center', cursor: 'pointer',
                        bgcolor: selectedAmount === a.value ? 'primary.main' : 'transparent',
                        color: selectedAmount === a.value ? 'white' : 'text.primary',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>{a.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <TextField
                label="Otro monto"
                fullWidth
                type="number"
                value={customAmount}
                InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment> }}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomAmount(val);
                  setSelectedAmount(null);
                  setValue('amount', val ? Number(val) : null);
                }}
              />
              {!selectedAmount && !customAmount && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  Selecciona o ingresa un monto
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Documentos */}
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary"
                sx={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em', mb: 2 }}>
                Documentos
              </Typography>
              <Stack spacing={2}>
                <FileUploadField
                  label="Última liquidación de sueldo"
                  hint="PDF, JPG o PNG · máx. 5 MB"
                  onChange={setLiquidacion}
                />
                <FileUploadField
                  label="Últimas 12 cotizaciones de AFP"
                  hint="PDF, JPG o PNG · máx. 5 MB"
                  onChange={setCotizaciones}
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} pt={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{ borderColor: 'divider', color: 'text.primary' }}
              >
                Volver
              </Button>
              <Button
                type="submit"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                disabled={submitting || (!selectedAmount && !customAmount)}
                sx={{ flex: 1, py: 1.5 }}
              >
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
}

function StepDone() {
  const navigate = useNavigate();
  return (
    <Fade in>
      <Box textAlign="center" py={4}>
        <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          ¡Solicitud enviada!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 420, mx: 'auto' }}>
          Recibimos tu solicitud. Uno de nuestros colaboradores revisará tu información
          y te contactará en las próximas <strong>24 horas hábiles</strong>.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 420, mx: 'auto' }}>
          Recibirás un correo con el resultado de tu evaluación crediticia.
        </Typography>
        <Box sx={{ bgcolor: '#F5F3EF', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 4, maxWidth: 380, mx: 'auto', textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>¿Qué sigue?</Typography>
          {[
            '📞 Un colaborador te llamará para confirmar tus datos',
            '📊 Evaluaremos tu perfil crediticio',
            '📧 Recibirás el resultado por correo',
            '✍️ Si es aprobado, firmarás el contrato digitalmente',
          ].map((s, i) => (
            <Typography key={i} variant="body2" sx={{ mt: 1 }}>{s}</Typography>
          ))}
        </Box>
        <Button variant="contained" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Box>
    </Fade>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function CreditApplication() {
  const [activeStep, setActiveStep] = useState(0);
  const [verifiedRut, setVerifiedRut] = useState('');

  const next = () => setActiveStep(s => s + 1);
  const back = () => setActiveStep(s => s - 1);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navbar */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', px: 4, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5" fontWeight={700} color="primary"
            component={RouterLink} to="/" sx={{ textDecoration: 'none' }}
          >
            banca.me
          </Typography>
          <Chip label="Solicitud de crédito" size="small" sx={{ bgcolor: '#F5F3EF', fontWeight: 600 }} />
        </Stack>
      </Box>

      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
        {/* Stepper */}
        {activeStep < 4 && (
          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { fontSize: '0.72rem', fontWeight: 600 },
                    '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                    '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, md: 5 } }}>
          {activeStep === 0 && <StepWelcome onNext={next} />}
          {activeStep === 1 && <StepRut onNext={next} onBack={back} setVerifiedRut={setVerifiedRut} />}
          {activeStep === 2 && <StepClave onNext={next} onBack={back} verifiedRut={verifiedRut} />}
          {activeStep === 3 && <StepForm onNext={next} onBack={back} verifiedRut={verifiedRut} />}
          {activeStep === 4 && <StepDone />}
        </Paper>
      </Container>
    </Box>
  );
}