import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PWAProvider } from './components/pwa/PWAProvider';
import { ResponsiveProvider } from './components/responsive/ResponsiveProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ResponsiveContainer from './components/responsive/ResponsiveContainer';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy load route components
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

// Parent Pages
const ParentDashboard = React.lazy(() => import('./pages/parent/Dashboard'));
const ParentActivities = React.lazy(() => import('./pages/parent/Activities'));
const ParentApprovals = React.lazy(() => import('./pages/parent/Approvals'));
const ParentProfile = React.lazy(() => import('./pages/parent/Profile'));
const ParentReports = React.lazy(() => import('./pages/parent/Reports'));

// Child Pages
const ChildDashboard = React.lazy(() => import('./pages/child/Dashboard'));
const ChildActivities = React.lazy(() => import('./pages/child/Activities'));
const ChildAchievements = React.lazy(() => import('./pages/child/Achievements'));
const ChildWallet = React.lazy(() => import('./pages/child/Wallet'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminTemplates = React.lazy(() => import('./pages/admin/Templates'));

const App = () => {
  return (
    <AuthProvider>
      <ResponsiveProvider>
        <PWAProvider>
          <ResponsiveContainer width="lg">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/auth">
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                {/* Parent Routes */}
                <Route path="/" element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/activities" element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentActivities />
                  </ProtectedRoute>
                } />
                <Route path="/approvals" element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentApprovals />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentProfile />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentReports />
                  </ProtectedRoute>
                } />

                {/* Child Routes */}
                <Route path="/child" element={
                  <ProtectedRoute allowedRoles={['child']}>
                    <ChildDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/child/activities" element={
                  <ProtectedRoute allowedRoles={['child']}>
                    <ChildActivities />
                  </ProtectedRoute>
                } />
                <Route path="/child/achievements" element={
                  <ProtectedRoute allowedRoles={['child']}>
                    <ChildAchievements />
                  </ProtectedRoute>
                } />
                <Route path="/child/wallet" element={
                  <ProtectedRoute allowedRoles={['child']}>
                    <ChildWallet />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/templates" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTemplates />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
              </Routes>
            </Suspense>
          </ResponsiveContainer>
        </PWAProvider>
      </ResponsiveProvider>
    </AuthProvider>
  );
};

export default App;