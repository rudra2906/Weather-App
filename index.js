const userTab = document.querySelector("[my-weather]");
const searchTab = document.querySelector("[search-weather]");
const userContainer = document.querySelector(".weather-container")

const locationAccess = document.querySelector(".grant-location");
const searchLocation = document.querySelector("[data-searchForm]");
const loadingGif = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")

const errorContainer = document.querySelector(".errorSection");

// initially variables need?
let currentTabs = userTab;
const API_KEY = "a7c4ee39b042543a2baff314c3912950" ;
currentTabs.classList.add("current");
getfromSessionStorage();

function changeTab(tabs)
{
    // mylogic
    // if(current!=tabs)
    // {
    //     current.classList.remove("current");
    //     searchTab.classList.add("current");
    // }
    // else{
    //     searchTab.classList.remove("current");
    //     current.classList.add("current");
    // }

    if(currentTabs!=tabs)
    {
        currentTabs.classList.remove("current");
        currentTabs = tabs;
        currentTabs.classList.add("current");

        if(!searchLocation.classList.contains("active"))
        {
            // search form wala container is invisible
            userInfoContainer.classList.remove("active");
            locationAccess.classList.remove("active");
            searchLocation.classList.add("active");
            errorContainer.classList.remove("active");
        }
        else
        {
            searchLocation.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            // now i am in your weather to coordinates check karenge may be we have save
            getfromSessionStorage();
            // locationAccess.classList.add("active")
        }
    }
    
}

userTab.addEventListener("click",()=>{
    // ek function call kar diya hai 
    changeTab(userTab);
})


searchTab.addEventListener("click",()=>{
    // ek function call kar diya hai 
    changeTab(searchTab);
})

// checks weather coordinates are present in session storage
function getfromSessionStorage()
{
    let coordinateslatlon = sessionStorage.getItem("user-coordinates");
    if(!coordinateslatlon)
    {
        locationAccess.classList.add("active");
    }
    else
    {
        const coordinates = JSON.parse(coordinateslatlon);
        // we have the coordinates now call weather API to fetch weather data
        fetchUserWeather(coordinates);
    }

}

async function fetchUserWeather(coordinateslatlon)
{
    const {lat,lon} = coordinateslatlon;

    locationAccess.classList.remove("active");
    loadingGif.classList.add("active");

    try{
        const resource = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        // convert it into json 
        const data = await resource.json();
        loadingGif.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        renderWeatherInfo(data)

    }
    catch(err)
    {
        loadingGif.classList.remove("active");
    }

}

function renderWeatherInfo(weatherInfo)
{
    // access the element to change in UI
    const cityName = document.querySelector("[data-cityname]");
    const countyflag = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temprature =  document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countyflag.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;
    temprature.innerText = weatherInfo?.main?.temp + ' °C';
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %` ;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;

}

const grantAccessbtn = document.querySelector("[grantAccessbtn]");
grantAccessbtn.addEventListener("click" , getLocation)

function getLocation()
{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("Location is not supported");
    }

}
function showPosition(position)
{
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeather(userCoordinates);
}

const searchBtn = document.querySelector("[grantAccessbtn]");
searchBtn.addEventListener("click",getLocation);




// search section 
const searchInput = document.querySelector("[data-searchInput]");

searchLocation.addEventListener("submit",(e)=>{
    e.preventDefault();
    let city = searchInput.value;
    if(city==="")
    {
        return;
    }
    else
    {
        SearchWeatherInfo(city);
    }
    
})
// api call for city 

async function SearchWeatherInfo(click)
{
    let cityName = click;
    loadingGif.classList.add("active");
    userInfoContainer.classList.remove("active");
    locationAccess.classList.remove("active");
    errorContainer.classList.remove("active");
    
    try {
        const resource = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
          )
        const data = await resource.json();
        if (!data.sys) {
            throw data;
          }
        loadingGif.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("not working",err);

        loadingGif.classList.remove("active");
        errorContainer.classList.add("active");

    }

}
