const OPENWEATHER_API_KEY = '33fdcc1afb7b2a96836c3dd3b4ec0c83';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper to check cache
function getFromCache(key) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    } catch (e) { return null; }
}

function setToCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {}
}

export async function fetchFullWeatherByCity(cityName) {
    const cacheKey = `weather_city_${cityName.toLowerCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const [currRes, forecastRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    ]);

    if (!currRes.ok || !forecastRes.ok) throw new Error("API Error");
    
    const currData = await currRes.json();
    const forecastData = await forecastRes.json();
    
    const result = formatCombinedData(currData, forecastData);
    setToCache(cacheKey, result);
    return result;
}

export async function fetchFullWeatherByCoords(lat, lon) {
    const cacheKey = `weather_coords_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const [currRes, forecastRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    ]);

    if (!currRes.ok || !forecastRes.ok) throw new Error("API Error");
    
    const currData = await currRes.json();
    const forecastData = await forecastRes.json();
    
    const result = formatCombinedData(currData, forecastData);
    setToCache(cacheKey, result);
    return result;
}

function formatCombinedData(currData, forecastData) {
    const current = {
        name: currData.name,
        country: currData.sys?.country,
        temp: currData.main?.temp,
        feelsLike: currData.main?.feels_like,
        humidity: currData.main?.humidity,
        pressure: currData.main?.pressure,
        weatherCode: currData.weather?.[0]?.id,
        description: currData.weather?.[0]?.description,
        windSpeed: currData.wind?.speed,
        windDir: currData.wind?.deg,
        visibility: currData.visibility,
        sunrise: currData.sys?.sunrise,
        sunset: currData.sys?.sunset,
        dt: currData.dt
    };

    // 5 day / 3 hr gives 40 records. Use the first 8 for "hourly" interpolation (next 24 hours)
    const hourly = forecastData.list.slice(0, 8).map(item => ({
        time: item.dt * 1000,
        temp: item.main.temp,
        weatherCode: item.weather[0].id
    }));

    // Group by day for daily max/min
    const dailyMap = {};
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap[date]) { dailyMap[date] = { temp_min: item.main.temp_min, temp_max: item.main.temp_max, codes: {} }; }
        dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, item.main.temp_min);
        dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp_max);
        const code = item.weather[0].id;
        dailyMap[date].codes[code] = (dailyMap[date].codes[code] || 0) + 1;
    });

    const daily = Object.keys(dailyMap).map(k => {
        const mainCode = Object.keys(dailyMap[k].codes).reduce((a, b) => dailyMap[k].codes[a] > dailyMap[k].codes[b] ? a : b);
        return {
            date: k,
            min: dailyMap[k].temp_min,
            max: dailyMap[k].temp_max,
            weatherCode: parseInt(mainCode)
        };
    }).slice(0, 5); // Best approximation of 5-Day UI mapping

    return { current, hourly, daily };
}

export function initLocalWeather() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("No geolocation"));
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try { resolve(await fetchFullWeatherByCoords(pos.coords.latitude, pos.coords.longitude)); } 
                catch (e) { reject(e); }
            },
            e => reject(e)
        );
    });
}

// Debounce helper
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
