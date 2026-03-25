import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRScan from './pages/QRScan';
import AIDetection from './pages/AIDetection';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><QRScan /></ProtectedRoute>} />
        <Route path="/ai-detection" element={<ProtectedRoute><AIDetection /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminRequired={true}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
