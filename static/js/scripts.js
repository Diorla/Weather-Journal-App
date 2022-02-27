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
const postCodeInput = document.getElementById("post-code");
const todayDateElem = document.getElementById("today-date");

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

  fetchOpenWeather(
    {
      postCode: postCodeInput.value,
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
      // update address and other info only if it is a valid address
      postData("/weather-update", {
        feeling: feelingInput.value,
        postCode: postCodeInput.value,
        countryCode: countrySelect.value,
        unit: unitsSelect.value,
        language: languageSelect.value,
      }).catch((err) => {
        console.log("postData", err);
        submitButton.removeAttribute("disabled");
      });
    },
    (err) => {
      console.log("fetchWeather", err);
      submitButton.removeAttribute("disabled");
    }
  );
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
const loadLanguageList = new Promise((resolve, reject) => {
  fetch("../data/languages.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

const loadCountryList = new Promise((resolve, reject) => {
  fetch("../data/countries.json")
    .then((respond) => {
      resolve(respond.json());
    })
    .catch((err) => {
      reject(err);
    });
});

const renderLanguageSelect = (language) => {
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
    .catch((err) => console.log(err));
};

const renderCountrySelect = (countryCode) => {
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
    return null;
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

async function fetchOpenWeather(
  {
    countryCode = "GB",
    language = "en",
    postCode = "SW1A 0AA",
    unit = "standard",
  },
  updateBody,
  handleError
) {
  const apiKey = "447134f8c845f5c129bd32bdbf98748f";

  const weatherURL = "https://api.openweathermap.org/data/2.5/weather";

  const weatherData = await fetchData(
    `${weatherURL}?zip=${
      postCode.split(" ")[0]
    },${countryCode}&appid=${apiKey}&units=${unit}&lang=${language}`,
    handleError
  );

  try {
    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed, deg },
      sys: { sunrise, sunset, country },
      timezone,
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
  } catch (error) {
    submitButton.removeAttribute("disabled");
  }
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
};

document.addEventListener("DOMContentLoaded", () => {
  todayDateElem.textContent = new Date().toDateString();
  fetch("./weather")
    .then((respond) => {
      respond.json().then((data) => {
        const { countryCode, feeling, language, postCode, unit } = {
          ...defaultValue,
          ...data,
        };
        renderCountrySelect(countryCode);
        renderLanguageSelect(language);
        unitsSelect.value = unit;
        feelingInput.value = feeling;
        postCodeInput.value = postCode;
        fetchOpenWeather(
          {
            countryCode,
            language,
            postCode,
            unit,
          },
          (data) => updateBody({ ...data, feeling, unit }),
          (err) => {
            console.log("DOM content loaded", err);
          }
        );
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
