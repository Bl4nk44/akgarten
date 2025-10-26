import { useState, useMemo, useEffect, useRef } from 'react';
import { Stethoscope, X } from 'lucide-react'; // Usunięto 'Leaf'
import { diagnosticData } from '../../data/plantDiagnosticData';

export default function PlantDiagnostic() {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const plantNames = useMemo(() => [...new Set(diagnosticData.map(d => d.plantName))].sort(), []);

  const filteredPlants = useMemo(() => {
    if (!searchQuery) return [];
    return plantNames.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, plantNames]);

  const availableSymptoms = useMemo(() => {
    if (!selectedPlant) return [];
    const symptomsSet = new Set<string>();
    diagnosticData.filter(d => d.plantName === selectedPlant).forEach(p => p.symptoms.forEach(s => symptomsSet.add(s)));
    return Array.from(symptomsSet).sort();
  }, [selectedPlant]);

  const diagnosis = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];
    return diagnosticData.filter(problem => 
      problem.plantName === selectedPlant &&
      selectedSymptoms.every(symptom => problem.symptoms.includes(symptom))
    );
  }, [selectedPlant, selectedSymptoms]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlantSelect = (plantName: string) => {
    setSelectedPlant(plantName);
    setSearchQuery(plantName);
    setIsSearchFocused(false);
    setSelectedSymptoms([]);
  };

  // POPRAWIONA NAZWA FUNKCJI
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pflanzen-Diagnose Tool</h3>
        <p className="text-gray-600 dark:text-gray-300">Wählen Sie Pflanze und Symptome für eine mögliche Diagnose.</p>
      </div>
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative" ref={searchContainerRef}>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Pflanze suchen</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedPlant(''); }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="z.B. Tomate, Rose..."
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {isSearchFocused && searchQuery && filteredPlants.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredPlants.map(plantName => (
                  <li
                    key={plantName}
                    onClick={() => handlePlantSelect(plantName)}
                    className="px-4 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-600 dark:text-white"
                  >
                    {plantName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Symptome auswählen</label>
            {selectedPlant ? (
              <div className="flex flex-wrap gap-2">
                {availableSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    <span>{symptom}</span>
                    {selectedSymptoms.includes(symptom) && <X className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Bitte zuerst eine Pflanze auswählen.</p>
            )}
          </div>
        </div>
        {selectedSymptoms.length > 0 && (
          <div className="space-y-4 pt-6 border-t dark:border-gray-700">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Mögliche Diagnosen:</h4>
            {diagnosis.length > 0 ? (
              diagnosis.map((diag, index) => (
                <div key={index} className="bg-white dark:bg-gray-800/50 rounded-xl p-4 animate-fade-in">
                  <h5 className="font-bold text-purple-700 dark:text-purple-400 flex items-center"><Stethoscope className="h-5 w-5 mr-2" />{diag.problem}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-7"><strong className="text-gray-800 dark:text-white">Ursache:</strong> {diag.cause}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 pl-7"><strong className="text-gray-800 dark:text-white">Behandlung:</strong> {diag.treatment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Keine passende Diagnose für diese Symptomkombination gefunden.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
