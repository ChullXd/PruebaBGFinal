import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Button, CircularProgress } from '@mui/material';

interface Request {
  id: string;
  applicantName: string;
  amount: number;
  term: number;
  purpose: string;
  income: number;
  status: string;
  autoEvaluation?: string;
}

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: Request = await response.json();
        if (response.ok) {
          setRequest(data);
        } else {
          setError('Error al cargar la solicitud');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    };
    fetchRequest();
  }, [id]);

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setSuccess(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'} con éxito`);
        setRequest((prev) => prev ? { ...prev, status } : null);
      } else {
        setError('Error al actualizar el estado');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (!request) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Detalles de la Solicitud #{id}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography><strong>Solicitante:</strong> {request.applicantName}</Typography>
          <Typography><strong>Monto:</strong> {request.amount}</Typography>
          <Typography><strong>Plazo:</strong> {request.term} meses</Typography>
          <Typography><strong>Propósito:</strong> {request.purpose}</Typography>
          <Typography><strong>Ingresos Mensuales:</strong> {request.income}</Typography>
          <Typography><strong>Estado:</strong> {request.status}</Typography>
          <Typography><strong>Evaluación Automática:</strong> {request.autoEvaluation || 'Pendiente'}</Typography>
          <Box display="flex" gap={2}>
            <Button
              onClick={() => handleStatusChange('approved')}
              variant="contained"
              color="success"
              disabled={request.status !== 'pending'}
            >
              Aprobar
            </Button>
            <Button
              onClick={() => handleStatusChange('rejected')}
              variant="contained"
              color="error"
              disabled={request.status !== 'pending'}
            >
              Rechazar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequestDetail;