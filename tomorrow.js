const apiKey = "f4958b0a0541fd7b5811d5e56557bc6c";
const locationName = document.getElementById("location-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");
const weatherAdvice = document.getElementById("weather-advice");

// 天気アイコンとアドバイス関数
function getWeatherIcon(weather) {
    switch (weather) {
        case "Clear": return "img/clear.jpeg";
        case "Rain": return "img/rain.jpeg";
        case "Clouds": return "img/cloud.jpeg";
        case "Snow": return "img/snow.jpeg";
        default: return "img/clear.jpeg";
    }
}

function getWeatherAdvice(weather) {
    switch (weather) {
        case "Clear": return "明日は晴れです！帽子を忘れずに。";
        case "Rain": return "雨が降るので傘を忘れずに。";
        case "Clouds": return "曇り空です。肌寒いかもしれません。";
        case "Snow": return "雪が降るので防寒対策をしてください。";
        default: return "明日は快適に過ごせるでしょう！";
    }
}

// 明日の天気データ取得
function fetchTomorrowWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tomorrow = data.list[8]; // 明日12:00のデータ
            locationName.textContent = `現在地: ${data.city.name}`;
            temperature.textContent = Math.round(tomorrow.main.temp);
            humidity.textContent = tomorrow.main.humidity;
            windSpeed.textContent = tomorrow.wind.speed.toFixed(1);
            weatherIcon.src = getWeatherIcon(tomorrow.weather[0].main);
            weatherAdvice.textContent = getWeatherAdvice(tomorrow.weather[0].main);
        })
        .catch(error => console.error("明日の天気データ取得エラー:", error));
}

// 現在地取得
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchTomorrowWeather(latitude, longitude);
    });
}
