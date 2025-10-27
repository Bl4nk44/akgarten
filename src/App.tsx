import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AGB from './pages/AGB';
import Datenschutz from './pages/Datenschutz';
import Impressum from './pages/Impressum';
import CookieConsent from './components/CookieConsent';
import ChatBot from './components/ChatBot';

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="dark min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
      <Toaster position="top-right" />
      <CookieConsent />
      <ChatBot />
    </div>
  );
}
