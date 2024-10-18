// OpenWeather API Key
const apiKey = '1340ac07e4e21a0583eb9d220bea362a';
const GapiKey = 'AIzaSyC89dyhyXY9fUjIPtUt_Yx3l8esI7ywcWY'; 

// DOM Elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherWidget = document.getElementById('weatherWidget');
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const tempValue = document.getElementById('tempValue');
const humidityValue = document.getElementById('humidityValue');
const windSpeedValue = document.getElementById('windSpeedValue');
const forecastTableBody = document.getElementById('forecastTableBody');

// Global variable to store current weather and forecast data
let currentWeatherData = null;
let forecastData = null;

// Get weather data based on user's geolocation
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByCoordinates(lat, lon);
        }, (error) => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please enter a city manually.');
        });
    } else {
        alert('Geolocation is not supported by this browser. Please enter a city manually.');
    }
};

// Fetch weather data by city name (for manual input)
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherDataByCity(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Fetch weather data using coordinates (lat/lon)
function fetchWeatherDataByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching weather data.');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            fetchForecastDataByCoordinates(lat, lon);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch weather data for your location.');
        });
}

// Fetch weather data using city name (for manual input)
function fetchWeatherDataByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found or API error.');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            fetchForecastDataByCity(city);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch weather data for the city.');
        });
}

// Display weather data in the widget
function displayWeatherData(data) {
    currentWeatherData = data;
    cityName.textContent = data.name;
    weatherDesc.textContent = data.weather[0].description;
    const celsiusTemp = data.main.temp;
    const fahrenheitTemp = convertTemperature(celsiusTemp, true);
    tempValue.setAttribute('data-celsius', celsiusTemp);
    tempValue.setAttribute('data-fahrenheit', fahrenheitTemp);
    tempValue.textContent = `${celsiusTemp}°`;  // Default display in Celsius
    humidityValue.textContent = data.main.humidity;
    windSpeedValue.textContent = data.wind.speed;

     // Update the icon
     const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
     document.getElementById('weatherIcon').src = iconUrl;
}

// Fetch 5-day forecast data using coordinates (lat/lon)
function fetchForecastDataByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecastData(data);
            generateCharts(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Fetch 5-day forecast data using city name (for manual input)
function fetchForecastDataByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecastData(data);
            generateCharts(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}



function displayForecastData(data) {
    forecastData = data;
    updateTable('all'); // Ensure the table is populated based on the current filter upon fetching new data
}

function updateTable(filterType) {
    const forecasts = forecastData.list.filter((forecast, index) => index % 8 === 0);
    forecastTableBody.innerHTML = '';

    forecasts.forEach(forecast => {
        const celsiusTemp = forecast.main.temp;
        const fahrenheitTemp = convertTemperature(celsiusTemp, true);
        const tempDisplay = isCelsius ? `${celsiusTemp}°C` : `${fahrenheitTemp}°F`;
        const row = `
            <tr>
                <td>${forecast.dt_txt}</td>
                <td data-celsius="${celsiusTemp}" data-fahrenheit="${fahrenheitTemp}">${tempDisplay}</td>
                <td>${forecast.weather[0].description}</td>
            </tr>
        `;
        forecastTableBody.insertAdjacentHTML('beforeend', row);
    });

    applyFilter(filterType);
     //Event listener for the dropdown selection change
    document.getElementById('filterSelect').addEventListener('change', function() {
        updateTable(this.value);
    });
}

function applyFilter(filterType) {
    let filteredForecasts = [...forecastData.list.filter((_, index) => index % 8 === 0)];
    switch (filterType) {
        case 'ascending':
            filteredForecasts.sort((a, b) => a.main.temp - b.main.temp);
            break;
        case 'descending':
            filteredForecasts.sort((a, b) => b.main.temp - a.main.temp);
            break;
        case 'rainyDays':
            filteredForecasts = filteredForecasts.filter(forecast => forecast.weather[0].main.toLowerCase().includes('rain'));
            break;
        case 'highestTemp':
            filteredForecasts = [filteredForecasts.reduce((a, b) => a.main.temp > b.main.temp ? a : b)];
            break;
    }

    // Update the table with the filtered data
    forecastTableBody.innerHTML = '';
    filteredForecasts.forEach(forecast => {
        const celsiusTemp = forecast.main.temp;
        const fahrenheitTemp = convertTemperature(celsiusTemp, true);
        const tempDisplay = isCelsius ? `${celsiusTemp}°C` : `${fahrenheitTemp}°F`;
        const row = `
            <tr>
                <td>${forecast.dt_txt}</td>
                <td data-celsius="${celsiusTemp}" data-fahrenheit="${fahrenheitTemp}">${tempDisplay}</td>
                <td>${forecast.weather[0].description}</td>
            </tr>
        `;
        forecastTableBody.insertAdjacentHTML('beforeend', row);
    });
}



// Chatbot integration using Gemini API
const chatbotSubmit = document.getElementById('chatbotSubmit');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotResponse = document.getElementById('chatbotResponse');

// Event listener for chatbot submit button
chatbotSubmit.addEventListener('click', () => {
    const question = chatbotInput.value;
    if (question.trim() !== '') {
        askChatbot(question);
    } else {
        chatbotResponse.textContent = 'Please enter a question.';
    }
});

//AIzaSyC89dyhyXY9fUjIPtUt_Yx3l8esI7ywcWY


function askChatbot(question) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GapiKey}`;

    let context = "You are a weather assistant. ";
    
    // Extract city name from the question
    const cityMatch = question.match(/(?:in|for|about)\s+([A-Za-z\s]+)(?:\?|$)/);
    const city = cityMatch ? cityMatch[1].trim() : null;

    if (city) {
        // Fetch current weather and forecast for the mentioned city
        Promise.all([
            fetchWeatherData(city),
            fetchForecastData(city)
        ]).then(([currentWeather, forecast]) => {
            if (currentWeather) {
                context += `The current weather in ${currentWeather.name} is ${currentWeather.weather[0].description} with a temperature of ${currentWeather.main.temp}°C, humidity of ${currentWeather.main.humidity}%, and wind speed of ${currentWeather.wind.speed} m/s. `;
            }
            if (forecast) {
                context += "The 5-day forecast shows: ";
                forecast.list.filter((_, index) => index % 8 === 0).forEach(f => {
                    context += `${f.dt_txt.split(' ')[0]}: ${f.weather[0].description}, ${f.main.temp}°C. `;
                });
            }
            sendChatbotRequest(url, context, question);
        }).catch(error => {
            console.error('Error fetching weather data:', error);
            sendChatbotRequest(url, context, question);
        });
    } else {
        // If no city is mentioned, use the current weather data if available
        if (currentWeatherData) {
            context += `The current weather in ${currentWeatherData.name} is ${currentWeatherData.weather[0].description} with a temperature of ${currentWeatherData.main.temp}°C, humidity of ${currentWeatherData.main.humidity}%, and wind speed of ${currentWeatherData.wind.speed} m/s. `;
        }
        if (forecastData) {
            context += "The 5-day forecast shows: ";
            forecastData.list.filter((_, index) => index % 8 === 0).forEach(forecast => {
                context += `${forecast.dt_txt.split(' ')[0]}: ${forecast.weather[0].description}, ${forecast.main.temp}°C. `;
            });
        }
        sendChatbotRequest(url, context, question);
    }
}


function sendChatbotRequest(url, context, question) {
    const requestBody = {
        contents: [{
            parts: [{
                text: context + "User's question: " + question
            }]
        }]
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(`Error: ${response.status} - ${errData.error?.message || response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Raw API Response:', data);
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            displayChatbotResponse(data.candidates[0].content.parts[0].text);
        } else {
            chatbotResponse.textContent = 'No response from the chatbot.';
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        chatbotResponse.textContent = error.message || 'Failed to get a response from the chatbot.';
    });
}

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    return fetch(url).then(response => response.json());
}

function fetchForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    return fetch(url).then(response => response.json());
}

// Function to display chatbot response
function displayChatbotResponse(responseText) {
    chatbotResponse.textContent = responseText || 'No response from the chatbot.';
}




 
function initializeCharts() {
    // Bar Chart
    window.tempBarChart = new Chart(document.getElementById('tempBarChart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Doughnut Chart
    window.weatherDoughnutChart = new Chart(document.getElementById('weatherDoughnutChart'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: 'Weather Conditions',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Line Chart
    window.tempLineChart = new Chart(document.getElementById('tempLineChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call initializeCharts when the script loads
initializeCharts();



function generateCharts(data) {
    const tempData = data.list.filter((_, i) => i % 8 === 0).map(f => f.main.temp);
    const labels = data.list.filter((_, i) => i % 8 === 0).map(f => f.dt_txt.split(' ')[0]);

    // Update Bar Chart
    window.tempBarChart.data.labels = labels;
    window.tempBarChart.data.datasets[0].data = tempData;
    window.tempBarChart.update();

    // Update Line Chart
    window.tempLineChart.data.labels = labels;
    window.tempLineChart.data.datasets[0].data = tempData;
    window.tempLineChart.update();

    // Prepare weather condition data for the doughnut chart
    const weatherConditions = {};
    data.list.forEach(forecast => {
        const condition = forecast.weather[0].main;
        weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
    });

    // Update Doughnut Chart
    window.weatherDoughnutChart.data.labels = Object.keys(weatherConditions);
    window.weatherDoughnutChart.data.datasets[0].data = Object.values(weatherConditions);
    window.weatherDoughnutChart.update();
}




let isCelsius = true; // Track the current unit, starting with Celsius

// Function to convert temperature between Celsius and Fahrenheit
function convertTemperature(temp, toFahrenheit = true) {
    return toFahrenheit ? (temp * 9/5 + 32).toFixed(2) : ((temp - 32) * 5/9).toFixed(2);
}

// Function to update all displayed temperatures
function updateTemperatures() {
    if (currentWeatherData) {
        tempValue.textContent = convertTemperature(parseFloat(tempValue.textContent), !isCelsius);
    }
    if (forecastData) {
        for (let forecast of forecastData.list) {
            const tempElement = document.querySelector(`#temp-${forecast.dt}`);
            if (tempElement) {
                tempElement.textContent = convertTemperature(parseFloat(tempElement.textContent), !isCelsius);
            }
        }
    }
}

// Event listener for the toggle button
// Toggle temperatures between Celsius and Fahrenheit
document.getElementById('toggleTempUnit').addEventListener('click', () => {
    const temperatures = document.querySelectorAll('[data-celsius]');
    temperatures.forEach(tempElement => {
        const celsius = tempElement.getAttribute('data-celsius');
        const fahrenheit = tempElement.getAttribute('data-fahrenheit');
        tempElement.textContent = isCelsius ? `${fahrenheit}°F` : `${celsius}°C`;
    });
    isCelsius = !isCelsius;
    document.getElementById('toggleTempUnit').textContent = isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius";
});


