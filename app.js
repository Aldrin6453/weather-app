const apiKey = '94f548a21862512b6dac47a85ed227c7';
let unit = 'metric'; // Default to Celsius

// Function to change units
function changeUnit(selectedUnit) {
    unit = selectedUnit;
}

// Get weather data by city name
async function getWeather() {
    const city = document.getElementById('city').value;
    if (city) {
        await fetchWeatherData(`q=${city}`);
        await fetchForecastData(`q=${city}`);
    } else {
        document.getElementById('weather-result').innerHTML = '<p>Please enter a city.</p>';
    }
}

// Get weather data using the user's current location
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchWeatherData(`lat=${lat}&lon=${lon}`);
            await fetchForecastData(`lat=${lat}&lon=${lon}`);
        }, () => {
            document.getElementById('weather-result').innerHTML = '<p>Unable to retrieve location.</p>';
        });
    } else {
        document.getElementById('weather-result').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

// Function to fetch weather data and display it
async function fetchWeatherData(query) {
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${unit}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeatherData(data);
        } else {
            document.getElementById('weather-result').innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById('weather-result').innerHTML = '<p>Error fetching weather data.</p>';
        console.error('Error fetching weather data:', error);
    }
}

// Function to display weather data on the page
function displayWeatherData(data) {
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const cityName = data.name;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    const windUnit = unit === 'metric' ? 'm/s' : 'mph';

    const weatherDisplay = `
        <div class="weather-info">
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
            <p><strong>Description:</strong> ${weatherDescription}</p>
            <p><strong>Temperature:</strong> ${temperature} ${unitSymbol}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} ${windUnit}</p>
        </div>
    `;
    document.getElementById('weather-result').innerHTML = weatherDisplay;
}

// Fetch 5-day forecast data
async function fetchForecastData(query) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=${unit}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "200") {
            displayForecastData(data);
        } else {
            document.getElementById('forecast-result').innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById('forecast-result').innerHTML = '<p>Error fetching forecast data.</p>';
        console.error('Error fetching forecast data:', error);
    }
}

// Display 5-day forecast
function displayForecastData(data) {
    const forecastContainer = document.getElementById('forecast-result');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Filter forecast data to show one forecast per day (at 12:00 PM)
    const dailyForecasts = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        const temperature = forecast.main.temp;
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const unitSymbol = unit === 'metric' ? '°C' : '°F';

        const forecastCard = `
            <div class="forecast-card">
                <p><strong>${day}</strong></p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>${temperature} ${unitSymbol}</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastCard;
    });
}
