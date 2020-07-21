// Nomad Web Developer
//      * all country codes are in iso_alpha2 format i.e. "US" for "United States" or "JP" for "Japan"

const scrollDivEl = document.querySelector("#scroll-div");
const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");
const userSelectEl = document.querySelector("#user-select");
const errorMessageEl = document.querySelector("#search-error-message");
const countryNameEl = document.querySelector("#country-name");
const flagImgEl = document.querySelector("#flag-img");
const quickConvertWrapperEl = document.querySelector("#quick-convert-wrapper");
const countryInfoEl = document.querySelector("#country-info");
const searchHistoryListEl = document.querySelector("#search-history-list");

function formSubmitHandler(event) {

    //this prevents the refreshing of the page when form is submitted
    event.preventDefault();

    // this will hold the value of the user's search
    let locationSearch = userInputEl.value;
    let occupationValue = userSelectEl.value;
    let occupationName = userSelectEl.options[userSelectEl.selectedIndex].text;

    userFormEl.reset();

    startSearch(locationSearch, occupationValue, occupationName);
}

function startSearch(locationSearch, occupationValue, occupationName) {

    let countryInfo = {};

    countryInfo.occupationName = occupationName;
    countryInfo.occupationValue = occupationValue;

    // this function returns an array with country code and country name index flipped depending on search term. returns false if country not found.
    let countryCode = getCountryCodeOrName(locationSearch);

    // if the country code was searched, the country name will be index [1]. if country name was searched, the country code will be index [0]
    countryInfo.countryName = locationSearch.length === 2 ? countryCode[1] : countryCode[0];

    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryInfo.countryCode = locationSearch.length === 2 ? countryCode[0] : countryCode[1];

    // country search validation
    if (!countryInfo.countryCode || !countryInfo.countryName) {
        errorMessageEl.textContent = "We couldn't find that country. Please try again.";
        return;
    }
    errorMessageEl.textContent = "";

    saveSearchHistory(countryInfo);

    let flagUrl = getFlagUrl(countryInfo.countryCode);
    countryInfo.flagUrl = flagUrl;

    let medianHouseholdIncome = getMedianHouseholdIncome(countryInfo.countryName);
    countryInfo.medianHouseholdIncome = medianHouseholdIncome;

    getCurrencyCode(countryInfo);
}

// returns img src link from country flags api
function getFlagUrl(countryCode) {
    let flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`;
    return flagUrl;
}

function getMedianHouseholdIncome(countryName) {
    let medianHouseholdIncome;
    for (let i = 0; i < medianIncomeArr.length; i++) {
        if (medianIncomeArr[i].country == countryName) {
            // this figure is in USD
            medianHouseholdIncome = medianIncomeArr[i].medianHouseholdIncome;
        }
    }
    return medianHouseholdIncome;
}

// get the currency code from the country code for conversion API
function getCurrencyCode(countryInfo) {
    fetch(`https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/`)
        .then((response) => response.json())
        .then((data) => {
            // get currency code
            countryInfo.currencyCode = data.currency_code;
            getMedianSalary(countryInfo);
        })
        .catch((error) => errorMessageEl.textContent = "Unable to connect to Country Selection database.");
}

function getMedianSalary(countryInfo) {
    fetch(`https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/salaries/`)
        .then((response) => response.json())
        .then(({ salaries }) => {

            for (let i = 0; i < salaries.length; i++) {
                if (salaries[i].job.title == countryInfo.occupationValue) {
                    // this figure is in USD
                    countryInfo.medianSalary = salaries[i].salary_percentiles.percentile_50;
                }
            }
            getConversionRate(countryInfo);
        })
        .catch((error) => errorMessageEl.textContent = "Unable to connect to Median Salary database.");
}

function getConversionRate(countryInfo) {
    fetch(`https://api.ratesapi.io/api/latest?base=USD&symbols=${countryInfo.currencyCode}`)
        .then((response) => response.json())
        .then(({ rates }) => {
            let conversionRate;
            if (rates) {
                // currency conversion rate for USD to searched country's currency
                conversionRate = rates[countryInfo.currencyCode];
            } else {
                // if no conversion rate found, default to USD
                conversionRate = 1;
                countryInfo.currencyCode = "USD";
            }
            countryInfo.conversionRate = conversionRate;
            getConvertedValues(countryInfo);
        })
        .catch((error) => errorMessageEl.textContent = "Unable to connect to Rate Conversion database.");
}

