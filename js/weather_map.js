import keys from "/keys.js";
const SALong = -98.48527;
const SALat = 29.423017;

// Initialize the map
mapboxgl.accessToken = keys.MAPBOX_API_TOKEN;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/outdoors-v12", // style URL
    center: [-98.48962, 29.42692], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

// Creates Marker
const marker = new mapboxgl.Marker({
    draggable: true,
}).setLngLat([-98.4951, 29.4246]).addTo(map);

// Method to set weather data after marked has been dragged and released
marker.on("dragend", setWeatherData);

// Function to set weather data at marker location
const highLow = document.querySelector('.high-low');
const high = document.querySelector('.high');
const low = document.querySelector('.low');
const wIcon = document.querySelector('.w-icon');




function setWeatherData() {
    const lngLat = marker.getLngLat();
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${SALat}&lon=${SALong}&appid=${keys.OPEN_WEATHER_APPID}&units=imperial`
    )
        .then((response) => response.json())
        .then((data) => {
            const dates = document.querySelectorAll(".date");

            dates.forEach((date, index) => {
                const dateMilliseconds = data.list[index * 8].dt * 1000;
                const formattedDate = new Date(dateMilliseconds).toISOString().slice(0,10).replace(/-/g, "/");
                date.textContent = formattedDate;
            });

            const icons = document.querySelectorAll(".w-icon");
            icons.forEach((icon, index) =>{
                icons.innerHTML = `${data.list[index * 8].weather.icon}`
            })

            const temperatures = document.querySelectorAll(".data-current-temp");
            temperatures.forEach((temperature, index) => {
                temperature.textContent =  `${data.list[index * 8].main.temp.toFixed(0)}°F`;
            });

            const windSpeeds = document.querySelectorAll(".wind");
            windSpeeds.forEach((windSpeed, index)=> {
                windSpeed.textContent = `Wind speed is: ${data.list[index * 8].wind.speed}`;
            });

            const humidities = document.querySelectorAll(".humidity");
            humidities.forEach((humidity, index) => {
                humidity.textContent = `Humidity: ${data.list[index * 8].main.humidity}%`;
            });

            const pressures = document.querySelectorAll(".pressure");
            pressures.forEach((pressure, index) => {
                pressure.textContent = ` Pressure is: ${data.list[index * 8].main.pressure}`;
            });


            const descriptions = document.querySelectorAll(".description");
            descriptions.forEach((description, index) => {
                description.textContent = data.list[index * 8].weather[0].description;
            });

            const highs =document.querySelectorAll(".high");
            highs.forEach((high,index)=> {
                high.textContent = `${data.list[0].main.temp_max.toFixed(0)}°F`;
            });

            const lows =document.querySelectorAll(".low");
            lows.forEach((low,index)=> {
                low.textContent = `${data.list[0].main.temp_min.toFixed(0)}°F`;
            });

        })

        .catch((error) => console.error(error));
}

// Event listener to set weather data based on searched named area
const submitButton = document.querySelector("#search-button");
const searchedCity = document.querySelector("#search-bar");
submitButton.addEventListener("click", () => {
    geocode(searchedCity.value, keys.MAPBOX_API_TOKEN)
        .then((data) => {
            map.setCenter(data);
            setWeatherData();
            marker.setLngLat(data);
        })
        .catch((error) => console.error(error));
});

reverseGeocode({}, keys.MAPBOX_API_TOKEN).then((data) => console.log(data));
