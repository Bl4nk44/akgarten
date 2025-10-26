import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 dark:bg-green-950 text-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-screen filter blur-xl animate-drift [animation-duration:25s]"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-xl animate-drift [animation-duration:30s] [animation-delay:-5s]"></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-green-300 rounded-full mix-blend-screen filter blur-xl animate-drift [animation-duration:20s] [animation-delay:-10s]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo-alfa.png" alt="AK Hausmeisterservice Logo" className="h-20 w-auto" />
              <span className="text-xl font-bold">AK Hausmeisterservice</span>
            </div>
            <p className="text-green-200 leading-relaxed">
              Ihr Partner für professionelle Gartenpflege und -gestaltung. 
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-green-200 hover:text-white transition-colors">Startseite</a></li>
              <li><a href="#about" className="text-green-200 hover:text-white transition-colors">Über uns</a></li>
              <li><a href="#services" className="text-green-200 hover:text-white transition-colors">Leistungen</a></li>
              <li><a href="#widgets" className="text-green-200 hover:text-white transition-colors">Garten-Tools</a></li>
              <li><a href="#gallery" className="text-green-200 hover:text-white transition-colors">Galerie</a></li>
              <li><a href="#contact" className="text-green-200 hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unsere Leistungen</h3>
            <ul className="space-y-2">
              <li><span className="text-green-200">Gartenpflege</span></li>
              <li><span className="text-green-200">Gartenplanung</span></li>
              <li><span className="text-green-200">Baumpflege</span></li>
              <li><span className="text-green-200">Bewässerungssysteme</span></li>
              <li><span className="text-green-200">Gartengestaltung</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-300" />
                <span className="text-green-200">Gartenstraße 123, 12345 Musterstadt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-300" />
                <span className="text-green-200">+49 (0) 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-300" />
                <span className="text-green-200">info@gartenmeister.de</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 text-sm">
              © {currentYear} AK Hausmeisterservice. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">
                Datenschutz
              </a>
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">
                Impressum
              </a>
              <a href="#" className="text-green-300 hover:text-white text-sm transition-colors">
                AGB
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
