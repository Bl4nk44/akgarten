import React, { useState } from 'react';
import PlantCareCalculator from './widgets/PlantCareCalculator';
import SeasonalCalendar from './widgets/SeasonalCalendar';
import PlantDiagnostic from './widgets/PlantDiagnostic';
import SunShadeSimulator from './widgets/SunShadeSimulator';

export default function Widgets() {
  const [activeWidget, setActiveWidget] = useState('calculator');

  const widgets = [
    { id: 'calculator', title: 'Pflanzenpflege-Rechner', icon: '🌱' },
    { id: 'calendar', title: 'Garten-Kalender', icon: '📅' },
    { id: 'diagnostic', title: 'Pflanzen-Diagnose', icon: '🔍' },
    { id: 'simulator', title: 'Sonne & Schatten', icon: '☀️' },
  ];

  return (
    <section id="widgets" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Interaktive Garten-Tools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Nutzen Sie unsere kostenlosen Tools für bessere Gartenpflege und Planung.
          </p>
        </div>

        {/* Widget Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {widgets.map((widget) => (
            <button
              key={widget.id}
              onClick={() => setActiveWidget(widget.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeWidget === widget.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{widget.icon}</span>
              <span>{widget.title}</span>
            </button>
          ))}
        </div>

        {/* Widget Content */}
        <div className="max-w-4xl mx-auto">
          {activeWidget === 'calculator' && <PlantCareCalculator />}
          {activeWidget === 'calendar' && <SeasonalCalendar />}
          {activeWidget === 'diagnostic' && <PlantDiagnostic />}
          {activeWidget === 'simulator' && <SunShadeSimulator />}
        </div>
      </div>
    </section>
  );
}
