import React from 'react';
import { Leaf, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">GartenMeister</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Ihr Partner für professionelle Gartenpflege und -gestaltung. 
              Seit über 10 Jahren verwandeln wir Träume in grüne Realität.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-green-400 transition-colors">Startseite</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-green-400 transition-colors">Über uns</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-green-400 transition-colors">Leistungen</a></li>
              <li><a href="#widgets" className="text-gray-300 hover:text-green-400 transition-colors">Garten-Tools</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-green-400 transition-colors">Galerie</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unsere Leistungen</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Gartenpflege</span></li>
              <li><span className="text-gray-300">Gartenplanung</span></li>
              <li><span className="text-gray-300">Baumpflege</span></li>
              <li><span className="text-gray-300">Bewässerungssysteme</span></li>
              <li><span className="text-gray-300">Gartengestaltung</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Gartenstraße 123, 12345 Musterstadt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+49 (0) 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">info@gartenmeister.de</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} GartenMeister. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Datenschutz
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Impressum
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                AGB
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
