import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Widgets from './components/Widgets';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="dark min-h-screen transition-colors duration-300">
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
