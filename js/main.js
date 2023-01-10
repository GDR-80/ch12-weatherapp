import { APIKEY } from "./config.js";
import { errorData, processData } from "./utils.js";
import {
  updateTodayForecast,
  updateCurrentWeather,
  updateDailyForecast,
} from "./htmlGenerator.js";

const placeName = document.getElementById("cityInput");
const btn = document.getElementById("btn");
const currentWeather = document.getElementById("currentWeather");

const success = (position) => {
  const { latitude, longitude } = position.coords;
  getWeatherByLocation(latitude, longitude);
};

const error = (error, insertionPoint = currentWeather) => {
  console.log(error);
  insertionPoint.innerHTML = "Unable to retrieve your location";
};

function getLocation() {
  const config = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  !navigator.geolocation
    ? (currentWeather.textContent =
        "Geolocation is not supported by your browser")
    : (currentWeather.innerHTML = `<h2 class="rotating"><i class="bi bi-brightness-high"></i></h2>
    
    `);
  setTimeout(() => {
    navigator.geolocation.getCurrentPosition(success, error, config);
  }, 2000);
}

// function getFormData() {
//   // placeName.focus();
// }

const searchForm = document.forms["city"];

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getInputValue(placeName);
});

placeName.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getInputValue(placeName);
  }
});

function getInputValue(placeName) {
  getWeatherByPlaceName(placeName.value.toLowerCase());
  searchForm.reset();
  placeName.focus();
}

async function getWeatherByLocation(lat, lon) {
  try {
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`
    );

    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`
    );

    updateCurrentWeather(current.data);
    updateTodayForecast(forecast.data);
    updateDailyForecast(processData(forecast.data));
  } catch (error) {
    errorData(error);
  }
}

async function getWeatherByPlaceName(place) {
  try {
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${APIKEY}&units=metric`
    );

    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${APIKEY}&units=metric`
    );

    updateCurrentWeather(current.data);
    updateTodayForecast(forecast.data);
    updateDailyForecast(processData(forecast.data));
  } catch (error) {
    errorData(error);
  }
}

getLocation();
// getFormData();
