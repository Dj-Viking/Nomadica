// Nomad Web Developer
//      * all country codes are in iso_alpha2 format i.e. "US" for "United States" or "JP" for "Japan"


// TODO: (provide static flag emojis for the currency conversion buttons)

const EUFlagConvertEl = document.querySelector("#eur-quick-convert");
EUFlagConvertEl.textContent = getCountryFlagFromNameOrCode("EU");
EUFlagConvertEl.style.fontSize = "30px";
const JPFlagConvertEl = document.querySelector("#jpy-quick-convert");
JPFlagConvertEl.textContent = getCountryFlagFromNameOrCode("JP");
JPFlagConvertEl.style.fontSize = "30px";
const GBPFlagConvertEl = document.querySelector("#gbp-quick-convert");
GBPFlagConvertEl.textContent = getCountryFlagFromNameOrCode("GB");
GBPFlagConvertEl.style.fontSize = "30px";
const CADFlagConvertEl = document.querySelector("#cad-quick-convert");
CADFlagConvertEl.textContent = getCountryFlagFromNameOrCode("CA");
CADFlagConvertEl.style.fontSize = "30px";
const USFlagConvertEl = document.querySelector("#usd-quick-convert");
USFlagConvertEl.textContent = getCountryFlagFromNameOrCode("US");
USFlagConvertEl.style.fontSize = "30px";

const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");
const userSelectEl = document.querySelector("#user-select");
const errorMessageEl = document.querySelector("#search-error-message");
const scrollDivEl = document.querySelector("#scroll-div");
const countryInfoEl = document.querySelector("#country-info");
const countryNameEl = document.querySelector("#country-name");
const flagImgEmojiEl = document.querySelector("#flag-img");
const occupationNameEl = document.querySelector("#occupation-name");
const medianSalaryEl = document.querySelector("#median-salary");
const medianHouseholdIncomeEl = document.querySelector("#median-household-income");
const salaryAnalysisEl = document.querySelector("#salary-analysis");
const quickConvertWrapperEl = document.querySelector("#quick-convert-wrapper");
const searchHistoryContainerEl = document.querySelector("#search-history");
const searchHistoryListEl = document.querySelector("#search-history-list");

function formSubmitHandler(event) {

    //this prevents the refreshing of the page when form is submitted
    event.preventDefault();

    // this will hold the value of the user's search
    let locationSearch = userInputEl.value.trim();
    let occupationValue = userSelectEl.value;

    startSearch(locationSearch, occupationValue);
}

function startSearch(locationSearch, occupationValue) {


    /**
     * @type {{
     *  occupationValue: string;
     *  countryName: string;
     *  countryNameOrCode: string;
     *  countryFlag: string;
     *  countryCode: string;
     *  medianHouseholdIncome: number;
     *  medianSalary: number;
     * }}
     */
    let countryInfo = {};

    countryInfo.occupationValue = occupationValue;

    // this function returns an array with country code and country name index flipped depending on search term. returns false if country not found.
    let countryNameOrCode = getCountryCodeOrName(locationSearch);

    
    // if the country code was searched, the country name will be index [1]. if country name was searched, the country code will be index [0]
    countryInfo.countryName = locationSearch.length === 2 ? countryNameOrCode[1] : countryNameOrCode[0];
    
    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryInfo.countryCode = locationSearch.length === 2 ? countryNameOrCode[0] : countryNameOrCode[1];
    
    countryInfo.countryFlag = getCountryFlagFromNameOrCode(
        locationSearch.length === 2 ? countryNameOrCode[0] : countryNameOrCode[1]
    );

    // country search validation
    if (!countryInfo.countryCode || !countryInfo.countryName) {
        errorMessageEl.textContent = "We couldn't find that country.";
        return;
    }
    errorMessageEl.textContent = "";

    saveSearchHistory(countryInfo);

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
        .catch((error) => errorMessageEl.textContent = "Unable to connect to Median Salary database." + error);
}

