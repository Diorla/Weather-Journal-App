const editButton = document.getElementById("edit-button");
const editIcon = document.querySelector("#edit-button >  .fa-solid");
const form = document.querySelector("form");
const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("button");
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
// supported language on openweather api
const languageData = new Promise((resolve, reject) => {
  fetch("../data/language.json")
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

const loadLanguage = () => {
  const docFrag = new DocumentFragment();
  languageData
    .then((dt) => {
      for (let item in dt) {
        // console.log(dt)
        const option = document.createElement("Option");
        option.value = item;
        option.textContent = dt[item];
        docFrag.appendChild(option);
      }
    })
    .then(() => {
      document.getElementById("language-select").appendChild(docFrag);
    })
    .then(() => {
      // fetch current country from backend on load
      // document.getElementById('language-select').value = 'fr'
    })
    .catch((err) => console.log(err));
};

const loadCountries = () => {
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
      document.getElementById("country-select").appendChild(docFrag);
    })
    .then(() => {
      // fetch current country from backend on load
      // document.getElementById('language-select').value = 'fr'
    })
    .catch((err) => console.log(err));
};
document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
  loadLanguage();
  document.getElementById("country-select").value = "AL";
});
