import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  return isAuthenticated ? (
    children
  ) : (
    <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  );
};

export default ProtectedRoute;