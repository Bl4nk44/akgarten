import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AGB from './pages/AGB';
import Datenschutz from './pages/Datenschutz';
import Impressum from './pages/Impressum';
import CookieConsent from './components/CookieConsent';
import ChatBot from './components/ChatBot';
import Layout from './components/Layout';
import AdminPage from './pages/Admin';

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="agb" element={<AGB />} />
          <Route path="datenschutz" element={<Datenschutz />} />
          <Route path="impressum" element={<Impressum />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster position="top-right" />
      <CookieConsent />
      <ChatBot />
    </>
  );
}
