import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Brands from './pages/Brands';
import Workshop from './pages/Workshop';
import Contact from './pages/Contact';
import Vehicules from './pages/Vehicules';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/components/AdminLayout';
import AdminMessages from './admin/pages/AdminMessages';
import Dashboard from './admin/pages/Dashboard';
import AdminMarques from './admin/pages/AdminMarques';
import AdminVehicules from './admin/pages/AdminVehicules';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="marques" element={<AdminMarques />} />
          <Route path="vehicules" element={<AdminVehicules />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* Client routes */}
        <Route path="/*" element={
          <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marques" element={<Brands />} />
                <Route path="/vehicules" element={<Vehicules />} />
                <Route path="/atelier" element={<Workshop />} />
                <Route path="/atelier-sav" element={<Workshop />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
