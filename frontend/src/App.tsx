import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { CreateBug } from './pages/CreateBug/CreateBug';
import { BugDetails } from './pages/BugDetails/BugDetails';
import { EditBug } from './pages/EditBug/EditBug';
import { NotFound } from './pages/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bugs/create" element={<CreateBug />} />
            <Route path="/bugs/edit/:id" element={<EditBug />} />
            <Route path="/bugs/:id" element={<BugDetails />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
