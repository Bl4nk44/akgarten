import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AdminContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
  authHeader: HeadersInit;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) sessionStorage.setItem('adminToken', token);
    else sessionStorage.removeItem('adminToken');
  }, [token]);

  const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  return (
    <AdminContext.Provider value={{ token, setToken, authHeader }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
