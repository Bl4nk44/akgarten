import React, { useState } from 'react';
import { Sun, Cloud, TreePine, Home } from 'lucide-react';

export default function SunShadeSimulator() {
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [season, setSeason] = useState('summer');
  const [gardenElements, setGardenElements] = useState([
    { id: 1, type: 'tree', x: 20, y: 30, size: 'large' },
    { id: 2, type: 'house', x: 70, y: 10, size: 'large' },
    { id: 3, type: 'plant', x: 50, y: 60, size: 'small' }
  ]);

  const getSunPosition = () => {
    const angle = ((timeOfDay - 6) / 12) * 180; // 6 AM to 6 PM mapped to 0-180 degrees
    const height = Math.sin((angle * Math.PI) / 180) * 40 + 10;
    const x = (angle / 180) * 80 + 10;
    return { x, y: height };
  };

  const getShadowLength = () => {
    const sunHeight = getSunPosition().y;
    return Math.max(10, 50 - sunHeight);
  };

  const getSeasonMultiplier = () => {
    switch (season) {
      case 'winter': return 1.5;
      case 'spring': return 1.2;
      case 'summer': return 1.0;
      case 'autumn': return 1.3;
      default: return 1.0;
    }
  };

  const sunPosition = getSunPosition();
  const shadowLength = getShadowLength() * getSeasonMultiplier();

  const seasons = [
    { value: 'spring', label: 'Frühling', icon: '🌸' },
    { value: 'summer', label: 'Sommer', icon: '☀️' },
    { value: 'autumn', label: 'Herbst', icon: '🍂' },
    { value: 'winter', label: 'Winter', icon: '❄️' }
  ];

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'tree': return <TreePine className="h-6 w-6 text-green-600" />;
      case 'house': return <Home className="h-6 w-6 text-gray-600" />;
      case 'plant': return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      default: return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Sonne & Schatten Simulator
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Visualisieren Sie Sonneneinstrahlung und Schatten in Ihrem Garten.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tageszeit: {timeOfDay}:00 Uhr
            </label>
            <input
              type="range"
              min="6"
              max="18"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>6:00</span>
              <span>12:00</span>
              <span>18:00</span>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Jahreszeit:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {seasons.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSeason(s.value)}
                  className={`p-3 rounded-xl text-center transition-all duration-300 ${
                    season === s.value
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-medium">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Lichtverhältnisse
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Sonnenstunden:</span>
                <span className="font-semibold text-yellow-600">
                  {Math.max(0, Math.min(12, timeOfDay - 6))}h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Schattenlänge:</span>
                <span className="font-semibold text-gray-600">
                  {Math.round(shadowLength)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Garden Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Garten-Simulation
            </h4>
            
            <div className="relative w-full h-80 bg-gradient-to-b from-blue-200 to-green-200 dark:from-blue-900 dark:to-green-900 rounded-xl overflow-hidden">
              {/* Sun */}
              <div
                className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-lg transition-all duration-500 flex items-center justify-center"
                style={{
                  left: `${sunPosition.x}%`,
                  top: `${100 - sunPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Sun className="h-4 w-4 text-yellow-800" />
              </div>

              {/* Garden Elements */}
              {gardenElements.map((element) => (
                <div key={element.id}>
                  {/* Element */}
                  <div
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {getElementIcon(element.type)}
                  </div>
                  
                  {/* Shadow */}
                  {element.type !== 'plant' && (
                    <div
                      className="absolute bg-black/20 rounded-full transition-all duration-500"
                      style={{
                        left: `${element.x + (sunPosition.x < element.x ? -shadowLength/4 : shadowLength/4)}%`,
                        top: `${element.y + shadowLength/2}%`,
                        width: `${shadowLength/2}px`,
                        height: `${shadowLength/4}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-300 dark:bg-green-800"></div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <Sun className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  Vollsonne
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <Cloud className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Halbschatten
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <TreePine className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Schatten
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
