import React, { useState } from 'react';
// import { useQuery } from 'convex/react';
// import { api } from '../../../convex/_generated/api';
import { Droplets, Sun, Thermometer, Clock } from 'lucide-react';

export default function PlantCareCalculator() {
  const [selectedPlant, setSelectedPlant] = useState('');
  
  // Usunięty hook useQuery
  // const plantCare = useQuery(api.plants.getPlantCare, 
  //   selectedPlant ? { plantName: selectedPlant } : "skip"
  // );

  // Statyczne dane pielęgnacji
  const plantCare = selectedPlant ? {
    wateringFrequency: '5-7',
    sunlight: 'partial',
    soilType: 'gut durchlässig',
    difficulty: 'medium',
    description: `Dies sind allgemeine Tipps für ${selectedPlant}. Stellen Sie sicher, dass die spezifischen Bedürfnisse Ihrer Pflanze erfüllt werden.`
  } : null;

  const commonPlants = [
    'Rose', 'Lavendel', 'Basilikum', 'Tomate', 'Geranien', 
    'Hortensie', 'Ficus', 'Monstera', 'Sukkulenten', 'Orchidee'
  ];

  const getSunlightText = (sunlight: string) => {
    switch (sunlight) {
      case 'full': return 'Vollsonne (6+ Stunden)';
      case 'partial': return 'Halbschatten (3-6 Stunden)';
      case 'shade': return 'Schatten (< 3 Stunden)';
      default: return 'Halbschatten (3-6 Stunden)';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Einfach';
      case 'medium': return 'Mittel';
      case 'hard': return 'Schwierig';
      default: return 'Mittel';
    }
  };

  return (
    // ... (JSX bez zmian)
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pflanzenpflege-Rechner
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Wählen Sie eine Pflanze und erhalten Sie personalisierte Pflegehinweise.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Plant Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pflanze auswählen:
          </label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">-- Pflanze wählen --</option>
            {commonPlants.map((plant) => (
              <option key={plant} value={plant}>{plant}</option>
            ))}
          </select>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Oder eigene Pflanze eingeben..."
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Care Instructions */}
        <div>
          {plantCare && selectedPlant && (
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pflegehinweise für {selectedPlant}
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Gießen</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Alle {plantCare.wateringFrequency} Tage
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Licht</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {getSunlightText(plantCare.sunlight)}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Boden</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {plantCare.soilType}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Schwierigkeit</span>
                  </div>
                  <p className={`font-semibold ${getDifficultyColor(plantCare.difficulty)}`}>
                    {getDifficultyText(plantCare.difficulty)}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Zusätzliche Tipps:</h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {plantCare.description}
                </p>
              </div>
            </div>
          )}

          {!selectedPlant && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 dark:text-gray-400">
                Wählen Sie eine Pflanze aus, um Pflegehinweise zu erhalten.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
