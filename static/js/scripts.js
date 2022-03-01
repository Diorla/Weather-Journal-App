const editButton = document.getElementById("edit-button");
const editIcon = document.querySelector("#edit-button >  .fa-solid");
const form = document.querySelector("form");
const generateButton = document.getElementById("generate");
const countrySelect = document.getElementById("country-select");
const languageSelect = document.getElementById("language-select");
const unitsSelect = document.getElementById("units");
const locationElem = document.getElementById("location");
const feelingContentElem = document.getElementById("content");
const weatherImage = document.getElementById("weather-image");
const weatherDesc = document.getElementById("weather-desc");
const mainTemp = document.getElementById("temp-main");
const minTemp = document.getElementById("temp-min");
const tempFeel = document.getElementById("temp-feel");
const maxTemp = document.getElementById("temp-max");
const sunRiseElem = document.getElementById("sunrise");
const sunsetElem = document.getElementById("sunset");
const windSpeedElem = document.getElementById("wind-speed");
const windDirElem = document.getElementById("wind-direction");
const humidityElem = document.getElementById("humidity");
const pressureElem = document.getElementById("pressure");
const feelingsInput = document.getElementById("feelings");
const zipInput = document.getElementById("zip");
const todayDateElem = document.getElementById("date");
const entryHolder = document.getElementById("entryHolder");
const errorWrapper = document.getElementById("error-wrapper");
const errorInfo = document.getElementById("error-info");
const errorClose = document.querySelector("#error-wrapper > .fa-solid");

/**
 * This will update UI for the error
 * @param {string} name the name of the error
 * @param {string} message the message of the error
 */
function notifyUserError(name, message) {
  errorInfo.innerHTML = `<b>${name}</b>: ${message}`;
  errorWrapper.classList.remove("hidden");
}

/**
 * hides the form and display weather information
 */
function hideForm() {
  form.classList.add("hidden");
  entryHolder.classList.remove("hidden");
  editIcon.classList.remove("fa-xmark");
  editIcon.classList.add("fa-pen");
}

/**
 * shows the form and hides weather information
 */
function showForm() {
  form.classList.remove("hidden");
  entryHolder.classList.add("hidden");
  editIcon.classList.add("fa-xmark");
  editIcon.classList.remove("fa-pen");
}

/**
 * It will send data using post method
 * @param {string} url api endpoint
 * @param {any} data the data that will be sent to the API endpoint
 * @returns Promise<any>
 */
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    return response;
  } catch (err) {
    notifyUserError(err.name, err.message);
  }
}

/**
 * Used to load the list of languages
 * It is based on supported language on openweather api
 */
