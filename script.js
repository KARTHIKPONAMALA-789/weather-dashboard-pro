const apiKey = "f32b7bcd73fa6675006c6d297c9da315";

async function getWeather() {
const city = document.getElementById("cityInput").value;


if (city === "") {
    alert("Enter city name");
    return;
}

document.getElementById("loader").style.display = "block";

try {
    // CURRENT WEATHER
    const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await currentRes.json();

    if (data.cod != 200) {
        alert("City not found");
        return;
    }

    // DISPLAY CURRENT
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText = `Temp: ${data.main.temp}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} m/s`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // BACKGROUND
    const weatherMain = data.weather[0].main.toLowerCase();
    document.body.className = "";

    if (weatherMain.includes("clear")) {
        document.body.classList.add("sunny");
    } else if (weatherMain.includes("rain")) {
        document.body.classList.add("rainy");
    } else if (weatherMain.includes("cloud")) {
        document.body.classList.add("cloudy");
    } else {
        document.body.classList.add("night");
    }

    // FORECAST (SAFE)
    try {
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const forecast = await forecastRes.json();

        const container = document.getElementById("forecast");
        container.innerHTML = "";

        if (forecast.list) {
            for (let i = 0; i < forecast.list.length; i += 8) {
                const item = forecast.list[i];

                container.innerHTML += `
                    <div class="forecast-card">
                        <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                        <p>${item.main.temp}°C</p>
                    </div>
                `;
            }
        }
    } catch (e) {
        console.log("Forecast failed but current works");
    }

} catch (error) {
    console.log(error);
    alert("Error fetching weather");
}

document.getElementById("loader").style.display = "none";


}
document.getElementById("cityInput")
.addEventListener("keypress", function(e) {
if (e.key === "Enter") {
getWeather();
}
});

