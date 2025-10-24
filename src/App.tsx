import React from 'react';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Widgets from './components/Widgets';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';

export default function App() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <Header />
      <Hero />
      <About />
      <Services />
      <Widgets />
      <Gallery />
      <Contact />
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
