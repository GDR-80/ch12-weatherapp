export function errorData(error) {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    currentWeather.innerHTML = `<h3 class="error">${error.response.data.message.toUpperCase()}</h3>`;
    forecast.innerHTML = ``;
    dailyForecast.innerHTML = ``;
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
    currentWeather.innerHTML = `<h4>${error.message}</h4>`;
    forecast.innerHTML = ``;
    dailyForecast.innerHTML = ``;
  }
}

// processes data and gets weather data for each day of the week and returns an array of objects

export function processData(data) {
  const day = data.list;

  const daysOfWeekArray = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const daysOfWeek = {};

  day.reduce((accumulator, currentDay) => {
    if (accumulator[daysOfWeekArray[new Date(currentDay.dt * 1000).getDay()]]) {
      accumulator[
        daysOfWeekArray[new Date(currentDay.dt * 1000).getDay()]
      ].push(currentDay);
    } else {
      accumulator[daysOfWeekArray[new Date(currentDay.dt * 1000).getDay()]] =
        [];
      accumulator[
        daysOfWeekArray[new Date(currentDay.dt * 1000).getDay()]
      ].push(currentDay);
    }
    return accumulator;
  }, daysOfWeek);

  return sortByMaxTemp(daysOfWeek);
}

// sorts by temp, highest temperature is the first in the array

function sortByMaxTemp(daysOfWeek) {
  for (const key in daysOfWeek) {
    const days = daysOfWeek[key];
    days.sort((firstItem, secondItem) => {
      if (firstItem.main.temp > secondItem.main.temp) return -1;
      if (secondItem.main.temp > firstItem.main.temp) return 1;
      return 0;
    });
  }
  return daysOfWeek;
}
