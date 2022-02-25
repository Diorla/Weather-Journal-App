const fetchData = async (url = "", lat = 30, long = 56) => {
  const response = await fetch(url);

  try {
    const newData = await response.json();
    // console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }

  // fetch(url)
  //   .then((response) => {
  //     console.log(response.json());
  //   })
  //   .catch((err) => console.error(err));
};

async function fetchWeather() {
  const API = "447134f8c845f5c129bd32bdbf98748f";

  const weatherURL = "https://api.openweathermap.org/data/2.5/weather";

  // const zipCode = "SE8 4LP";
  // in case there is space, I will split it into two, so that only the first
  // part is shown because it covers the specific area
  const zipCode = "SE8";
  const countryISO = "GB";
  const unit = "metric"; // standard, imperial
  const lang = "fr";

  /**
   * standard: Kelvin
   * metric: Celsius
   * imperial: Fahrenheit
   */
  const weatherData = await fetchData(
    `${weatherURL}?zip=${zipCode},${countryISO}&appid=${API}&units=${unit}&lang=${lang}`
  );
  console.log(weatherData);
  const {
    weather,
    // pressure: hPa, humidity: %
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    visibility,
    // imperial: miles/sec, others: metres/sec
    wind: { speed, deg },
    // { all }, % depends on the weather, may not exist
    clouds,
    // {1h, 3h}, only if there is rain or snow, in volume. Last hour, Last 3 hours
    rain,
    snow,
    // time of sunrise and sunset in unix or UTC
    sys: { country, sunrise, sunset },
    timezone,
    // Name of the city
    name,
  } = weatherData;
  // main => Clouds, Rain, Snow, Extreme etc
  // description => in words e.g. Partially cloudy
  // icon => assuming the icon is 10d, use this url: http://openweathermap.org/img/wn/10d@2x.png
  // http://openweathermap.org/img/wn/10d.png
  const { main, description, icon } = weather[0];
}

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
// fetchWeather();
