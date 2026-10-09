// Weather data comes from Open-Meteo (https://open-meteo.com), which is free and needs no API key.
var GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
var FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
var HISTORY_KEY = "searched-cities";
var MAX_HISTORY = 5;

var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
var historyCard = document.getElementById("searched-cities-card");
var historyList = document.getElementById("searched-cities-list");
var currentEl = document.getElementById("current-weather-conditions");
var forecastEl = document.getElementById("five-day-forecast");
var messageEl = document.getElementById("message");

// WMO weather codes -> description and OpenWeatherMap icon name
// https://open-meteo.com/en/docs#weathervariables
var WEATHER_CODES = {
  0: ["Clear sky", "01"],
  1: ["Mainly clear", "02"],
  2: ["Partly cloudy", "03"],
  3: ["Overcast", "04"],
  45: ["Fog", "50"],
  48: ["Freezing fog", "50"],
  51: ["Light drizzle", "09"],
  53: ["Drizzle", "09"],
  55: ["Heavy drizzle", "09"],
  56: ["Freezing drizzle", "09"],
  57: ["Freezing drizzle", "09"],
  61: ["Light rain", "10"],
  63: ["Rain", "10"],
  65: ["Heavy rain", "10"],
  66: ["Freezing rain", "13"],
  67: ["Freezing rain", "13"],
  71: ["Light snow", "13"],
  73: ["Snow", "13"],
  75: ["Heavy snow", "13"],
  77: ["Snow grains", "13"],
  80: ["Rain showers", "09"],
  81: ["Rain showers", "09"],
  82: ["Violent rain showers", "09"],
  85: ["Snow showers", "13"],
  86: ["Heavy snow showers", "13"],
  95: ["Thunderstorm", "11"],
  96: ["Thunderstorm with hail", "11"],
  99: ["Thunderstorm with hail", "11"]
};

function describeWeather(code, isDay) {
  var entry = WEATHER_CODES[code] || ["Unknown", "03"];
  return {
    text: entry[0],
    icon: "https://openweathermap.org/img/wn/" + entry[1] + (isDay === 0 ? "n" : "d") + "@2x.png"
  };
}

// UV index color bands from the WHO scale
function uvCategory(uv) {
  if (uv < 3) return { label: "Low", className: "uv-low" };
  if (uv < 6) return { label: "Moderate", className: "uv-moderate" };
  if (uv < 8) return { label: "High", className: "uv-high" };
  if (uv < 11) return { label: "Very high", className: "uv-very-high" };
  return { label: "Extreme", className: "uv-extreme" };
}