const loadLanguageList = new Promise((resolve, reject) => {
  fetch("../data/languages.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * list of countries and the 2 letter ISO codes
 */
const loadCountryList = new Promise((resolve, reject) => {
  fetch("../data/countries.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

/**
 * It will update the <option/> list of language <select/>
 * @param {string} language the language code e.g. en
 */
function renderLanguageSelect(language) {
  const docFrag = new DocumentFragment();
  loadLanguageList
    .then((dt) => {
      for (let item in dt) {
        const option = document.createElement("Option");
        option.value = item;
        option.textContent = dt[item];
        docFrag.appendChild(option);
      }
    })
    .then(() => {
      languageSelect.appendChild(docFrag);
    })
    .then(() => {
      languageSelect.value = language;
    })
    .catch((err) => notifyUserError(err.name, err.message));
}

/**
 * It will update the value of ISO code of the country <select/>
 * @param {string} countryCode the 2 letter ISO code e.g. GB
 */
function renderCountrySelect(countryCode) {
  const docFrag = new DocumentFragment();
  loadCountryList
    .then((dt) => {
      for (let item of dt) {
        const option = document.createElement("Option");
        option.value = item.code;
        option.textContent = item.name;
        docFrag.appendChild(option);
      }
    })
    .then(() => {
      countrySelect.appendChild(docFrag);
    })
    .then(() => {
      countrySelect.value = countryCode;
    })
    .catch((err) => notifyUserError(err.name, err.message));
}

/**
 * Used to fetch data
 * @param {string} url the API endpoint
 * @returns Promise<any>
 */
async function fetchData(url = "") {
  try {
    const response = await fetch(url);
    const newData = await response.json();
    return newData;
  } catch (err) {
    notifyUserError(err.name, err.message);
    return null;
  }
}

/**
 * For deriving sunrise and sunset time
 * @param {number} unixTime the unix time supplied by openweather api
 * @param {number} timezone the difference in timezone from GMT.
 * @returns
 */
function convertTime(unixTime, timezone) {
  let dt = new Date((unixTime + timezone) * 1000);
  let h = dt.getHours();
  let m = "00" + dt.getMinutes();
  let t = h + ":" + m.slice(-2);
  return t;
}

/**
 * Formats the value based on the measuring system chosen
 * @param {number} value the current temperature
 * @param {string} unit the type, e.g. the metric system which is celsius
 * @returns string
 */
function formatTemp(value, unit) {
  if (unit === "standard") return `${value}K`;
  if (unit === "imperial") return `${value}℉`;
  return `${value}℃`;
}

/**
 * It will take parameters and write it to the html
 * @param {object} obj list of weather parameters that will rendered to html
 */
function updateBody(obj) {
  const {
    description,
    icon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    pressure,
    humidity,
    speed,
    deg,
    sunrise,
    sunset,
    timezone,
    name,
    country,
    feeling,
    unit,
  } = obj;

  locationElem.textContent = `${name}, ${country}`;
  feelingContentElem.textContent = feeling;

  weatherImage.src = `assets/${icon}.png`;
  weatherDesc.textContent = description;
  mainTemp.textContent = temp;
  minTemp.textContent = `Lo: ${formatTemp(temp_min, unit)}`;
  tempFeel.textContent = `Feels like ${formatTemp(feels_like, unit)}`;
  maxTemp.textContent = `Hi: ${formatTemp(temp_max, unit)}`;
  sunRiseElem.textContent = convertTime(sunrise, timezone);
  sunsetElem.textContent = convertTime(sunset, timezone);
  windSpeedElem.textContent = `${speed}metre/s`;
  windDirElem.title = `${deg}deg`;

  windDirElem.animate(
    [
      { transform: `rotate(${deg - 10}deg)` },
      { transform: `rotate(${deg + 10}deg)` },
    ],
    {
      duration: 2000,
      iterations: Infinity,
      direction: "alternate",
    }
  );

  humidityElem.textContent = `${humidity}%`;
  pressureElem.textContent = `${pressure}hPA`;
  hideForm();
}

/**
 * Used to fetch data from openweather API
 * @param {object} param the list of params to be submitted
 * @param {string} param.countryCode - The 2 letter ISO code.
 * @param {string} param.language - language code e.g fr
 * @param {string} param.postCode - zip code or post code, whatever they call it in your country
 * @param {string} param.unit - of the the measuring system
 */
async function fetchOpenWeather({
  countryCode = "GB",
  language = "en",
  postCode = "SW1A 0AA",
  unit = "metric",
}) {
  const apiKey = "447134f8c845f5c129bd32bdbf98748f";

  const weatherURL = "https://api.openweathermap.org/data/2.5/weather";

  fetchData(
    `${weatherURL}?zip=${
      postCode.split(" ")[0]
    },${countryCode}&appid=${apiKey}&units=${unit}&lang=${language}`
  )
    .then((data) => {
      const {
        weather,
        main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
        wind: { speed, deg },
        sys: { sunrise, sunset, country },
        timezone,
        name,
      } = data;
      const { description, icon } = weather[0];
      postData("/weather-update", {
        description,
        icon,
        temp,
        feels_like,
        temp_min,
        temp_max,
        pressure,
        humidity,
        speed,
        deg,
        sunrise,
        sunset,
        timezone,
        name,
        country,
      })
        .then((res) => {
          if (res.status === 200)
            fetchData("/weather").then((data) => {
              updateBody(data);
            });
        })
        .catch((err) => notifyUserError(err.name, err.message));
    })
    .catch(() => notifyUserError("404", "Location not found"));
}

generateButton.addEventListener("click", (e) => {
  e.preventDefault();
  const countryCode = countrySelect.value;
  const language = languageSelect.value;
  const postCode = zipInput.value;
  const unit = unitsSelect.value;

  fetchOpenWeather({
    countryCode,
    language,
    postCode,
    unit,
  });
});

editButton.addEventListener("click", () => {
  return form.classList.contains("hidden") ? showForm() : hideForm();
});

errorClose.addEventListener("click", () => {
  return errorWrapper.classList.contains("hidden")
    ? errorWrapper.classList.remove("hidden")
    : errorWrapper.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  todayDateElem.textContent = new Date().toDateString();
  fetchData("./weather")
    .then((data) => {
      const { countryCode, feeling, language, postCode, unit } = data;
      renderCountrySelect(countryCode);
      renderLanguageSelect(language);
      unitsSelect.value = unit;
      feelingsInput.value = feeling;
      zipInput.value = postCode;
    })
    .catch((err) => notifyUserError(err.name, err.message));
});
