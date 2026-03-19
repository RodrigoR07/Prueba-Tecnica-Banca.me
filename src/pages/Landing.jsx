import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Grid,
  InputAdornment, Alert, Fade, Chip, Stack, Divider,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { leadService } from '../services/leadService';
import { emailService } from '../services/emailService';

const FEATURES = [
  { label: 'Respuesta en 24 hrs', icon: '⚡' },
  { label: 'Sin letra chica', icon: '📄' },
  { label: '100% digital', icon: '💻' },
];

const AMOUNTS = [
  { label: '$500.000', value: 500000 },
  { label: '$1.000.000', value: 1000000 },
  { label: '$3.000.000', value: 3000000 },
  { label: '$5.000.000', value: 5000000 },
];

export default function Landing() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const lead = await leadService.create({ ...data, amount: selectedAmount || data.amount });
      await emailService.sendConfirmationEmail(lead);
      setSubmitted(true);
    } catch {
      setError('Hubo un problema al enviar tu solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Fade in>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center' }}>
          <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 3 }} />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                ¡Solicitud recibida!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420, mx: 'auto' }}>
                Uno de nuestros colaboradores revisará tu información y te contactará en las próximas{' '}
                <strong>24 horas hábiles</strong>. Recibirás un correo con el resultado de tu evaluación.
              </Typography>
              <Box sx={{
                bgcolor: '#F5F3EF', border: '1px solid #E8E0D5',
                borderRadius: 3, p: 3, mb: 4,
              }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>¿Qué sigue?</Typography>
                {[
                  '📞 Un colaborador te llamará para verificar tus datos',
                  '📊 Evaluaremos tu perfil crediticio',
                  '📧 Recibirás el resultado por correo',
                ].map((step, i) => (
                  <Typography key={i} variant="body2" sx={{ mt: 1, textAlign: 'left' }}>{step}</Typography>
                ))}
              </Box>
              <Button
                variant="outlined"
                onClick={() => setSubmitted(false)}
                sx={{ borderColor: '#1A1A2E', color: '#1A1A2E' }}
              >
                Volver al inicio
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navbar */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', px: 4, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} color="primary">
            Empresa X
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              size="small"
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Iniciar sesión
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="small"
              sx={{ py: 0.8 }}
            >
              Crear cuenta
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={8} alignItems="center">

          {/* Left: Hero */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Chip
                label="Créditos rápidos y transparentes"
                size="small"
                sx={{ alignSelf: 'flex-start', bgcolor: '#F5F3EF', color: 'text.secondary', fontWeight: 600 }}
              />
              <Typography variant="h2" fontWeight={700} lineHeight={1.15}>
                Tu crédito,<br />
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                  sin complicaciones
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380 }}>
                Accede a financiamiento de manera simple, rápida y completamente digital.
                Sin filas, sin papeleo.
              </Typography>

              <Divider sx={{ borderColor: 'divider' }} />

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {FEATURES.map((f) => (
                  <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontSize={18}>{f.icon}</Typography>
                    <Typography variant="body2" fontWeight={600}>{f.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right: Form */}
          <Grid item xs={12} md={7}>
            <Box sx={{
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 4,
              p: { xs: 3, md: 5 },
            }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Solicita tu crédito
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Completa el formulario y te contactaremos en menos de 24 horas.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5}>

                  <TextField
                    label="Nombre completo"
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon fontSize="small" /></InputAdornment> }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register('name', { required: 'El nombre es obligatorio' })}
                  />

                  <TextField
                    label="Correo electrónico"
                    fullWidth
                    type="email"
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment> }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email', {
                      required: 'El correo es obligatorio',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' },
                    })}
                  />

                  <TextField
                    label="Teléfono"
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment> }}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    {...register('phone', { required: 'El teléfono es obligatorio' })}
                  />

                  {/* Monto rápido */}
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                      ¿Cuánto necesitas? (CLP)
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {AMOUNTS.map((a) => (
                        <Grid item xs={6} key={a.value}>
                          <Box
                            onClick={() => {
                              setSelectedAmount(a.value);
                              setValue('amount', a.value);
                              setValue('customAmount', '');
                            }}
                            sx={{
                              border: '1.5px solid',
                              borderColor: selectedAmount === a.value ? 'primary.main' : 'divider',
                              borderRadius: 2,
                              p: 1.5,
                              textAlign: 'center',
                              cursor: 'pointer',
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
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>,
                      }}
                      {...register('customAmount')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          setSelectedAmount(null);
                          setValue('amount', Number(val));
                        } else {
                          setSelectedAmount(null);
                          setValue('amount', null);
                        }
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ py: 1.5, mt: 1 }}
                  >
                    {loading ? 'Enviando...' : 'Quiero mi crédito'}
                  </Button>

                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Al enviar, aceptas que un colaborador de Empresa X te contacte con fines comerciales.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}