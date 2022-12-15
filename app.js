let input = document.querySelector("input");
let btn = document.querySelector("button");
let temperature = document.querySelector("#temp");
let city = document.querySelector("#searchInfo h1");
let country = document.querySelector("#searchInfo h2");
let desc = document.querySelector("#desc-title");
let cloud = document.querySelector("#cloud");
let windSpeed = document.querySelector("#wind-speed");
let humidity = document.querySelector("#humidity");
let Visibility = document.querySelector("#Visibility");
let weatherImg = document.querySelector("#desc img");
let time = document.querySelector("#time");
let date = document.querySelector("#date");

let key, months, days;
let url = "http://api.openweathermap.org/data/2.5/weather?q=";
fetch("./file.json").then(response => response.json())
.then(json => {
    key = json.key;
    months = json.months;
    days = json.days;
});

btn.addEventListener("click", searchCityWeather);

function searchCityWeather(){
    let cityName = input.value.trim();

    if(cityName == ""){
        alert("Please enter the city name!!");
        return;
    }

    callApi(cityName);
}

function showOutput(json){
    if(json.message != undefined){
        alert("Please enter a valid city name!");
        return;
    }

    let today = new Date();
    let hour = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
    let minute = today.getMinutes() > 9 ? today.getMinutes() : "0" + today.getMinutes();
    hour = (hour > 9) ? hour : ("0" + hour);
    hour = hour == "00" ? "12" : hour;
    let am_pm = today.getHours() >= 12 ? "pm" : "am";
    let setTime = hour + ":" + minute + am_pm; 
    time.innerHTML = setTime;

    let monthIndx = today.getMonth();
    let dayIndx = today.getDay();
    let day = days[dayIndx];
    let month = months[monthIndx];
    date.innerHTML = day + ", " + month + " " + today.getDate() + ", " + today.getFullYear();
    
    let visibilityValue = parseInt(json.visibility)/1000;
    Visibility.innerHTML = visibilityValue + " km"; 
    temperature.innerHTML = json.main.temp + "°c";
    windSpeed.innerHTML = json.wind.speed + " mph";
    humidity.innerHTML = json.main.humidity + " %";
    desc.innerHTML = json.weather[0].description;
    cloud.innerHTML = json.clouds.all + " %";
    country.innerHTML = json.sys.country;
    city.innerHTML = json.name;

    let condition = json.weather[0].id;
    if (condition < 300) {
        weatherImg.setAttribute("src", "/images/storm.svg");
    } else if (condition < 505) {
        weatherImg.setAttribute("src", "/images/rainy.svg");
    } else if (condition === 515) {
        weatherImg.setAttribute("src", "/images/snowflake.svg");
    } else if (condition < 600) {
        weatherImg.setAttribute("src", "/images/rain.svg");
    } else if (condition < 700) {
        weatherImg.setAttribute("src", "/images/snowflake.svg");
    } else if (condition <= 800) {
        weatherImg.setAttribute("src", "/images/haze.svg");
    } else if (condition === 800) {
        weatherImg.setAttribute("src", "/images/sun.svg");
    } else {
        weatherImg.setAttribute("src", "/images/clouds.svg");
    }
}

function showError(err){
    console.log("Error occured", err);
    alert("Something wrong with server! Try after some time");
}

function callApi(cityName){
    let toSearch = url + cityName + "&units=metric&appid=" + key;

    fetch(toSearch).then(response => response.json())
    .then(json => showOutput(json))
    .catch(showError);
}

