import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminLogin() {
  const { setToken } = useAdmin();
  const [val, setVal] = useState('');

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Panel administracyjny</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Zaloguj się tokenem, aby zarządzać galerią.</p>
          </div>
          <div className="w-full bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-green-600/30 p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ADMIN_TOKEN</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Wklej token Bearer"
              value={val}
              onChange={(e)=>setVal(e.target.value)}
            />
            <button
              onClick={()=> val && setToken(val)}
              className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Zaloguj
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Powrót do strony głównej: <a href="/" className="text-green-500 hover:text-green-400">/</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
