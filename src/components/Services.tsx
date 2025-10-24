import React from 'react';
import { Scissors, Sprout, TreePine, Flower, Droplets, Shovel } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Scissors,
      title: 'Gartenpflege',
      description: 'Regelmäßige Pflege und Wartung Ihres Gartens das ganze Jahr über.',
      price: 'ab 45€/Stunde',
      features: ['Rasenmähen', 'Heckenschnitt', 'Unkrautentfernung', 'Bewässerung']
    },
    {
      icon: Sprout,
      title: 'Gartenplanung',
      description: 'Professionelle Planung und Design für Ihren Traumgarten.',
      price: 'ab 200€',
      features: ['3D-Visualisierung', 'Pflanzenauswahl', 'Layoutplanung', 'Kostenvoranschlag']
    },
    {
      icon: TreePine,
      title: 'Baumpflege',
      description: 'Fachgerechter Baumschnitt und Baumpflege für gesunde Bäume.',
      price: 'ab 80€/Baum',
      features: ['Kronenschnitt', 'Gesundheitscheck', 'Schädlingsbekämpfung', 'Baumfällung']
    },
    {
      icon: Flower,
      title: 'Bepflanzung',
      description: 'Auswahl und Pflanzung von Blumen, Sträuchern und Bäumen.',
      price: 'ab 25€/m²',
      features: ['Saisonale Bepflanzung', 'Staudengärten', 'Gemüsegärten', 'Kübelbepflanzung']
    },
    {
      icon: Droplets,
      title: 'Bewässerungssysteme',
      description: 'Installation und Wartung automatischer Bewässerungsanlagen.',
      price: 'ab 300€',
      features: ['Tropfbewässerung', 'Sprinkleranlagen', 'Smart-Steuerung', 'Wartung']
    },
    {
      icon: Shovel,
      title: 'Gartengestaltung',
      description: 'Komplette Neugestaltung und Umgestaltung von Gartenbereichen.',
      price: 'Auf Anfrage',
      features: ['Terrassen', 'Wege', 'Teiche', 'Beleuchtung']
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
              
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                {service.price}
              </div>
              
              <ul className="space-y-2 mb-8 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300">
                Mehr erfahren
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
