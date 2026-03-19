import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Stack, Button, Select, MenuItem,
  FormControl, InputLabel, Skeleton, Tooltip, Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Layout from '../components/Layout';
import { leadService } from '../services/leadService';

const STATUS_CONFIG = {
  pendiente:      { label: 'Pendiente',       color: 'default'  },
  en_evaluacion:  { label: 'En evaluación',   color: 'info'     },
  aprobado:       { label: 'Aprobado',         color: 'success'  },
  rechazado:      { label: 'Rechazado',        color: 'error'    },
  contrato_enviado: { label: 'Contrato enviado', color: 'warning' },
};

const STATS = (leads) => [
  { label: 'Total leads',    value: leads.length,                                          color: '#1A1A2E' },
  { label: 'Pendientes',     value: leads.filter(l => l.status === 'pendiente').length,    color: '#6B6B7B' },
  { label: 'En evaluación',  value: leads.filter(l => l.status === 'en_evaluacion').length, color: '#0288D1' },
  { label: 'Aprobados',      value: leads.filter(l => l.status === 'aprobado').length,     color: '#2E7D5E' },
];

function LeadInitials({ name }) {
  const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <Avatar sx={{ width: 32, height: 32, bgcolor: '#F5F3EF', color: 'text.primary', fontSize: '0.75rem', fontWeight: 700 }}>
      {initials}
    </Avatar>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getAll();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter(l => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = STATS(leads);

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 5 }}>

        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={4} gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de leads y solicitudes de crédito
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => navigate('/')}
            size="small"
          >
            Nuevo lead
          </Button>
        </Stack>

        {/* Stats */}
        <Stack direction={{ xs: 'grid', sm: 'row' }} spacing={2} mb={4}
          sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2 }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{
              bgcolor: 'white', border: '1px solid', borderColor: 'divider',
              borderRadius: 3, p: 3,
            }}>
              <Typography variant="h3" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.label}</Typography>
            </Box>
          ))}
        </Stack>

        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
          <TextField
            placeholder="Buscar por nombre o correo..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <FilterListIcon sx={{ fontSize: 16 }} /> Estado
              </Stack>
            </InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <MenuItem key={key} value={key}>{val.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Actualizar">
            <IconButton size="small" onClick={fetchLeads} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFAF8' }}>
                {['Lead', 'Contacto', 'Monto solicitado', 'Fecha', 'Estado', ''].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', borderColor: 'divider' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array(4).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(6).fill(0).map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" width="80%" /></TableCell>
                    ))}
                  </TableRow>
                ))
                : filtered.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No se encontraron leads</Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : filtered.map((lead) => {
                    const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.pendiente;
                    return (
                      <TableRow
                        key={lead.id}
                        hover
                        sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <Stack direction="row" alignItems="center" gap={1.5}>
                            <LeadInitials name={lead.name} />
                            <Typography variant="body2" fontWeight={600}>{lead.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <Typography variant="body2" color="text.secondary">{lead.email}</Typography>
                          <Typography variant="caption" color="text.secondary">{lead.phone}</Typography>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <Typography variant="body2" fontWeight={600}>
                            ${lead.amount?.toLocaleString('es-CL')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <Chip label={status.label} color={status.color} size="small" />
                        </TableCell>
                        <TableCell sx={{ borderColor: 'divider' }}>
                          <IconButton size="small">
                            <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          {statusFilter !== 'todos' || search ? ` · filtrado de ${leads.length} total` : ''}
        </Typography>
      </Container>
    </Layout>
  );
}