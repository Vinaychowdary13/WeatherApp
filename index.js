let apiKey = "28933cea050d87745f7a78373b5af88a";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_btn");

// Dark mode
let darkMode = document.getElementById("darkMode_btn");
darkMode.addEventListener("click", () => {
    document.body.style.backgroundColor = "black";
    document.querySelector(".forecast-section h3").style.color = "white"; // <-- this line added
  });

// Light mode
let lightMode = document.getElementById("lightMode_btn");
lightMode.addEventListener("click", () => {
    document.body.style.backgroundColor = "#dfebec";
    document.querySelector(".forecast-section h3").style.color = "#3498db"; // <-- reset to default
  });

// Get 5-day forecast
let weatherData = async (lat, lon) => {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  let response = await fetch(forecastApiUrl);
  let data = await response.json();

  let forecastContainer = document.getElementById("Future_data").querySelector(".row");
  forecastContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let dayData = data.list[i * 8];
    let temp = Math.round(dayData.main.temp);
    let description = dayData.weather[0].description;
    let iconCode = dayData.weather[0].icon;
    let dayName = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });

    forecastContainer.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
        <div class="card future-weather-card mx-auto">
          <div class="card-body text-center">
            <h5 class="card-title">${dayName}</h5>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon" class="weather-icon mb-2">
            <p class="card-text">${temp}°C</p>
            <p class="card-text">${description}</p>
          </div>
        </div>
      </div>`;
  }
};

// Main weather fetch and UI update
async function check(city) {
  try {
    let response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    let data = await response.json();

    // Handle invalid city
    if (data.cod !== 200) {
      alert("Enter the city name correctly.");
      setTimeout(() => location.reload(), 100); // Smooth page refresh
      return;
    }

    document.querySelector('.card-title').innerHTML = data.name;
    let temperature_value = Math.round(data.main.temp);
    document.querySelector('.temp_display').innerHTML = `${temperature_value}°C`;
    document.querySelector('.card-text').innerHTML = data.weather[0].description;

    let weatherImg = document.getElementById("weatherImg");
    if (temperature_value < 0) {
      weatherImg.src = 'assets/freeze.jpeg';
    } else if (temperature_value < 10) {
      weatherImg.src = 'assets/cold.jpeg';
    } else if (temperature_value < 20) {
      weatherImg.src = 'assets/cool.png';
    } else if (temperature_value < 30) {
      weatherImg.src = 'assets/warm.png';
    } else {
      weatherImg.src = 'assets/hot.jpeg';
    }

    let degree_celsius = document.getElementById("degree_celsius");
    degree_celsius.addEventListener("click", () => {
      document.querySelector('.temp_display').innerHTML = `${temperature_value}°C`;
    });

    let fahrenheit = document.getElementById("fahreinheit");
    fahrenheit.addEventListener("click", () => {
      let fah = Math.round((temperature_value * 9) / 5 + 32);
      document.querySelector('.temp_display').innerHTML = `${fah}°F`;
    });

    weatherData(data.coord.lat, data.coord.lon);

  } catch (error) {
    alert("Something went wrong. Please try again later.");
    setTimeout(() => location.reload(), 100);
  }
}

// Trigger on search button click
searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") {
    check(city);
  } else {
    alert("Please enter a city name.");
  }
});