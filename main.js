const apiKey = "f4958b0a0541fd7b5811d5e56557bc6c"; // OpenWeatherMap APIキー

// HTML要素の取得
const locationName = document.getElementById("location-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const uvIndex = document.getElementById("uv-index");
const weatherIcon = document.getElementById("weather-icon");
const weatherAdvice = document.getElementById("weather-advice");
const backToCurrent = document.getElementById("back-to-current");

// 天気アイコンを設定する関数
function getWeatherIcon(weather) {
    switch (weather) {
        case "Clear": return "img/clear.jpeg";
        case "Rain": return "img/rain.jpeg";
        case "Clouds": return "img/cloud.jpeg";
        case "Snow": return "img/snow.jpeg";
        default: return "img/clear.jpeg";
    }
}

// 天気アドバイスを設定する関数
function getWeatherAdvice(weather) {
    switch (weather) {
        case "Clear": return "晴れた日です！帽子を着用して外出しましょう。";
        case "Rain": return "雨が降るので傘を忘れずに。";
        case "Clouds": return "曇りの日です。肌寒いかもしれません。";
        case "Snow": return "雪が降ります。暖かい服装で過ごしましょう。";
        default: return "快適に過ごせる天気です。";
    }
}

// 現在地の天気データを取得して表示
function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationName.textContent = `現在地: ${data.name}`;
            temperature.textContent = Math.round(data.main.temp);
            humidity.textContent = data.main.humidity;
            windSpeed.textContent = data.wind.speed.toFixed(1);
            uvIndex.textContent = "未対応";
            weatherIcon.src = getWeatherIcon(data.weather[0].main);
            weatherAdvice.textContent = getWeatherAdvice(data.weather[0].main);
        });
}

// 現在地取得と天気表示
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);

        // 雨雲レーダーの表示
        const map = L.map('map').setView([latitude, longitude], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '© OpenWeatherMap',
            opacity: 0.6
        }).addTo(map);
    });
} else {
    locationName.textContent = "現在地を取得できませんでした。";
}

// 検索機能（郵便番号・地名）
document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const location = document.getElementById("search-input").value;
    if (!location) {
        alert("郵便番号または地名を入力してください。");
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=ja&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationName.textContent = `検索結果: ${data.name}`;
            temperature.textContent = Math.round(data.main.temp);
            humidity.textContent = data.main.humidity;
            windSpeed.textContent = data.wind.speed.toFixed(1);
            weatherIcon.src = getWeatherIcon(data.weather[0].main);
            weatherAdvice.textContent = getWeatherAdvice(data.weather[0].main);
            backToCurrent.style.display = "inline-block";
        });
});

// 「現在地の天気予報に戻る」ボタン
backToCurrent.addEventListener("click", () => {
    window.location.reload();
});
