import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const gardenTasksByMonth = [
  { month: 'Januar', tips: [{ title: 'Frostschutz prüfen', description: 'Kontrollieren Sie den Winterschutz an empfindlichen Pflanzen.' }, { title: 'Planung für das Jahr', description: 'Bestellen Sie Saatgut und planen Sie die Beete.' }], tasks: [{ task: 'Obstbäume schneiden', category: 'Obst', priority: 'mittel', description: 'Beginnen Sie den Winterschnitt bei Kernobst an frostfreien Tagen.' }, { task: 'Werkzeugwartung', category: 'Wartung', priority: 'niedrig', description: 'Reinigen, schärfen und ölen Sie alle Gartengeräte.' }, { task: 'Kaltkeimer aussäen', category: 'Aussaat', priority: 'hoch', description: 'Einige Stauden benötigen eine Kälteperiode zum Keimen.' }] },
  { month: 'Februar', tips: [{ title: 'Frühbeete vorbereiten', description: 'Lüften Sie Frühbeete an sonnigen Tagen.' }, { title: 'Nistkästen anbringen', description: 'Hängen Sie Nistkästen für Vögel auf.' }], tasks: [{ task: 'Aussaat von Gemüse', category: 'Gemüse & Kräuter', priority: 'hoch', description: 'Säen Sie Paprika, Chili und Auberginen im Haus aus.' }, { task: 'Sommerblüher beschneiden', category: 'Ziergarten', priority: 'mittel', description: 'Schneiden Sie spätblühende Sträucher kräftig zurück.' }, { task: 'Bodenproben nehmen', category: 'Planung', priority: 'niedrig', description: 'Analysieren Sie den Boden, um den Nährstoffbedarf zu ermitteln.' }] },
  { month: 'März', tips: [{ title: 'Kompost umsetzen', description: 'Reifer Kompost kann nun auf den Beeten verteilt werden.' }, { title: 'Winterschutz entfernen', description: 'Entfernen Sie schrittweise den Winterschutz.' }], tasks: [{ task: 'Rasen vertikutieren', category: 'Rasen', priority: 'hoch', description: 'Entfernen Sie Moos und Rasenfilz.' }, { task: 'Kartoffeln vorkeimen', category: 'Gemüse & Kräuter', priority: 'mittel', description: 'Legen Sie Kartoffeln an einen hellen Ort zum Vorkeimen.' }, { task: 'Rosen schneiden', category: 'Ziergarten', priority: 'hoch', description: 'Schneiden Sie Rosen zurück, sobald die Forsythien blühen.' }] },
  { month: 'April', tips: [{ title: 'Schnecken bekämpfen', description: 'Schützen Sie junge Triebe.' }, { title: 'Regelmäßig lüften', description: 'Gewächshäuser und Frühbeete brauchen Luft.' }], tasks: [{ task: 'Gemüse auspflanzen', category: 'Gemüse & Kräuter', priority: 'hoch', description: 'Robuste Sorten können ins Freiland.' },{ task: 'Rasen düngen', category: 'Rasen', priority: 'hoch', description: 'Eine erste Düngung stärkt den Rasen.' },{ task: 'Dahlienknollen pflanzen', category: 'Ziergarten', priority: 'mittel', description: 'Ab Mitte des Monats können die Knollen in die Erde.' }] },
  { month: 'Mai', tips: [{ title: 'Eisheilige beachten', description: 'Warten Sie mit frostempfindlichen Pflanzen.' }, { title: 'Unkraut jäten', description: 'Halten Sie die Beete unkrautfrei.' }], tasks: [{ task: 'Tomaten und Zucchini pflanzen', category: 'Gemüse & Kräuter', priority: 'hoch', description: 'Nach den Eisheiligen ins Freiland.' },{ task: 'Hecken schneiden', category: 'Pflege', priority: 'mittel', description: 'Erster Formschnitt (Vogelschutz beachten!).' },{ task: 'Blumenzwiebeln düngen', category: 'Ziergarten', priority: 'niedrig', description: 'Verblühte Tulpen und Narzissen stärken.' }] },
  { month: 'Juni', tips: [{ title: 'Ausreichend wässern', description: 'Pflanzen im Kübel brauchen viel Wasser.' }, { title: 'Erste Ernte', description: 'Erdbeeren, Salate und Radieschen ernten.' }], tasks: [{ task: 'Geiztriebe bei Tomaten entfernen', category: 'Gemüse & Kräuter', priority: 'hoch', description: 'Brechen Sie regelmäßig die Seitentriebe aus.' },{ task: 'Rasen mähen', category: 'Rasen', priority: 'hoch', description: 'Nicht zu kurz bei Trockenheit mähen.' },{ task: 'Verblühtes entfernen', category: 'Ziergarten', priority: 'mittel', description: 'Fördert eine Nachblüte bei Rosen und Stauden.' }] },
  { month: 'Juli', tips: [{ title: 'Urlaubsbewässerung planen', description: 'Organisieren Sie eine Bewässerungslösung.' }, { title: 'Kräuter trocknen', description: 'Ernten Sie Kräuter zum Konservieren.' }], tasks: [{ task: 'Beerensträucher schneiden', category: 'Obst', priority: 'mittel', description: 'Johannis- und Stachelbeeren nach der Ernte schneiden.' },{ task: 'Folgesaaten', category: 'Aussaat', priority: 'hoch', description: 'Säen Sie schnellwachsende Gemüse nach.' },{ task: 'Sommerschnitt bei Obstbäumen', category: 'Obst', priority: 'niedrig', description: 'Beruhigt das Wachstum und fördert Fruchtbildung.' }] },
  { month: 'August', tips: [{ title: 'Haupt-Erntezeit', description: 'Viele Sorten sind jetzt reif.' }, { title: 'Samen sammeln', description: 'Sammeln Sie Samen für das nächste Jahr.' }], tasks: [{ task: 'Erdbeeren pflanzen', category: 'Obst', priority: 'hoch', description: 'Neue Pflanzen für reiche Ernte im nächsten Jahr setzen.' },{ task: 'Hecken schneiden (2. Schnitt)', category: 'Pflege', priority: 'mittel', description: 'Der zweite Hauptschnitt für Formhecken.' },{ task: 'Herbstzeitlose pflanzen', category: 'Ziergarten', priority: 'niedrig', description: 'Zwiebeln für eine Herbstblüte pflanzen.' }] },
  { month: 'September', tips: [{ title: 'Fallobst aufsammeln', description: 'Beugt Krankheiten vor.' }, { title: 'Pflanzen für den Herbst', description: 'Setzen Sie Herbstblumen in Kübel und Beete.' }], tasks: [{ task: 'Rasenpflege im Herbst', category: 'Rasen', priority: 'hoch', description: 'Vertikutieren, düngen und bei Bedarf kalken.' },{ task: 'Frühblüher-Zwiebeln stecken', category: 'Aussaat', priority: 'hoch', description: 'Tulpen, Narzissen und Krokusse in die Erde.' },{ task: 'Knoblauch stecken', category: 'Gemüse & Kräuter', priority: 'mittel', description: 'Im Herbst gesteckter Knoblauch wird kräftiger.' }] },
  { month: 'Oktober', tips: [{ title: 'Laub rechen', description: 'Nutzen Sie Laub als Frostschutz oder für den Kompost.' }, { title: 'Gartenmöbel einlagern', description: 'Reinigen und trocken lagern.' }], tasks: [{ task: 'Garten winterfest machen', category: 'Pflege', priority: 'hoch', description: 'Wasserleitungen entleeren, Kübel einräumen.' },{ task: 'Stauden teilen', category: 'Ziergarten', priority: 'mittel', description: 'Verjüngen Sie Stauden durch Teilung.' },{ task: 'Igelquartiere schaffen', category: 'Pflege', priority: 'niedrig', description: 'Lassen Sie Laubhaufen als Unterschlupf liegen.' }] },
  { month: 'November', tips: [{ title: 'Boden umgraben', description: 'Schwere Böden grob umgraben, Frost erledigt den Rest.' }, { title: 'Vogelfutter bereitstellen', description: 'Beginnen Sie mit der Winterfütterung.' }], tasks: [{ task: 'Rosen anhäufeln', category: 'Ziergarten', priority: 'hoch', description: 'Schützen Sie die Veredelungsstelle mit Erde.' },{ task: 'Leimringe an Obstbäumen', category: 'Obst', priority: 'mittel', description: 'Fängt den Frostspanner ab.' },{ task: 'Letzter Rasenschnitt', category: 'Rasen', priority: 'niedrig', description: 'Nicht kürzer als 5 cm mähen.' }] },
  { month: 'Dezember', tips: [{ title: 'Schnee von Ästen schütteln', description: 'Vermeidet Astbruch bei Immergrünen.' }, { title: 'Barbarazweige schneiden', description: 'Blühen zu Weihnachten in der Vase.' }], tasks: [{ task: 'Gartenteich eisfrei halten', category: 'Pflege', priority: 'mittel', description: 'Sorgt für Gasaustausch.' },{ task: 'Kalken des Bodens', category: 'Pflege', priority: 'niedrig', description: 'Wenn der pH-Wert zu niedrig ist, jetzt kalken.' },{ task: 'Inventur machen', category: 'Planung', priority: 'niedrig', description: 'Saatgut- und Düngerbestände prüfen.' }] },
];

export default function SeasonalCalendar() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  
  const currentMonthData = gardenTasksByMonth[selectedMonthIndex];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hoch': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'mittel': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'niedrig': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Gemüse')) return '🥕';
    if (category.includes('Obst')) return '🍎';
    if (category.includes('Ziergarten')) return '🌸';
    if (category.includes('Rasen')) return '🌿';
    if (category.includes('Wartung')) return '🔧';
    if (category.includes('Planung')) return '📋';
    if (category.includes('Aussaat')) return '🌱';
    return '🌱';
  };

  const nextMonth = () => {
    setSelectedMonthIndex((selectedMonthIndex + 1) % 12);
  };

  const prevMonth = () => {
    setSelectedMonthIndex((selectedMonthIndex - 1 + 12) % 12);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Saisonaler Garten-Kalender
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Entdecken Sie monatliche Gartenaufgaben und saisonale Tipps.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-8">
        <button onClick={prevMonth} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-md">
          <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white w-28 text-center">
            {currentMonthData.month}
          </span>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[18rem]">
        {currentMonthData.tasks.map((task, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
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
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Saisonale Tipps für {currentMonthData.month}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {currentMonthData.tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
