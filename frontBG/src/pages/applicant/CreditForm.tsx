import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import * as Yup from 'yup';

interface CreditFormData {
  amount: number;
  term: number;
  purpose: string;
  income: number;
}

const validationSchema = Yup.object({
  amount: Yup.number().required('Requerido').positive('Debe ser positivo'),
  term: Yup.number().required('Requerido').positive('Debe ser positivo').integer('Debe ser un número entero'),
  purpose: Yup.string().required('Requerido'),
  income: Yup.number().required('Requerido').positive('Debe ser positivo'),
});

const CreditForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Nueva Solicitud de Crédito
        </Typography>
        <Formik
          initialValues={{ amount: 0, term: 0, purpose: '', income: 0, error: '', success: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            try {
              const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values),
              });
              if (response.ok) {
                setFieldValue('success', 'Solicitud enviada con éxito');
                setTimeout(() => navigate('/applicant/history'), 2000);
              } else {
                setFieldValue('error', 'Error al enviar la solicitud');
              }
            } catch (err) {
              setFieldValue('error', 'Error de conexión');
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={2}>
                {values.error && <Alert severity="error">{values.error}</Alert>}
                {values.success && <Alert severity="success">{values.success}</Alert>}
                <Field
                  as={TextField}
                  name="amount"
                  label="Monto"
                  type="number"
                  fullWidth
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
                <Field
                  as={TextField}
                  name="term"
                  label="Plazo (meses)"
                  type="number"
                  fullWidth
                  error={touched.term && !!errors.term}
                  helperText={touched.term && errors.term}
                />
                <Field
                  as={TextField}
                  name="purpose"
                  label="Propósito"
                  multiline
                  rows={4}
                  fullWidth
                  error={touched.purpose && !!errors.purpose}
                  helperText={touched.purpose && errors.purpose}
                />
                <Field
                  as={TextField}
                  name="income"
                  label="Ingresos Mensuales"
                  type="number"
                  fullWidth
                  error={touched.income && !!errors.income}
                  helperText={touched.income && errors.income}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Enviar Solicitud
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default CreditForm;