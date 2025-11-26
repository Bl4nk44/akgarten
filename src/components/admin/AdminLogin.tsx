import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminLogin() {
  const { setToken } = useAdmin();
  const [val, setVal] = useState('');

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Panel admina</h1>
        <p className="text-sm text-gray-500">Wklej token ADMIN_TOKEN.</p>
        <input className="w-full px-3 py-2 rounded border bg-transparent" placeholder="Bearer token" value={val} onChange={(e)=>setVal(e.target.value)} />
        <button onClick={()=> val && setToken(val)} className="w-full px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700">Zaloguj</button>
      </div>
    </div>
  );
}
