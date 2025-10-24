import React, { useState } from 'react';
// import { useQuery } from 'convex/react';
// import { api } from '../../../convex/_generated/api';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function PlantDiagnostic() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // Usunięty hook useQuery
  // const diagnosis = useQuery(api.plants.diagnosePlant, 
  //   selectedSymptoms.length > 0 ? { symptoms: selectedSymptoms } : "skip"
  // );

  // Statyczna diagnoza
  const diagnosis = selectedSymptoms.length > 0 ? {
    diagnosis: `Mögliches Problem: Überwässerung oder Schädlingsbefall bei ${selectedSymptoms.length} Symptom(en).`,
    treatment: "Reduzieren Sie die Bewässerung und prüfen Sie die Pflanze auf Schädlinge. Verwenden Sie bei Bedarf ein geeignetes Mittel.",
    prevention: "Stellen Sie sicher, dass der Topf eine gute Drainage hat und die Pflanze nicht in Staunässe steht."
  } : null;

  const symptoms = [
    'Gelbe Blätter',
    'Braune Blattspitzen',
    'Welke Blätter',
    'Flecken auf Blättern',
    'Schädlinge sichtbar',
    'Langsames Wachstum',
    'Blätter fallen ab',
    'Verfärbte Stängel',
    'Schimmel/Pilz',
    'Löcher in Blättern',
    'Klebrige Blätter',
    'Trockene Erde'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getDiagnosisIcon = (diagnosisText: string) => {
    if (diagnosisText.includes('Unbekannt')) {
      return <Info className="h-8 w-8 text-blue-600" />;
    } else if (diagnosisText.includes('Problem') || diagnosisText.includes('Krankheit')) {
      return <AlertTriangle className="h-8 w-8 text-red-600" />;
    } else {
      return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
  };

  const resetDiagnosis = () => {
    setSelectedSymptoms([]);
  };

  return (
    // ... (JSX bez zmian)
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Pflanzen-Diagnose Tool
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Wählen Sie die Symptome Ihrer Pflanze aus und erhalten Sie eine Diagnose.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Symptom Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-6 w-6 text-purple-600" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              Symptome auswählen:
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {symptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`p-3 rounded-xl text-left transition-all duration-300 ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedSymptoms.includes(symptom) ? 'bg-white' : 'bg-purple-300'
                  }`}></div>
                  <span className="text-sm font-medium">{symptom}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {selectedSymptoms.length} Symptom(e) ausgewählt
            </span>
            <button
              onClick={resetDiagnosis}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Zurücksetzen
            </button>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div>
          {diagnosis && selectedSymptoms.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  {getDiagnosisIcon(diagnosis.diagnosis)}
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Diagnose
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {diagnosis.diagnosis}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Behandlung
                </h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {diagnosis.treatment}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Vorbeugung
                </h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {diagnosis.prevention}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Hinweis:</strong> Diese Diagnose ist nur eine Hilfestellung. 
                      Bei schwerwiegenden Problemen konsultieren Sie einen Gartenexperten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400">
                Wählen Sie mindestens ein Symptom aus, um eine Diagnose zu erhalten.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
