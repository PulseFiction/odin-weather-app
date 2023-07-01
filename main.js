import "./style.css";

async function displayData(query){
  const data = await getAPIData(query);
  console.log(data)
  await getBackgroundImage(data.current.condition.text)
  const dashboard = document.querySelector('.dashboard__container');

  dashboard.style.visibility = 'visible'

  // Location and region
  const location = document.querySelector('.location');
  const country = document.querySelector('.country');
  location.textContent = data.location.name;
  country.textContent = data.location.country;

  // Date and time
  const values = await formatTime(data);
  const date = document.querySelector('.date');
  const time = document.querySelector('.time');
  date.textContent = values[0];
  time.textContent = values[1];




  // Weather
  const weather = document.querySelector('.weather');
  const icon = document.querySelector('.weather-icon');
  weather.textContent = data.current.condition.text;
  icon.style.visibility = 'visible';
  icon.src = data.current.condition.icon;

  // Temperature
  const temperature = document.querySelector('.temperature');
  const feelsLike = document.querySelector('.feelslike');
 ; // Function to add C or F to end needed
  temperature.textContent = `${data.current.temp_c}°C`
  feelsLike.textContent = `Feels like: ${data.current.feelslike_c}°C`;


  // Utilities
  const convertButton = document.querySelector('.c-to-f__button');

  convertButton.addEventListener('click', () => {
    if (temperature.textContent.includes('C')) {
      temperature.textContent = `${data.current.temp_f}°F` 
      feelsLike.textContent = `Feels like: ${data.current.feelslike_f}°F`;
    } else {
      temperature.textContent = `${data.current.temp_c}°C`
      feelsLike.textContent = `Feels like: ${data.current.feelslike_c}°C`;
    }
    
  });

  
}


function getBackgroundImage(weather){
  if (weather.includes('cloudy')) {
    document.body.style.backgroundImage = 'url(./assets/clouds.jpg)';
  } else if (weather.includes('rain')) {
    document.body.style.backgroundImage = 'url(./assets/rain.jpg)';
  } else if (weather.includes('sun')) {
    document.body.style.backgroundImage = 'url(./assets/sun.jpg)';
  } else {
    document.body.style.backgroundImage = 'url(./assets/trees.jpg)';
  }

}

function validateInput() {
  const input = document.querySelector(".search");
  const submit = document.querySelector(".submit");
  const error = document.querySelector(".error-message");
  const regex = /[^A-Za-z ]/;
  let userQuery;

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    if (input.value.length <= 0) {
      error.style.display = "block";
      error.textContent =
        "Nothing has been entered, please enter a valid location.";
        return;
    } else if (regex.test(input.value)) {
      error.style.display = "block";
      error.textContent =
        "Please enter a valid location without any numbers or special characters.";
        return;
    } else {
      error.style.display = "none";
      userQuery = input.value;
    }
    displayData(userQuery);
    
  });
}

validateInput();

async function getAPIData(query) {
  const API_URL = "http://api.weatherapi.com/v1";
  const API_KEY = "504b1f38840e4a0680d172142232906";
  // default location is london
  let location = "London";
  if (query) {
    location = query;
  }
  try {
    const response = await fetch(
      `${API_URL}/current.json?key=${API_KEY}&q=${location}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }

}

async function formatTime(data) {
  const dataTime = data.location.localtime;

  const values = dataTime.split(" ");

  // Format the date
  const date = values[0].split("-");
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(
    Date.UTC(date[0], date[1], date[2])
  ).toLocaleDateString("en-GB", options);
  const splitDate = formattedDate.split(" ");
  // Funky hard to read code adds ending to date array, could do with refactoring
  splitDate.splice(1, 1, `${splitDate[1]}${addDayEnding(splitDate[1])}`);
  const fixedDate = splitDate.join(" ");

  // Format the time
  const time = values[1];
  const hour = time.split(":")[0];
  const fixedTime = `${time}${addTimeEnding(hour)}`;

  return [fixedDate, fixedTime];
}

function addTimeEnding(hour) {
  let ending = "";
  if (hour >= 12) {
    ending = "PM";
  } else {
    ending = "AM";
  }

  return ending;
}

function addDayEnding(day) {
  let ending = "";
  if (day === "1") {
    ending = "st";
  } else if (day === "2") {
    ending = "nd";
  } else if (day === "3") {
    ending === "rd";
  } else {
    ending === "th";
  }

  return ending;
}

// async function processData(){
//   if (currentData) {
//     const usefulData = {
//       "location": {
//         "name": currentData.location.name,
//         "region": currentData.location.region,
//         "country": currentData.location.country,
//         "date": formatTime()[0],
//         "time": formatTime()[1],
//       },
//       "current": {
//         "weather": currentData.current.condition.text,
//         "icon": currentData.current.condition.icon,
//         "temp_c": currentData.current.temp_c,
//         "feelslike_c": currentData.current.feelslike_c,
//         "temp_f": currentData.current.temp_f,
//         "feelslike_f": currentData.current.feelslike_f,
//       }

//     }
//   }
//   return usefulData;

// }

/* 
{
    "location": {
        "name": "London",
        "region": "City of London, Greater London",
        "country": "United Kingdom",
        "lat": 51.52,
        "lon": -0.11,
        "tz_id": "Europe/London",
        "localtime_epoch": 1688209875,
        "localtime": "2023-07-01 12:11"
    },
    "current": {
        "last_updated_epoch": 1688209200,
        "last_updated": "2023-07-01 12:00",
        "temp_c": 20,
        "temp_f": 68,
        "is_day": 1,
        "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
        },
        "wind_mph": 16.1,
        "wind_kph": 25.9,
        "wind_degree": 290,
        "wind_dir": "WNW",
        "pressure_mb": 1005,
        "pressure_in": 29.68,
        "precip_mm": 0,
        "precip_in": 0,
        "humidity": 56,
        "cloud": 50,
        "feelslike_c": 20,
        "feelslike_f": 68,
        "vis_km": 10,
        "vis_miles": 6,
        "uv": 5,
        "gust_mph": 14.8,
        "gust_kph": 23.8
    }
}
*/
