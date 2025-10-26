import { useState, useMemo } from 'react';
import { Leaf, Stethoscope, X } from 'lucide-react';
import { diagnosticData } from '../../data/plantDiagnosticData';

export default function PlantDiagnostic() {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const plantNames = useMemo(() => [...new Set(diagnosticData.map(d => d.plantName))], []);

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

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlant(e.target.value);
    setSelectedSymptoms([]);
  };
  
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
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Pflanze auswählen</label>
            <select value={selectedPlant} onChange={handlePlantChange} className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-600">
              <option value="">-- Pflanze wählen --</option>
              {plantNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
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
                        : 'bg-white dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600'
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
                  <h5 className="font-bold text-purple-700 dark:text-purple-400">{diag.problem}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1"><strong className="dark:text-white">Ursache:</strong> {diag.cause}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1"><strong className="dark:text-white">Behandlung:</strong> {diag.treatment}</p>
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
