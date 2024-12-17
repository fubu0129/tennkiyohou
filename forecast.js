const apiKey = "f4958b0a0541fd7b5811d5e56557bc6c";
const forecastList = document.getElementById("forecast-list");

function fetchForecastWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecasts = data.list.filter((_, index) => index % 8 === 0); // 1日ごと
            forecastList.innerHTML = forecasts.map(day => `
                <li class="forecast-item">
                    <p>日付: ${day.dt_txt.split(" ")[0]}</p>
                    <p>気温: ${Math.round(day.main.temp)}°C</p>
                    <p>天気: ${day.weather[0].description}</p>
                    <div class="details">
                        <p>風速: ${day.wind.speed.toFixed(1)} m/s</p>
                        <p>湿度: ${day.main.humidity}%</p>
                    </div>
                </li>
            `).join("");
        });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchForecastWeather(latitude, longitude);
    });
}

