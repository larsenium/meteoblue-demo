'use client';

import { useEffect, useState } from 'react';

interface MeteoData {
  metadata: { name: string; latitude: number; longitude: number };
  units: Record<string, string>;
  data_1h: {
    time: string[];
    temperature: number[];
    windspeed: number[];
    precipitation_probability: number[];
    precipitation: number[];
    isdaylight: number[];
    pictocode: number[];
    // Add more fields as needed
  };
  data_day: {
    time: string[];
    temperature_max: number[];
    temperature_min: number[];
    precipitation: number[];
    windspeed_mean: number[];
  };
}

export default function WeatherPage() {
  const [data, setData] = useState<MeteoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then((json: MeteoData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading forecast...</div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-500">Error loading data</div>;

  const today = data.data_day.time[0];
  const currentTemp = data.data_1h.temperature[data.data_1h.time.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {data.metadata.name}
          </h1>
          <p className="text-3xl text-gray-700 mb-1">{currentTemp.toFixed(1)}°C</p>
          <p className="text-lg text-gray-500">
            {data.metadata.latitude.toFixed(3)}, {data.metadata.longitude.toFixed(3)}
          </p>
        </div>

        {/* Daily Summary */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Daily Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {data.data_day.time.slice(0, 7).map((date, i) => {
              const maxT = data.data_day.temperature_max[i];
              const minT = data.data_day.temperature_min[i];
              const precip = data.data_day.precipitation[i];
              return (
                <div key={date} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="font-semibold text-gray-800">{date}</div>
                  <div className="text-2xl font-bold text-blue-600">{maxT}°</div>
                  <div className="text-sm text-gray-500">{minT}°</div>
                  {precip > 0 && (
                    <div className="mt-2 text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                      {precip}mm rain
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Hourly Forecast */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Next 24 Hours</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {data.data_1h.time.slice(-24).map((time, i) => {
              const idx = data.data_1h.time.length - 24 + i;
              const temp = data.data_1h.temperature[idx];
              const wind = data.data_1h.windspeed[idx];
              const precipProb = data.data_1h.precipitation_probability[idx];
              const isDay = data.data_1h.isdaylight[idx];

              return (
                <div key={time} className="text-center p-4 rounded-xl bg-gradient-to-b from-white/50 to-gray-50 hover:shadow-md transition-all border">
                  <div className="text-xs text-gray-500">
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{temp.toFixed(1)}°</div>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-2">
                    <span>{wind.toFixed(1)}m/s</span>
                    {precipProb > 20 && (
                      <span className="ml-1 text-blue-500">● {precipProb}%</span>
                    )}
                  </div>
                  <div className={`w-3 h-3 mx-auto mt-1 rounded-full ${isDay ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}