function getConversionRate(countryInfo) {
    //test url
    // const API_URL = `http://localhost:4000/rates/?base=USD&code=${countryInfo.currencyCode}`
    // prod api url?? TODO deploy to prod
    const API_URL = `https://nomadica-app.herokuapp.com/rates/?base=USD&code=${countryInfo.currencyCode}`;
    fetch(`${API_URL}`)
        .then((response) => response.json())
        .then(({ data }) => {
            let conversionRate;
            if (data) {
                // currency conversion rate for USD to searched country's currency
                conversionRate = data;
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
    countryInfo.convertedSalary = convertedSalary ? convertedSalary : "No data found ☹️";

    let convertedMedianHouseholdIncome = Math.floor(countryInfo.medianHouseholdIncome * countryInfo.conversionRate);
    countryInfo.convertedMedianHouseholdIncome = convertedMedianHouseholdIncome ? convertedMedianHouseholdIncome : "No data found ☹️";

    let salaryAnalysis = Math.floor((countryInfo.convertedSalary / countryInfo.convertedMedianHouseholdIncome) * 100);
    countryInfo.salaryAnalysis = salaryAnalysis;

    countryInfo.countryFlag = getCountryFlagFromNameOrCode(countryInfo.countryCode);

    renderCountryInfo(countryInfo);
}

function renderCountryInfo(countryInfo) {
    // hide pre-search elements and display post-search elements
    countryInfoEl.classList.remove("hidden");

    // render values to DOM
    countryNameEl.textContent = countryInfo.countryName;
    occupationNameEl.textContent = countryInfo.occupationValue;
    flagImgEmojiEl.textContent = countryInfo.countryFlag;
    flagImgEmojiEl.style.fontSize = "30px";
    flagImgEmojiEl.setAttribute("alt", `${countryInfo.countryName} flag`);
    medianSalaryEl.innerHTML = `Median Annual Salary: <span class="figures text-color-gunmetal">${numberWithCommas(countryInfo.convertedSalary)} <span id="currency-code" class="text-color-gunmetal">${countryInfo.currencyCode}</span></span>`;
    medianHouseholdIncomeEl.innerHTML = `Median Household Income: <span class="figures text-color-gunmetal">${numberWithCommas(countryInfo.convertedMedianHouseholdIncome)} ${countryInfo.currencyCode}</span>`;
    switch(true) {
        case countryInfo.salaryAnalysis > 100: {
            salaryAnalysisEl.innerHTML = `Pays about <span class="text-green-600">${countryInfo.salaryAnalysis - 100}% above</span> median income`;
        }
        break;
        case countryInfo.salaryAnalysis < 100: {
            salaryAnalysisEl.innerHTML = `Pays about <span class="text-red-600">${100 - countryInfo.salaryAnalysis}% below</span> median income`;
        }
        break;
        case countryInfo.salaryAnalysis == 100: {
            salaryAnalysisEl.innerHTML = `Pays about equal to the median income`;
        }
        break;
        default: {
            salaryAnalysisEl.innerHTML = "";
        }
    }
    countryInfoEl.scrollIntoView({behavior: "smooth"});
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
    countryInfo.occupationValue = occupationNameEl.textContent;
    countryInfo.medianHouseholdIncome = getMedianHouseholdIncome(countryInfo.countryName);
    countryInfo.currentCurrencyCode = document.querySelector("#currency-code").textContent;

    getMedianSalary(countryInfo);
}

// when a country is searched, save in localStorage and add to search history. search history filters out duplicates and holds up to 10 country names.
function saveSearchHistory(countryInfo) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.push(`${countryInfo.countryName} - ${countryInfo.occupationValue}`);
    searchHistory = searchHistory.filter((value, index, array) => array.indexOf(value) === index);
    if (searchHistory.length > 5) {
        searchHistory = searchHistory.slice(1, 6);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryListEl.innerHTML = "";

    if (searchHistory.length != 0) {
        searchHistoryContainerEl.classList.remove("hidden");
    }

    for (let i = 0; i < searchHistory.length; i++) {
        let searchHistoryListItemEl = document.createElement("li");
        searchHistoryListItemEl.classList.add("list-item", "cursor-pointer", "mb-3", "px-1", "py-2", "border", "border-solid", "border-color-sand", "rounded-lg", "bg-color-terracotta", "font-semibold");
        searchHistoryListItemEl.textContent = `${searchHistory[i].split("-")[0].trim()} - ${searchHistory[i].split("-")[1].trim()}`;

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

function searchHistoryClickHandler(event) {
    if (event.target.classList.contains("list-item")) {
        let locationSearch = event.target.textContent.split("-")[0].trim();
        let occupationValue = event.target.textContent.split("-")[1].trim();
        startSearch(locationSearch, occupationValue);
    }
}

loadSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
quickConvertWrapperEl.addEventListener("click", convertButtonHandler);
searchHistoryListEl.addEventListener("mousedown", searchHistoryClickHandler);