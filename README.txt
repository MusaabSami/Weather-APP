
# Weather Application

## Overview
This project is a weather application that provides real-time weather data and a 5-day forecast for any city. It fetches data from the OpenWeather API and displays it in a user-friendly format, including temperature, weather conditions, and humidity. The app also includes chart visualizations and a chatbot for weather-related questions.

## Features
1. **Real-Time Weather Data**: Provides current weather conditions, including temperature, humidity, and wind speed.
2. **5-Day Forecast**: Displays the weather forecast for the next 5 days in a table format.
3. **Temperature Unit Toggle**: Allows users to switch between Celsius and Fahrenheit.
4. **Chart Visualizations**: Includes bar, doughnut, and line charts to visualize temperature data.
5. **Weather Chatbot**: Ask weather-related questions, and the chatbot provides answers using the Gemini API.

## Technologies Used
- **HTML5**: Structure of the application.
- **CSS3**: Styling and layout.
- **JavaScript**: Handles the logic and interaction with the weather API and charts.
- **Chart.js**: Used to create the weather visualizations.
- **OpenWeather API**: Fetches weather data.
- **Google Gemini API**: Used for the chatbot functionality.

## Files
1. **index.html**: The main structure of the application, including the search bar, weather display, and charts.
2. **styles.css**: Defines the styling and layout of the app.
3. **scripts.js**: Contains JavaScript code to handle API requests, display weather data, update charts, and manage the chatbot interaction.

## Setup
1. Clone the repository.
2. Ensure you have an active internet connection for the APIs.
3. Open `index.html` in a web browser.
4. Ensure geolocation permissions are enabled for real-time location-based weather data.

## How to Use
1. Enter a city name in the search bar and click "Get Weather" to retrieve the weather data.
2. Use the dropdown filter to sort the forecast by temperature or filter by rainy days.
3. Switch between Celsius and Fahrenheit using the toggle button.
4. Interact with the weather chatbot to ask questions about the weather.

## API Keys
- OpenWeather API Key: Required to fetch weather data.
- Gemini API Key: Required to use the chatbot.

## License
This project is licensed under the MIT License.
