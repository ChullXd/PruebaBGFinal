import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Alert, Paper, MenuItem } from '@mui/material';
import * as Yup from 'yup';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'applicant' | 'analyst';
}

const validationSchema = Yup.object({
  name: Yup.string().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
  role: Yup.string().oneOf(['applicant', 'analyst']).required('Requerido'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registrarse
        </Typography>
        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'applicant' as 'applicant' | 'analyst', error: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            try {
              const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              });
              const data = await response.json();
              if (response.ok) {
                navigate('/login');
              } else {
                setFieldValue('error', data.message || 'Error en el registro');
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
                <Field
                  as={TextField}
                  name="name"
                  label="Nombre"
                  fullWidth
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Contraseña"
                  type="password"
                  fullWidth
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  name="role"
                  label="Rol"
                  select
                  fullWidth
                  error={touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="applicant">Solicitante</MenuItem>
                  <MenuItem value="analyst">Analista</MenuItem>
                </Field>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Registrarse
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Register;