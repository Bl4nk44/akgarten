import React from 'react';
import { useAdmin, AdminProvider } from '../components/admin/AdminContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminGallery from '../components/admin/AdminGallery';

function AdminInner() {
  const { token } = useAdmin();
  return token ? <AdminGallery /> : <AdminLogin />;
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminInner />
    </AdminProvider>
  );
}