function formatDate(isoDate, options) {
  // Open-Meteo returns local dates like "2026-10-09"; parse as local time, not UTC
  var parts = isoDate.slice(0, 10).split("-");
  var date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString(undefined, options);
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- search history ----------

function loadHistory() {
  try {
    var saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveToHistory(cityName) {
  var history = loadHistory().filter(function (name) {
    return name.toLowerCase() !== cityName.toLowerCase();
  });
  history.unshift(cityName);
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  var history = loadHistory();
  historyList.innerHTML = "";
  historyCard.classList.toggle("hide", history.length === 0);
  history.forEach(function (name) {
    var item = el("button", "list-group-item list-group-item-action", name);
    item.type = "button";
    item.addEventListener("click", function () {
      searchCity(name);
    });
    historyList.appendChild(item);
  });
}

// ---------- rendering ----------

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.toggle("hide", !text);
}

function renderCurrent(place, data) {
  var current = data.current;
  var weather = describeWeather(current.weather_code, current.is_day);
  var uvIndex = Number(current.uv_index) || 0; // can be null for some locations
  var uv = uvCategory(uvIndex);

  currentEl.innerHTML = "";
  var card = el("div", "card current-card w-100");
  var body = el("div", "card-body");

  var heading = el("h3", "card-title d-flex align-items-center flex-wrap");
  heading.appendChild(document.createTextNode(place.label + " "));
  heading.appendChild(el("small", "text-muted ml-2", formatDate(current.time, { weekday: "long", month: "short", day: "numeric" })));
  var icon = el("img", "weather-icon");
  icon.src = weather.icon;
  icon.alt = weather.text;
  heading.appendChild(icon);

  body.appendChild(heading);
  body.appendChild(el("p", "lead mb-3", weather.text));
  body.appendChild(el("p", null, "Temperature: " + Math.round(current.temperature_2m) + " °F"));
  body.appendChild(el("p", null, "Humidity: " + current.relative_humidity_2m + "%"));
  body.appendChild(el("p", null, "Wind Speed: " + Math.round(current.wind_speed_10m) + " MPH"));

  var uvLine = el("p", "mb-0", "UV Index: ");
  var badge = el("span", "uv-badge " + uv.className, uvIndex.toFixed(1) + " " + uv.label);
  uvLine.appendChild(badge);
  body.appendChild(uvLine);

  card.appendChild(body);
  currentEl.appendChild(card);
}

function renderForecast(data) {
  var daily = data.daily;
  forecastEl.innerHTML = "";
  forecastEl.appendChild(el("h4", "w-100 pt-4", "5-Day Forecast"));
  var deck = el("div", "forecast-deck w-100");

  // index 0 is today, so the forecast starts tomorrow
  for (var i = 1; i <= 5 && i < daily.time.length; i++) {
    var weather = describeWeather(daily.weather_code[i], 1);
    var card = el("div", "card forecast-card bg-primary text-light");
    var body = el("div", "card-body p-2");
    body.appendChild(el("h6", "card-title mb-1", formatDate(daily.time[i], { weekday: "short", month: "numeric", day: "numeric" })));
    var icon = el("img", "weather-icon");
    icon.src = weather.icon;
    icon.alt = weather.text;
    body.appendChild(icon);
    body.appendChild(el("p", "mb-1", "High: " + Math.round(daily.temperature_2m_max[i]) + " °F"));
    body.appendChild(el("p", "mb-1", "Low: " + Math.round(daily.temperature_2m_min[i]) + " °F"));
    body.appendChild(el("p", "mb-0", "Humidity: " + Math.round(daily.relative_humidity_2m_mean[i]) + "%"));
    card.appendChild(body);
    deck.appendChild(card);
  }
  forecastEl.appendChild(deck);
}

// ---------- data ----------

function getJSON(url) {
  return fetch(url).then(function (response) {
    if (!response.ok) throw new Error("Request failed (" + response.status + ")");
    return response.json();
  });
}

function findCity(cityName) {
  var url = GEOCODE_URL + "?count=1&language=en&format=json&name=" + encodeURIComponent(cityName);
  return getJSON(url).then(function (data) {
    if (!data.results || !data.results.length) {
      throw new Error('No city found matching "' + cityName + '".');
    }
    var place = data.results[0];
    var region = place.country_code === "US" ? place.admin1 : place.country;
    return {
      name: place.name,
      label: region ? place.name + ", " + region : place.name,
      latitude: place.latitude,
      longitude: place.longitude
    };
  });
}

function getWeather(place) {
  var params = [
    "latitude=" + place.latitude,
    "longitude=" + place.longitude,
    "current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index,is_day",
    "daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean",
    "temperature_unit=fahrenheit",
    "wind_speed_unit=mph",
    "forecast_days=6",
    "timezone=auto"
  ];
  return getJSON(FORECAST_URL + "?" + params.join("&"));
}

function searchCity(cityName) {
  cityName = cityName.trim();
  if (!cityName) return;

  showMessage("Loading weather for " + cityName + "…");
  findCity(cityName)
    .then(function (place) {
      return getWeather(place).then(function (data) {
        showMessage("");
        renderCurrent(place, data);
        renderForecast(data);
        saveToHistory(place.name);
      });
    })
    .catch(function (error) {
      showMessage(error.message || "Something went wrong. Please try again.");
    });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchCity(searchInput.value);
  searchInput.value = "";
});

renderHistory();
var lastSearched = loadHistory()[0];
if (lastSearched) searchCity(lastSearched);
