// Nomad Web Developer
//      * all country codes are in iso_alpha2 format i.e. "US" for "United States" or "JP" for "Japan"

const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");
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
    let searchTerm = userInputEl.value;

    userFormEl.reset();

    startSearch(searchTerm);
}

function startSearch(searchTerm) {

    let countryInfo = {};

    // this function returns an array with country code and country name index flipped depending on search term. returns false if country not found.
    let countryCode = getCountryCodeOrName(searchTerm);

    // if the country code was searched, the country name will be index [1]. if country name was searched, the country code will be index [0]
    countryInfo.countryName = searchTerm.length === 2 ? countryCode[1] : countryCode[0];

    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryInfo.countryCode = searchTerm.length === 2 ? countryCode[0] : countryCode[1];

    // country search validation
    if (!countryInfo.countryCode || !countryInfo.countryName) {
        errorMessageEl.textContent = "We couldn't find that country. Please try again.";
        return;
    }
    errorMessageEl.textContent = "";

    saveSearchHistory(countryInfo.countryName);

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
        .catch((error) => errorMessageEl.textContent = "Unable to connect to database.");
}

function getMedianSalary(countryInfo) {
    fetch(`https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/salaries/`)
        .then((response) => response.json())
        .then(({ salaries }) => {

            for (let i = 0; i < salaries.length; i++) {
                if (salaries[i].job.id == "WEB-DEVELOPER" || salaries[i].job.id == "Web Developer") {
                    // this figure is in USD
                    countryInfo.medianSalary = salaries[i].salary_percentiles.percentile_50;
                }
            }
            getConversionRate(countryInfo);
        })
        .catch((error) => errorMessageEl.textContent = "Unable to connect to database.");
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
        .catch((error) => errorMessageEl.textContent = "Unable to connect to database.");
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
    // render values to DOM once we know which elements they're being appended to
    countryNameEl.textContent = countryInfo.countryName;
    flagImgEl.setAttribute("src", countryInfo.flagUrl);
    countryInfoEl.innerHTML =
        `<p class="font-medium">Median Annual Salary for Web Developers in ${countryInfo.countryName}: ${countryInfo.convertedSalary} <span id="currency-code">${countryInfo.currencyCode}</span></p>
        <p class="font-medium">Median Household Income in ${countryInfo.countryName}: ${countryInfo.convertedMedianHouseholdIncome} ${countryInfo.currencyCode}</p>`;
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
    countryInfo.medianHouseholdIncome = getMedianHouseholdIncome(countryInfo.countryName);
    countryInfo.flagUrl = flagImgEl.getAttribute("src");
    countryInfo.currentCurrencyCode = document.querySelector("#currency-code").textContent;

    getMedianSalary(countryInfo);
}

// when a country is searched, save in localStorage and add to search history. search history filters out duplicates and holds up to 10 country names.
function saveSearchHistory(countryName) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.push(countryName);
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
        searchHistoryListItemEl.textContent = searchHistory[i];

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

function searchHistoryClickHandler(event) {
    startSearch(event.target.textContent);
}

loadSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
quickConvertWrapperEl.addEventListener("click", convertButtonHandler);
searchHistoryListEl.addEventListener("click", searchHistoryClickHandler);