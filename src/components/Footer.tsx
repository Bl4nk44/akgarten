import { HashLink as Link } from 'react-router-hash-link';
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
              <span className="text-xl font-bold">AKGarten</span>
            </div>
            <p className="text-green-200 leading-relaxed">
              Ihr Partner für professionelle Gartenpflege und -gestaltung. 
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schnellzugriff</h3>
            <ul className="space-y-2">
              <li><Link smooth to="/#home" className="text-green-200 hover:text-white transition-colors">Startseite</Link></li>
              <li><Link smooth to="/#about" className="text-green-200 hover:text-white transition-colors">Über uns</Link></li>
              <li><Link smooth to="/#services" className="text-green-200 hover:text-white transition-colors">Leistungen</Link></li>
              <li><Link smooth to="/#widgets" className="text-green-200 hover:text-white transition-colors">Garten-Tools</Link></li>
              <li><Link smooth to="/#gallery" className="text-green-200 hover:text-white transition-colors">Galerie</Link></li>
              <li><Link smooth to="/#contact" className="text-green-200 hover:text-white transition-colors">Kontakt</Link></li>
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
                <span className="text-green-200">Mainzerstraße 114, 55545 Bad Kreuznach</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-300" />
                <span className="text-green-200">015206136610</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-300" />
                <span className="text-green-200">kontakt@akgarten.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 text-sm">
              © {currentYear} AKGarten. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/datenschutz" className="text-green-300 hover:text-white text-sm transition-colors">
                Datenschutz
              </Link>
              <Link to="/impressum" className="text-green-300 hover:text-white text-sm transition-colors">
                Impressum
              </Link>
              <Link to="/agb" className="text-green-300 hover:text-white text-sm transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
