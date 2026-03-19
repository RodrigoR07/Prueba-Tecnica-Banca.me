import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Typography, TextField, Button,
  Stack, Alert, Divider, InputAdornment, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser({ name: data.name, email: data.email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>

      {/* Left decorativo */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '45%',
        bgcolor: '#2D2D44',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 6,
      }}>
        <Typography variant="h5" fontWeight={700} color="white">banca.me</Typography>
        <Box>
          <Typography variant="h3" fontWeight={700} color="white" lineHeight={1.2} sx={{ mb: 2 }}>
            Únete al<br />equipo de<br />colaboradores
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            Crea tu cuenta y empieza a gestionar créditos desde hoy.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 banca.me
        </Typography>
      </Box>

      {/* Right: form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Container maxWidth="xs">
          <Stack spacing={4}>
            <Box>
            <Button
                component={RouterLink}
                to="/login"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{ color: 'text.secondary', mb: 2, pl: 0 }}
            >
                Volver al login
            </Button>
            <Typography variant="h4" fontWeight={700} gutterBottom>Crear cuenta</Typography>
            <Typography variant="body2" color="text.secondary">
                Completa tus datos para registrarte como colaborador
            </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>

                <TextField
                  label="Nombre completo"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonOutlineIcon fontSize="small" /></InputAdornment>,
                  }}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', { required: 'El nombre es obligatorio' })}
                />

                <TextField
                  label="Correo corporativo"
                  fullWidth
                  type="email"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment>,
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
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
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
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                />

                <TextField
                  label="Confirmar contraseña"
                  fullWidth
                  type="password"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Confirma tu contraseña',
                    validate: v => v === password || 'Las contraseñas no coinciden',
                  })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </Stack>
            </Box>

            <Divider><Typography variant="caption" color="text.secondary">¿Ya tienes cuenta?</Typography></Divider>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 1.5, borderColor: 'divider', color: 'text.primary' }}
            >
              Iniciar sesión
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}