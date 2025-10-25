import { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-green-50/80 dark:bg-green-950/80 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              GartenMeister
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => scrollToSection('home')}
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Startseite
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Über mich
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Leistungen
            </button>
            <button 
              onClick={() => scrollToSection('widgets')}
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Garten-Tools
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 overflow-hidden btn-shine"
            >
              Galerie
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="relative inline-flex h-12 items-center justify-center rounded-xl bg-green-700 px-8 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 btn-shine"
            >
              Kontakt
            </button>
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
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Startseite
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Über mich
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Leistungen
              </button>
              <button 
                onClick={() => scrollToSection('widgets')}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Garten-Tools
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Galerie
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors w-fit"
              >
                Kontakt
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
