import { useState } from 'react';
import { Droplets, Sun, Wind, Atom } from 'lucide-react';
import { plantCareData } from '../../data/plantCareData';

export default function PlantCareCalculator() {
  const [selectedPlantName, setSelectedPlantName] = useState('');
  
  const selectedPlant = plantCareData.find(p => p.name === selectedPlantName);

  const getWateringText = (level: string) => {
    switch (level) {
      case 'hoch': return 'Hoch (oft gießen)';
      case 'mittel': return 'Mittel (regelmäßig)';
      case 'niedrig': return 'Niedrig (selten gießen)';
      default: return 'Unbekannt';
    }
  };

  const getSunlightText = (level: string) => {
    switch (level) {
      case 'sonne': return 'Vollsonne (6+ Std.)';
      case 'halbschatten': return 'Halbschatten (3-6 Std.)';
      case 'schatten': return 'Schatten (< 3 Std.)';
      default: return 'Unbekannt';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pflanzenpflege-Rechner
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Wählen Sie eine Pflanze und erhalten Sie sofortige Pflegehinweise.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Pflanze auswählen:
        </label>
        <select
          value={selectedPlantName}
          onChange={(e) => setSelectedPlantName(e.target.value)}
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">-- Pflanze wählen --</option>
          {plantCareData.map((plant) => (
            <option key={plant.name} value={plant.name}>{plant.name} ({plant.category})</option>
          ))}
        </select>
      </div>

      {selectedPlant ? (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-inner animate-fade-in">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Pflege für: <span className="text-green-600 dark:text-green-400">{selectedPlant.name}</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h5 className="font-semibold mb-1 dark:text-white">Gießen</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getWateringText(selectedPlant.watering)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h5 className="font-semibold mb-1 dark:text-white">Licht</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getSunlightText(selectedPlant.sunlight)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <h5 className="font-semibold mb-1 dark:text-white">Boden</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPlant.soil}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Atom className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h5 className="font-semibold mb-1 dark:text-white">Dünger</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPlant.fertilizer}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-gray-500 dark:text-gray-400">
            Wählen Sie eine Pflanze aus der Liste aus.
          </p>
        </div>
      )}
    </div>
  );
}
