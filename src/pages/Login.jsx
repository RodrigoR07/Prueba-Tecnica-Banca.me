import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Typography, TextField, Button,
  Stack, Alert, Link, Divider, InputAdornment, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta con ana@empresax.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>

      {/* Left panel decorativo */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '45%',
        bgcolor: 'primary.main',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 6,
      }}>
        <Typography variant="h5" fontWeight={700} color="white">banca.me</Typography>
        <Box>
          <Typography variant="h3" fontWeight={700} color="white" lineHeight={1.2} sx={{ mb: 2 }}>
            Gestiona tus<br />créditos con<br />claridad
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            Plataforma interna para colaboradores de banca.me
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 banca.me ·
        </Typography>
      </Box>

      {/* Right: form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Container maxWidth="xs">
          <Stack spacing={4}>
            <Box>
            <Button
                component={RouterLink}
                to="/"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{ color: 'text.secondary', mb: 2, pl: 0 }}
            >
                Volver al inicio
            </Button>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Iniciar sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Accede a tu panel de colaborador
            </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {/* Hint para demo */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="caption">
                <strong>Demo:</strong> ana@empresax.com · cualquier contraseña
              </Typography>
            </Alert>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  type="email"
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' },
                  })}
                />

                <TextField
                  label="Contraseña"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(v => !v)} edge="end">
                          {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password', { required: 'La contraseña es obligatoria' })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </Stack>
            </Box>

            <Divider><Typography variant="caption" color="text.secondary">¿No tienes cuenta?</Typography></Divider>

            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 1.5, borderColor: 'divider', color: 'text.primary' }}
            >
              Crear cuenta
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}