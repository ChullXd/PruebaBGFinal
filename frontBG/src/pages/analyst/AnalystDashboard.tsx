import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  Drawer, List, ListItem, ListItemText, Box, Toolbar, AppBar, Typography, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

interface Request {
  id: string;
  applicantName: string;
  amount: number;
  status: string;
}

const drawerWidth = 240;

const AnalystDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { logout } = authContext;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests?status=${filter}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Request[] = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          setError('Error al cargar las solicitudes');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    };
    fetchRequests();
  }, [filter]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel Analista
          </Typography>
          <Button color="inherit" onClick={logout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select
                  value={filter}
                  label="Filtrar por Estado"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="approved">Aprobado</MenuItem>
                  <MenuItem value="rejected">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Solicitudes
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Solicitante</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.applicantName}</TableCell>
                  <TableCell>{req.amount}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => navigate(`/analyst/request/${req.id}`)}
                      color="primary"
                    >
                      Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalystDashboard;