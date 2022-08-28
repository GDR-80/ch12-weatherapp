const body = document.querySelector("body");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const dailyForecast = document.getElementById("dailyForecast");
document.getElementById("year").innerHTML = new Date().getFullYear();

export function updateCurrentWeather(data) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const html = `<div class="weather_card current">
      <h2 class="weather_title">The Current Weather for ${data.name} </h2>
       <h3>${regionNames.of(data.sys.country)}</h3>
      <div class="weather_card-body">
        <div class="weather_info">
          <p class="weather_temp">${Math.round(data.main.temp)}&deg;C</p>
           <p class="icon"><span><i class="bi bi-sunrise"></i>${new Date(
             data.sys.sunrise * 1000
           ).toLocaleTimeString([], {
             timeStyle: "short",
           })}</span>
           <span><i class="bi bi-sunset"></i>${new Date(
             data.sys.sunset * 1000
           ).toLocaleTimeString([], {
             timeStyle: "short",
           })}</span></p>
        </div>
        <div class="weather_icon">
          <img src="https://openweathermap.org/img/wn/${
            data.weather[0].icon
          }@4x.png">
            <p class="weather_description">${data.weather[0].description}</p>
        </div>
      </div>
       <p class="updated_at"><small>Updated at ${new Date(
         data.dt * 1000
       ).toLocaleTimeString(data.sys.country, {
         timeStyle: "short",
       })}</small></p>
    </div>`;

  currentWeather.innerHTML = html;
  setBackground(data.weather[0].main, data.sys.sunrise, data.sys.sunset);
}

export function updateTodayForecast(data) {
  const todayForecast = data.list.slice(0, 6);
  const html = todayForecast.map((mappedDay) => {
    return `<div class="weather_info">
                <p>${new Date(mappedDay.dt * 1000).toLocaleTimeString([], {
                  timeStyle: "short",
                })}</p>
                <p class="weather_temp">${Math.round(
                  mappedDay.main.temp
                )}&deg;C</p>
                <div class="weather_icon">
                  <img src="https://openweathermap.org/img/wn/${
                    mappedDay.weather[0].icon
                  }@2x.png">
                  <p class="weather_description">${
                    mappedDay.weather[0].description
                  }</p>
                </div>
            </div>`;
  });

  forecast.innerHTML = `<div class="weather_card forecast_today">
        <h2 class="weather_title">Today's Forecast</h2>
        <div class="weather_card-body">${html.join("")}<div>`;
}

export function updateDailyForecast(data) {
  const dataArray = Object.entries(data);
  const html = dataArray.map((item) => {
    const lowTemp = item[1].length - 1;
    return `<div class="weather_info">
                <p class="day">${
                  new Date().getDay() ===
                  new Date(item[1][0].dt * 1000).getDay()
                    ? "TODAY"
                    : item[0].toUpperCase().slice(0, 3)
                }</p>
                <p class="weather_temp">${Math.round(
                  item[1][0].main.temp
                )}&deg;C</p>
                 <p>${Math.round(item[1][lowTemp].main.temp)}&deg;C</p>
                <div class="weather_icon">
                  <img src="https://openweathermap.org/img/wn/${
                    item[1][0].weather[0].icon
                  }@2x.png">
                  <p class="weather_description">${
                    item[1][0].weather[0].description
                  }</p>
                </div>
            </div>`;
  });
  dailyForecast.innerHTML = `<div class="weather_card forecast_today">
        <h2 class="weather_title">Daily Forecast</h2>
        <div class="weather_card-body">${html.join("")}<div>`;
}

const weatherConditions = {
  Clear: `linear-gradient(180deg, #045de9 0%, #09c6f9 74%)`,
  Clouds: `linear-gradient(180deg, #bdd4e7 0%, #8693ab 74%)`,
  Drizzle: `linear-gradient(180deg, #5d4157, #a8caba)`,
  Thunderstorm: `linear-gradient(180deg, #485563, #29323c)`,
  Rain: `linear-gradient(180deg, #e6dada, #274046)`,
  Haze: `linear-gradient(to top, #cc95c0, #dbd4b4, #7aa1d2)`,
  Night: `linear-gradient(180deg, #2C5364, #203A43, #0F2027)`,
};

function setBackground(conditons, sunrise, sunset) {
  const now = Date.now();
  sunrise *= 1000;
  sunset *= 1000;
  now > sunset || now < sunrise
    ? (body.style.backgroundImage = weatherConditions.Night)
    : (body.style.backgroundImage = weatherConditions[conditons]);
}
