import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
});

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', error: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldValue }) => {
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email, password: values.password }),
              });
              const data = await response.json();
              if (response.ok) {
                login(data.token);
                navigate(data.role === 'applicant' ? '/applicant' : '/analyst');
              } else {
                setFieldValue('error', data.message || 'Error en el inicio de sesión');
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Iniciar Sesión
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Typography align="center" sx={{ mt: 2 }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#1976d2' }}>
            Regístrate
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;