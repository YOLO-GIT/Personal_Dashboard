import React, { useState, useEffect } from 'react';
import {
    Sun,
    Moon,
    Cloud,
    CloudRain,
    CloudLightning,
    Snowflake,
    MapPin,
    Loader2
} from 'lucide-react';

export default function Header() {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState({ temp: null, code: null, loading: true, locationName: 'Local' });

    // 1. Live Clock Timer (Updates every second)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Fetch Weather Data (With LibreWolf Geolocation Fallback)
    useEffect(() => {
        const fetchWeather = async (lat, lon, locationLabel) => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
                );
                const data = await res.json();
                if (data?.current) {
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        code: data.current.weather_code,
                        loading: false,
                        locationName: locationLabel
                    });
                }
            } catch (err) {
                console.error("Failed to fetch weather:", err);
                setWeather(prev => ({ ...prev, loading: false }));
            }
        };

        // Default Fallback Coordinates (Subang Jaya / KL) if Geolocation is blocked by LibreWolf
        const defaultLat = 3.1390;
        const defaultLon = 101.6869;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Nearby'),
                () => fetchWeather(defaultLat, defaultLon, 'Default Region'), // On permission denied/blocked
                { timeout: 5000 }
            );
        } else {
            fetchWeather(defaultLat, defaultLon, 'Default Region');
        }
    }, []);

    // Dynamic Greeting Logic
    const hour = time.getHours();
    const getGreeting = () => {
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 18) return 'Good Afternoon';
        if (hour >= 18 && hour < 22) return 'Good Evening';
        return 'Good Night';
    };

    // Weather Icon & Description Mapper
    const getWeatherDetails = (code) => {
        if (code === null) return { icon: Cloud, label: 'Unknown' };
        if (code === 0) return { icon: hour >= 6 && hour < 19 ? Sun : Moon, label: 'Clear' };
        if (code >= 1 && code <= 3) return { icon: Cloud, label: 'Partly Cloudy' };
        if (code >= 51 && code <= 67) return { icon: CloudRain, label: 'Rainy' };
        if (code >= 71 && code <= 77) return { icon: Snowflake, label: 'Snowy' };
        if (code >= 95) return { icon: CloudLightning, label: 'Thunderstorm' };
        return { icon: Cloud, label: 'Overcast' };
    };

    const { icon: WeatherIcon, label: weatherLabel } = getWeatherDetails(weather.code);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-800/60">
            {/* Dynamic Greeting & Date */}
            <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {getGreeting()}!
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            {/* Clock & Weather Widgets */}
            <div className="flex items-center gap-4">
                {/* Weather Card */}
                <div className="flex items-center gap-3 bg-[#1E1E1E] border border-gray-800 px-4 py-2.5 rounded-2xl">
                    {weather.loading ? (
                        <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    ) : (
                        <>
                            <WeatherIcon className="w-6 h-6 text-emerald-400" />
                            <div>
                                <p className="text-sm font-bold text-white leading-none">
                                    {weather.temp !== null ? `${weather.temp}°C` : '--'}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-gray-500" /> {weatherLabel}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Live Clock Card */}
                <div className="bg-[#1E1E1E] border border-gray-800 px-4 py-2.5 rounded-2xl min-w-30 text-center">
                    <p className="text-lg font-mono font-bold text-white tracking-wider leading-none">
                        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                        Local Time
                    </p>
                </div>
            </div>
        </div>
    );
}