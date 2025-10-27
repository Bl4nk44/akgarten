import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Datenschutz() {
  return (
    <div className="dark min-h-screen transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Datenschutz</h1>
        <p className="mt-4">Hier kommt der Text für die Datenschutzerklärung hin.</p>
      </div>
      <Footer />
    </div>
  );
}
