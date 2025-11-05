import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { HashLink as Link } from 'react-router-hash-link';
import heroImage1 from '../assets/1.png';
import heroImage2 from '../assets/2.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-drift [animation-duration:25s]"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-drift [animation-duration:30s] [animation-delay:-5s]"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-drift [animation-duration:20s] [animation-delay:-10s]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Professionelle Gartenpflege seit 2015</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Ihr Garten,
              <span className="text-green-600 dark:text-green-400 block">
                unsere Leidenschaft
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Verwandeln Sie Ihren Außenbereich in eine grüne Oase. Mit über 10 Jahren Erfahrung 
              schaffen wir Gärten, die nicht nur schön aussehen, sondern auch nachhaltig gedeihen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                smooth
                to="/#contact"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 btn-shine"
              >
                Kostenlose Beratung
              </Link>
              <Link
                smooth
                to="/#about"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-600 dark:text-green-400 border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 overflow-hidden btn-shine"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>

                    {/* Right Content - Hero Images */}
                                                  <div className="relative grid grid-cols-2 gap-4">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage1}
                alt="Gartenbild 1"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage2}
                alt="Gartenbild 2"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Link
          smooth
          to="/#about"
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          <ArrowDown className="h-8 w-8" />
        </Link>
      </div>
    </section>
  );
}
