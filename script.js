// script.js

// Select DOM elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        displayError("Please enter a city name!");
    }
});

// Event listener for pressing 'Enter' key in the input field
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} city - The city name entered by the user
 */
async function fetchWeatherData(city) {
    const apiKey = "438215ed1b7c706827d9a8e7ba2534fd"; // Replace with your OpenWeatherMap API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    try {
        // Show loading message
        displayLoading();

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeatherData(data);
        } else {
            // Handle errors returned by the API
            displayError(data.message || "An error occurred while fetching the data.");
        }
    } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("Error fetching weather data:", error);
        displayError("Unable to retrieve data. Please try again later.");
    }
}

/**
 * Display the fetched weather data on the page
 * @param {object} data - The weather data object returned by the API
 */
function displayWeatherData(data) {
    // Clear any previous error messages
    clearError();

    // Construct the HTML content
    const weatherHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${capitalizeFirstLetter(data.weather[0].description)}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description} icon">
    `;

    // Update the weather display section
    weatherDisplay.innerHTML = weatherHTML;
    weatherDisplay.classList.remove('hidden');
}

/**
 * Display an error message to the user
 * @param {string} message - The error message to display
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherDisplay.classList.add('hidden');
}

/**
 * Clear any displayed error messages
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

/**
 * Display a loading message while fetching data
 */
function displayLoading() {
    const loadingHTML = `
        <p>Loading...</p>
    `;
    weatherDisplay.innerHTML = loadingHTML;
    weatherDisplay.classList.remove('hidden');
    clearError();
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