//convert medianSalary and medianHouseholdIncome using conversionRate
function getConvertedValues(countryInfo) {
    let convertedSalary = Math.floor(countryInfo.medianSalary * countryInfo.conversionRate);
    countryInfo.convertedSalary = convertedSalary ? convertedSalary : "No salary data found ☹️";

    let convertedMedianHouseholdIncome = Math.floor(countryInfo.medianHouseholdIncome * countryInfo.conversionRate);
    countryInfo.convertedMedianHouseholdIncome = convertedMedianHouseholdIncome ? convertedMedianHouseholdIncome : "No median household income data found ☹️";

    renderCountryInfo(countryInfo);
}

function renderCountryInfo(countryInfo) {
    // hide pre-search elements and display post-search elements
    // quickConvertWrapperEl.classList.remove("hide-before-search");

    // render values to DOM
    countryNameEl.textContent = countryInfo.countryName;
    flagImgEl.setAttribute("src", countryInfo.flagUrl);
    countryInfoEl.innerHTML =
        `<p class="font-medium">Median Annual Salary for <span id="occupation" data-value="${countryInfo.occupationValue}">${countryInfo.occupationName}</span>s in ${countryInfo.countryName}: ${countryInfo.convertedSalary} <span id="currency-code">${countryInfo.currencyCode}</span></p>
        <p class="font-medium">Median Household Income in ${countryInfo.countryName}: ${countryInfo.convertedMedianHouseholdIncome} ${countryInfo.currencyCode}</p>`;
    // scrollDivEl.scrollIntoView();
}

function convertButtonHandler(event) {
    let countryInfo = {};
    if (event.target.getAttribute("data-currency")) {
        countryInfo.currencyCode = event.target.getAttribute("data-currency");
    } else {
        return;
    }
    countryInfo.countryName = countryNameEl.textContent;
    countryInfo.countryCode = getCountryCodeOrName(countryInfo.countryName)[1];
    countryInfo.occupationName = document.querySelector("#occupation").textContent;
    countryInfo.occupationValue = document.querySelector("#occupation").getAttribute("data-value");
    countryInfo.medianHouseholdIncome = getMedianHouseholdIncome(countryInfo.countryName);
    countryInfo.flagUrl = flagImgEl.getAttribute("src");
    countryInfo.currentCurrencyCode = document.querySelector("#currency-code").textContent;

    getMedianSalary(countryInfo);
}

// when a country is searched, save in localStorage and add to search history. search history filters out duplicates and holds up to 10 country names.
function saveSearchHistory(countryInfo) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.push(`${countryInfo.countryName} - ${countryInfo.occupationName} - ${countryInfo.occupationValue}`);
    searchHistory = searchHistory.filter((value, index, array) => array.indexOf(value) === index);
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(1, 11);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryListEl.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
        let searchHistoryListItemEl = document.createElement("li");
        searchHistoryListItemEl.classList = "";

        let searchHistoryButtonEl = document.createElement("li");
        searchHistoryButtonEl.setAttribute("type", "submit");
        searchHistoryButtonEl.setAttribute("data-value", searchHistory[i].split("-")[2].trim());
        searchHistoryButtonEl.textContent = `${searchHistory[i].split("-")[0].trim()} - ${searchHistory[i].split("-")[1].trim()}`;
        searchHistoryListItemEl.appendChild(searchHistoryButtonEl);

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

function searchHistoryClickHandler(event) {
    let locationSearch = event.target.innerHTML.split("-")[0].trim();
    let occupationName = event.target.innerHTML.split("-")[1].trim();
    let occupationValue = event.target.getAttribute("data-value");
    startSearch(locationSearch, occupationValue, occupationName);
}

loadSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
quickConvertWrapperEl.addEventListener("click", convertButtonHandler);
searchHistoryListEl.addEventListener("mousedown", searchHistoryClickHandler);