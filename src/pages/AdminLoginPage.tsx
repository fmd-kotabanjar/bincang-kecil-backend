
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';

const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useAuth();

  return <AdminLogin onAdminLogin={adminLogin} />;
};

export default AdminLoginPage;
