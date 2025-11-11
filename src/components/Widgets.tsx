import React, { useState } from 'react';
// import SeasonalCalendar from './widgets/SeasonalCalendar';

export default function Widgets() {
  const [activeWidget] = useState('calendar');

  return (
    <section id="widgets" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Saisonaler Garten-Kalender
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Monatliche Gartenaufgaben und saisonale Tipps auf einen Blick.
          </p>
        </div>



        {/* Widget Content */}
        <div className="max-w-3xl mx-auto">
          {/* Kalendarz przeniesiony do sekcji kontaktu */}
        </div>
      </div>
    </section>
  );
}
