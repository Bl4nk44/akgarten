import React from 'react';
import { Award, Users, Leaf, Clock } from 'lucide-react';
import aboutImage from '../assets/about-image.png';

export default function About() {
  const stats = [
    { icon: Award, number: '5+', label: 'Jahre Erfahrung' },
    { icon: Users, number: '50+', label: 'Zufriedene Kunden' },
    { icon: Leaf, number: '200+', label: 'Projekte realisiert' },
    { icon: Clock, number: '24/7', label: 'Beratung verfügbar' },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Über GartenMeister
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Als leidenschaftlicher Gärtner mit über einem Jahrzehnt Erfahrung verwandle ich 
                Außenbereiche in lebendige, nachhaltige Gärten. Meine Expertise umfasst alles von 
                der Gartenplanung bis zur langfristigen Pflege.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Nachhaltige Praktiken</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Umweltfreundliche Methoden für gesunde Gärten und Böden.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Zertifizierte Expertise</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ausgebildeter Landschaftsgärtner mit kontinuierlicher Weiterbildung.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Persönliche Betreuung</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Individuelle Lösungen für jeden Garten und jedes Budget.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <img 
              src={aboutImage} 
              alt="Gärtner bei der Arbeit"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Jahre Erfahrung</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
