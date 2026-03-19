import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1" fontWeight={700} sx={{ fontSize: '6rem', color: 'divider' }}>404</Typography>
      <Typography variant="h5" fontWeight={600}>Página no encontrada</Typography>
      <Typography variant="body2" color="text.secondary">La ruta que buscas no existe.</Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>Volver al inicio</Button>
    </Box>
  );
}