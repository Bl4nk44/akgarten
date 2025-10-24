import React, { useState } from 'react';
// import { useQuery } from 'convex/react';
// import { api } from '../../../convex/_generated/api';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function SeasonalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  // Usunięty hook useQuery
  // const tasks = useQuery(api.plants.getGardenTasks, { month: selectedMonth });

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const defaultTasks = [
    {
      task: 'Winterschutz für empfindliche Pflanzen',
      category: 'Pflege',
      priority: 'hoch',
      description: 'Schützen Sie frostempfindliche Pflanzen vor Kälte.'
    },
    {
      task: 'Gartenplanung für das neue Jahr',
      category: 'Planung',
      priority: 'mittel',
      description: 'Planen Sie neue Projekte und Bepflanzungen.'
    },
    {
      task: 'Werkzeuge reinigen und warten',
      category: 'Wartung',
      priority: 'niedrig',
      description: 'Reinigen und ölen Sie Ihre Gartengeräte.'
    }
  ];

  // Używamy teraz tylko domyślnych zadań
  const currentTasks = defaultTasks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hoch': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'mittel': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'niedrig': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pflege': return '🌿';
      case 'Planung': return '📋';
      case 'Wartung': return '🔧';
      case 'Ernte': return '🥕';
      case 'Aussaat': return '🌱';
      default: return '🌸';
    }
  };

  const nextMonth = () => {
    setSelectedMonth(selectedMonth === 12 ? 1 : selectedMonth + 1);
  };

  const prevMonth = () => {
    setSelectedMonth(selectedMonth === 1 ? 12 : selectedMonth - 1);
  };

  return (
    // ... (JSX bez zmian)
    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Saisonaler Garten-Kalender
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Entdecken Sie monatliche Gartenaufgaben und saisonale Tipps.
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-md">
          <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {months[selectedMonth - 1]}
          </span>
        </div>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTasks.map((task, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{getCategoryIcon(task.category)}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {task.task}
            </h4>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {task.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                {task.category}
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal Tips */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Saisonale Tipps für {months[selectedMonth - 1]}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🌡️</div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">Wetter beachten</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Achten Sie auf Wettervorhersagen für optimale Gartenarbeit.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💧</div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">Bewässerung anpassen</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Passen Sie die Bewässerung an die Jahreszeit an.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
