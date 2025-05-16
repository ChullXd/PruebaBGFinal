import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import CreditForm from './pages/applicant/CreditForm';
import ApplicantHistory from './pages/applicant/ApplicantHistory';
import AnalystDashboard from './pages/analyst/AnalystDashboard';
import RequestDetail from './pages/analyst/RequestDetail';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/applicant"
          element={
            <ProtectedRoute role="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="new" element={<CreditForm />} />
          <Route path="history" element={<ApplicantHistory />} />
        </Route>
        <Route
          path="/analyst"
          element={
            <ProtectedRoute role="analyst">
              <AnalystDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="request/:id" element={<RequestDetail />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;