import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Alert } from '@mui/material';

interface Request {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

const ApplicantHistory: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Request[] = await response.json();
        if (response.ok) {
          setRequests(data);
        } else {
          setError('Error al cargar el historial');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    };
    fetchRequests();
  }, []);

  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Historial de Solicitudes
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.amount}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ApplicantHistory;