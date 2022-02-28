![main-image](./static/assets/weather.svg)

# Contents
- [Contents](#contents)
- [Introduction](#introduction)
- [Badges](#badges)
- [Page sections](#page-sections)
- [Installation](#installation)
  - [```Install```](#install)
  - [```Editing```](#editing)
  - [```Run```](#run)
- [Technologies](#technologies)
  - [Frontend](#frontend)
    - [HTML](#html)
    - [CSS](#css)
    - [Javascript](#javascript)
  - [Backend](#backend)
- [Dependencies](#dependencies)
- [Credits](#credits)
- [License](#license)


# Introduction
Shows you the current weather based on your location. You can also add your feelings about the weather or anything.
# Badges
![submission](https://img.shields.io/badge/submission-pending-orange)
![status check](https://img.shields.io/github/checks-status/diorla/Weather-Journal-App/main)
![issues](https://img.shields.io/github/issues/Diorla/Weather-Journal-App)
![license](https://img.shields.io/github/license/Diorla/Weather-Journal-App)
![code size](https://img.shields.io/github/languages/code-size/diorla/Weather-Journal-App)
![forks](https://img.shields.io/github/forks/Diorla/Weather-Journal-App)
![stars](https://img.shields.io/github/stars/Diorla/Weather-Journal-App)
![programming languages](https://img.shields.io/github/languages/count/diorla/Weather-Journal-App)
![top language](https://img.shields.io/github/languages/top/diorla/Weather-Journal-App)
![commit status](https://img.shields.io/github/commit-status/diorla/Weather-Journal-App/main/acb21f1a1edba35c4c1fc9472aaf06b1c73d3cf7)
![Package version](https://img.shields.io/github/package-json/v/diorla/Weather-Journal-App)
![Last commit](https://img.shields.io/github/last-commit/diorla/Weather-Journal-App)
![Commit activity](https://img.shields.io/github/commit-activity/w/diorla/Weather-Journal-App)


# Page sections
- Location
- Today's date
- How do you feel today
- Weather information
  - Temperature
  - Sky conditions
  - Sunrise and sunset
  - Wind speed and direction
  - Humidity
  - Pressure
- Form for updating
  - location: country and postcode
  - language
  - feeling
  - unit
- Footer

# Installation

## ```Install```
```sh
git clone https://github.com/Diorla/Weather-Journal-App
```

## ```Editing```
Use any text-editor to update the content

## ```Run```

```sh
npm start
# or
yarn start
```

# Technologies
This is divided into frontend and backend

## Frontend

### HTML
![HTML](https://img.shields.io/badge/HTML-document-dd4b25)

This is a single html file, `pages/index.html`, where all the initial content is loaded

### CSS
![CSS](https://img.shields.io/badge/CSS-style-264de4)

This is saved inside `css/style.css`

### Javascript
![JS](https://img.shields.io/badge/JS-language-cfb430)

It is a single file, `js/scripts.js`. It does the following
- Load initial weather information from openweather
- Toggle hiding and showing of form
- Update user info mainly
  - Language
  - Country
  - Units
  - Post code
  - Feelings about today
- Fetch weather information from openweather when there is a change in the info provided

## Backend
The backend is written in `nodejs` and powered by `express.js`. it is found inside `./index.js`. It does the following
- Starts the server
- Handles routing
- Serves the `index.html` file
- Serves other static files
- Returns `projectData`
- Updates the `projectData`
- `projectData` includes the following
  - language
  - feelings
  - units
  - country
  - postcode


# Dependencies
 - express
 - body-parser
 - cors
 - colors

# Credits
- Icons from [fontawesome](https://fontawesome.com)
- Weather icons from [weather icons](https://iconarchive.com/show/weather-icons-by-jaan-jaak.html) by [Jaan Jaak](deviantart.com/jaan-jaak/art/Weather-Icon-Set-331363831)
- Weather icons from [weather icons](https://iconarchive.com/show/oxygen-icons-by-oxygen-icons.org.html) by [Oxygen](https://iconarchive.com/artist/oxygen-icons.org.html)
- Wind icon from [here](https://iconarchive.com/show/ios7-icons-by-icons8.html) by [icons8](https://icons8.com/)
- Question icon from [here](https://iconarchive.com/show/blue-bits-icons-by-icojam.html) by [icojam](http://www.icojam.com/)
- Temperature background by  [StockSnap](https://pixabay.com/users/stocksnap-894430/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2572197) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2572197)
- List of 2 letter ISO code was gotten from [here](https://gist.github.com/almost/7748738)
- Readme image from [undraw](https://undraw.co/)

# License
This is under [MIT](https://choosealicense.com/licenses/mit/) license, for more details, please check [License.md](https://github.com/Diorla/Weather-Journal-App/blob/main/LICENCE.md).

[(Back to top)](#contents)