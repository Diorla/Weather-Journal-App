const editButton = document.getElementById("edit-button");
const editIcon = document.querySelector("#edit-button >  .fa-solid");
const form = document.querySelector("form");
const submitButton = document.getElementById("submit-button");
const countrySelect = document.getElementById("country-select");
const languageSelect = document.getElementById("language-select");
const unitsSelect = document.getElementById("units");
const locationElem = document.getElementById("location");
const feelingElem = document.getElementById("feeling");
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
const feelingInput = document.getElementById("feeling-input");
const postCodeElem = document.getElementById("post-code");

document.getElementById("today-date").textContent = new Date().toDateString();
const defaultValue = {
  countryCode: "GB",
  feeling: "No feelings added",
  language: "en",
  postCode: "SW1A 0AA",
  unit: "metric",
};

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  submitButton.setAttribute("disabled", "true");
  postData("/weather-update", {
    feeling: feelingInput.value,
    postCode: postCodeElem.value,
    countryCode: countrySelect.value,
    unit: unitsSelect.value,
    language: languageSelect.value,
  })
    .then(() => {
      fetchWeather(
        {
          postCode: postCodeElem.value,
          countryCode: countrySelect.value,
          unit: unitsSelect.value,
          language: languageSelect.value,
        },
        (data) => {
          updateBody({
            ...data,
            feeling: feelingInput.value,
            unit: unitsSelect.value,
          });

          hideForm();

          submitButton.removeAttribute("disabled");
        },
        (err) => {
          // alert(err.name);
          console.log(err);

          submitButton.removeAttribute("disabled");
        }
      );
    })
    .catch((err) => {
      // alert(err.name);
      console.log(err);

      submitButton.removeAttribute("disabled");
    });
});

const hideForm = () => {
  form.classList.add("hidden");
  editIcon.classList.remove("fa-xmark");
};

const showForm = () => {
  form.classList.remove("hidden");
  editIcon.classList.add("fa-xmark");
};

editButton.addEventListener("click", () => {
  return form.classList.contains("hidden") ? showForm() : hideForm();
});

// supported language on open weather api
const languageData = new Promise((resolve, reject) => {
  fetch("../data/languages.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

// https://gist.github.com/almost/7748738
const countryData = new Promise((resolve, reject) => {
  fetch("../data/countries.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

const loadLanguage = (language) => {
  const docFrag = new DocumentFragment();
  languageData
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
    .catch((err) => console.log(err));
};

const loadCountries = (countryCode) => {
  const docFrag = new DocumentFragment();
  countryData
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
    .catch((err) => console.log(err));
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};

/**
 * Used to fetch data
 * @param {string} url the API endpoint
 * @returns Promise<any>
 */
const fetchData = async (url = "", handleError) => {
  const response = await fetch(url);

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    handleError ? handleError(error) : console.log("error", error);
  }
};

/**
 * For deriving sunrise and sunset time
 * @param {*} unixTime
 * @param {*} timezone
 * @returns
 */
function convertTime(unixTime, timezone) {
  let dt = new Date((unixTime + timezone) * 1000);
  let h = dt.getHours();
  let m = "00" + dt.getMinutes();
  let t = h + ":" + m.slice(-2);
  return t;
}

async function fetchWeather(
  {
    countryCode = "GB",
    language = "en",
    postCode = "SW1A 0AA",
    unit = "standard",
  },
  updateBody,
  handleError
) {
  const API = "447134f8c845f5c129bd32bdbf98748f";

  const weatherURL = "https://api.openweathermap.org/data/2.5/weather";

  /**
   * standard: Kelvin
   * metric: Celsius
   * imperial: Fahrenheit
   */
  const weatherData = await fetchData(
    `${weatherURL}?zip=${
      postCode.split(" ")[0]
    },${countryCode}&appid=${API}&units=${unit}&lang=${language}`,
    handleError
  );

  const {
    weather,
    // pressure: hPa, humidity: %
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    // imperial: miles/sec, others: metres/sec
    wind: { speed, deg },
    // time of sunrise and sunset in unix or UTC
    sys: { sunrise, sunset, country },
    timezone,
    // Name of the city
    name,
  } = weatherData;

  const { description, icon } = weather[0];
  updateBody({
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
  });
}

const formatTemp = (value, unit) => {
  if (unit === "standard") return `${value}K`;
  if (unit === "imperial") return `${value}℉`;
  return `${value}℃`;
};

const updateBody = (obj) => {
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
  feelingElem.textContent = feeling;
  // weatherImage.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherImage.src = `assets/${icon}.png`;
  weatherDesc.textContent = description;
  mainTemp.textContent = temp;
  minTemp.textContent = `Lo: ${formatTemp(temp_min, unit)}`;
  tempFeel.textContent = `Feels like ${formatTemp(feels_like, unit)}`;
  maxTemp.textContent = `Hi: ${formatTemp(temp_max, unit)}`;
  sunRiseElem.textContent = convertTime(sunrise, timezone);
  sunsetElem.textContent = convertTime(sunset, timezone);
  windSpeedElem.textContent = `${speed}metre/s`;
  windDirElem.style.transform = `rotate(${deg}deg)`;
  humidityElem.textContent = `${humidity}%`;
  pressureElem.textContent = `${pressure}hPA`;
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("./weather")
    .then((respond) => {
      respond.json().then((data) => {
        const { countryCode, feeling, language, postCode, unit } = {
          ...defaultValue,
          ...data,
        };
        loadCountries(countryCode);
        loadLanguage(language);
        unitsSelect.value = unit;
        feelingInput.value = feeling;
        postCodeElem.value = postCode;
        fetchWeather(
          {
            countryCode,
            language,
            postCode,
            unit,
          },
          (data) => updateBody({ ...data, feeling, unit })
        );
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
