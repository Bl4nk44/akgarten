import React from 'react';
import { Scissors, Sprout, TreePine } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Sprout,
      title: 'Pflanzenpflege',
      description: '',
      features: ['Heckenschnitt', 'Baumkronenschnitt', 'Vertikutieren', 'Rasenmähen']
    },
    {
      icon: Scissors,
      title: 'Gartenpflege',
      description: '',
      features: ['Mähen von verwilderten Gärten', 'Laubentfernung', 'Unkrautbekämpfung', 'Umfassende Gartenreinigung']
    },
    {
      icon: TreePine,
      title: 'Zusätzliche und Spezialarbeiten',
      description: '',
      features: ['Entsorgung von Grünschnitt', 'Gehwegreinigung', 'Kleinere Aufräumarbeiten', 'Baumfällung']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Unsere Leistungen
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Von der Planung bis zur Pflege - wir bieten umfassende Gartendienstleistungen 
            für jeden Bedarf und jedes Budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group flex flex-col"
            >
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-8 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="relative w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300 btn-shine overflow-hidden mt-auto">
                Mehr erfahren
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
