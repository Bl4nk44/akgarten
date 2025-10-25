import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Thermometer, Calendar, Wind } from 'lucide-react';

// Interfejsy dla typowania danych z API
interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

// Mapowanie kodów pogodowych WMO na ikony i opisy
const getWeatherInfo = (code: number) => {
  if ([0, 1].includes(code)) return { Icon: Sun, description: 'Sonnig' };
  if ([2].includes(code)) return { Icon: Cloud, description: 'Leicht bewölkt' };
  if ([3].includes(code)) return { Icon: Cloud, description: 'Bewölkt' };
  if ([45, 48].includes(code)) return { Icon: Cloud, description: 'Nebel' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { Icon: CloudRain, description: 'Regen' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { Icon: CloudSnow, description: 'Schnee' };
  if ([95, 96, 99].includes(code)) return { Icon: CloudLightning, description: 'Gewitter' };
  return { Icon: Sun, description: 'Unbekannt' };
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Współrzędne dla Berlina
      const lat = 52.52;
      const lon = 13.41;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Berlin`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Wetterdaten konnten nicht geladen werden.');
        }
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <p className="text-red-500">{error || 'Wetterdaten nicht verfügbar.'}</p>
      </div>
    );
  }

  const { Icon: CurrentIcon, description: currentDescription } = getWeatherInfo(weather.current_weather.weathercode);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Wetter in Berlin
      </h3>
      
      {/* Current Weather */}
      <div className="text-center mb-8 p-6 bg-green-100 dark:bg-green-900 rounded-2xl">
        <p className="text-lg text-gray-700 dark:text-gray-300">{currentDescription}</p>
        <div className="flex items-center justify-center my-4">
          <CurrentIcon className="h-16 w-16 text-green-600 dark:text-green-400" />
          <p className="text-6xl font-bold text-gray-900 dark:text-white ml-4">
            {Math.round(weather.current_weather.temperature)}°C
          </p>
        </div>
        <div className="flex justify-center space-x-4 text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5" />
            <span>{weather.current_weather.windspeed} km/h</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="space-y-4 flex-grow">
        <h4 className="font-semibold text-center text-gray-900 dark:text-white mb-4">7-Tage-Vorschau</h4>
        {weather.daily.time.slice(0, 7).map((day, index) => {
          const { Icon } = getWeatherInfo(weather.daily.weathercode[index]);
          return (
            <div key={day} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              <p className="font-semibold w-1/4">
                {new Date(day).toLocaleDateString('de-DE', { weekday: 'short' })}
              </p>
              <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div className="w-1/3 text-right">
                <span className="font-bold">{Math.round(weather.daily.temperature_2m_max[index])}°</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2"> / {Math.round(weather.daily.temperature_2m_min[index])}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
