import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { HashLink as Link } from 'react-router-hash-link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-green-50/80 dark:bg-green-950/80 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-3">
            <img src="/logo-alfa.png" alt="AK Hausmeisterservice Logo" className="h-20 w-auto" />
            <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:inline">
              AKGarten
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              smooth 
              to="/#home"
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Startseite
            </Link>
            <Link 
              smooth 
              to="/#about"
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Über mich
            </Link>
            <Link 
              smooth 
              to="/#services"
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Leistungen
            </Link>
            <Link 
              smooth 
              to="/#widgets"
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Garten-Tools
            </Link>
            <Link 
              smooth 
              to="/#gallery"
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Galerie
            </Link>
                        <a 
              href="tel:015206136610"
              className="relative hidden lg:inline-flex h-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 px-6 font-medium text-gray-800 dark:text-white transition-colors hover:bg-green-200 dark:hover:bg-green-800"
            >
              <Phone className="h-5 w-5 mr-2" />
              015206136610
            </a>
            <Link 
              smooth 
              to="/#contact"
              className="relative inline-flex h-12 items-center justify-center rounded-xl bg-green-700 px-8 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 btn-shine"
            >
              Kontakt
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-4 px-4">
              <Link smooth to="/#home" onClick={closeMenu} className="text-left text-gray-700 dark:text-gray-300">Startseite</Link>
              <Link smooth to="/#about" onClick={closeMenu} className="text-left text-gray-700 dark:text-gray-300">Über mich</Link>
              <Link smooth to="/#services" onClick={closeMenu} className="text-left text-gray-700 dark:text-gray-300">Leistungen</Link>
              <Link smooth to="/#widgets" onClick={closeMenu} className="text-left text-gray-700 dark:text-gray-300">Garten-Tools</Link>
              <Link smooth to="/#gallery" onClick={closeMenu} className="text-left text-gray-700 dark:text-gray-300">Galerie</Link>
              <a href="tel:015206136610" onClick={closeMenu} className="flex items-center text-left text-gray-700 dark:text-gray-300">
                <Phone className="h-5 w-5 mr-3" />
                015206136610
              </a>
              <Link smooth to="/#contact" onClick={closeMenu} className="text-left bg-green-600 text-white px-6 py-2 rounded-full w-fit">Kontakt</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
