import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Impressum() {
  return (
    <div className="dark min-h-screen bg-gray-900 text-white transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 lg:p-16">
          <article className="prose prose-invert mx-auto">
            <h1 className="text-center">Impressum</h1>
            <p className="text-center">Hier kommt der Text für das Impressum hin.</p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
