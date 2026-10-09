<h1 align="center">🌤️ Weather Dashboard</h1>

<p align="center">Search any city for current conditions and a 5-day forecast. Your recent searches stay one click away.</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&amp;logo=html5&amp;logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&amp;logo=css&amp;logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&amp;logo=jquery&amp;logoColor=white" alt="jQuery">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&amp;logo=bootstrap&amp;logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Moment.js-222222?style=for-the-badge" alt="Moment.js">
  <img src="https://img.shields.io/badge/OpenWeather_API-EB6E4B?style=for-the-badge" alt="OpenWeather API">
</p>

<p align="center"><a href="https://christiankrantz11.github.io/weather-dashboard/"><strong>🚀 Live Demo</strong></a></p>

<p align="center"><img src="docs/screenshot.png" alt="Weather Dashboard showing current conditions and a 5-day forecast for Austin" width="850"></p>

<p align="center"><sub>Screenshot rendered with sample weather data.</sub></p>

## Features

- Search for weather by city name
- Current conditions:
  - City name and date
  - Weather icon
  - Temperature (°F)
  - Humidity
  - Wind speed
  - UV index
- UV index is color-coded by severity:

  | UV index | Color |
  | --- | --- |
  | 0–2 | Green (low) |
  | 3–5 | Yellow (moderate) |
  | 6–7 | Orange (high) |
  | 8–10 | Red (very high) |
  | 11+ | Violet (extreme) |

- 5-day forecast cards with:
  - Date
  - Weather icon
  - Min and max temperature
  - Humidity
- Search history of your 5 most recent cities, saved in `localStorage`. Click a city to reload its weather.
- Automatically loads your last searched city when you return

## Built With

- HTML, CSS, JavaScript
- [jQuery](https://jquery.com/)
- [Bootstrap 4](https://getbootstrap.com/docs/4.3/)
- [Moment.js](https://momentjs.com/)
- [Font Awesome](https://fontawesome.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## Running Locally

No build step is needed.

1. Clone the repo:
   ```bash
   git clone https://github.com/ChristianKrantz11/weather-dashboard.git
   ```
2. Open `index.html` in your browser.

## Known Issues

- OpenWeatherMap has retired the standalone UV index endpoint (`/data/2.5/uvi`).
- The daily forecast endpoint (`/data/2.5/forecast/daily`) now requires a paid plan.
- Because of this, the UV index and 5-day forecast may no longer load. Moving to OpenWeatherMap's One Call API would restore them.
- The API key is stored in `script.js`. Consider regenerating it and keeping keys out of public code.

## User Story

<details>
<summary>Original assignment user story</summary>

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

</details>

## Author

[ChristianKrantz11](https://github.com/ChristianKrantz11)
