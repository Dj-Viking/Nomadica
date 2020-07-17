// Nomad Web Developer
//      * all country codes are in iso_alpha2 format i.e. "US" for "United States" or "JP" for "Japan"

const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");
const errorMessageEl = document.querySelector("#search-error-message");
const countryNameEl = document.querySelector("#country-name");
const flagImgEl = document.querySelector("#flag-img");
const quickConvertWrapperEl = document.querySelector("#quick-convert-wrapper");
const usdQuickConvertButtonEl = document.querySelector("#usd-quick-convert");
const eurQuickConvertButtonEl = document.querySelector("#eur-quick-convert");
const jpyQuickConvertButtonEl = document.querySelector("#jpy-quick-convert");
const gbpQuickConvertButtonEl = document.querySelector("#gbp-quick-convert");
const cadQuickConvertButtonEl = document.querySelector("#cad-quick-convert");
const countryInfoEl = document.querySelector("#country-info");

function formSubmitHandler() {

    //this prevents the refreshing of the page when form is submitted
    event.preventDefault();

    // this will hold the value of the user's search
    let searchTerm = userInputEl.value;

    userFormEl.reset();

    let countryInfo = {};

    // this function returns an array with country code and country name index flipped depending on search term. returns false if country not found.
    let countryCode = getCountryCodeOrName(searchTerm);

    // if the country code was searched, the country name will be index [1]. if country name was searched, the country code will be index [0]
    let countryName = searchTerm.length === 2 ? countryCode[1] : countryCode [0];
    countryInfo.countryName = countryName;

    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryCode = searchTerm.length === 2 ? countryCode[0] : countryCode[1];
    countryInfo.countryCode = countryCode;

    // country search validation
    if (!countryInfo.countryCode || !countryInfo.countryName) {
        errorMessageEl.textContent = "We couldn't find that country. Please try again.";
        return;
    }
    errorMessageEl.textContent = "";
    
    let flagUrl = getFlagUrl(countryCode);
    countryInfo.flagUrl = flagUrl;

    let medianHouseholdIncome = getMedianHouseholdIncome(countryName);
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
    fetch( `https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/` )
        .then( (response) => response.json() )
        .then( (data) => {
            // get currency code
            let currencyCode = data.currency_code;
            countryInfo.currencyCode = currencyCode;
            getMedianSalary(countryInfo);
        })
        .catch( (error) => errorMessageEl.textContent = "Unable to connect to database.");
}

function getMedianSalary(countryInfo) {
    fetch( `https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/salaries/` )
    .then( (response) => response.json() )
    .then( ({salaries}) => {
        
        for (let i = 0; i < salaries.length; i++) {
            if (salaries[i].job.id == "WEB-DEVELOPER" || salaries[i].job.id == "Web Developer") {
                // this figure is in USD
                let medianSalary = salaries[i].salary_percentiles.percentile_50;
                countryInfo.medianSalary = medianSalary;
                }
            }
            getConversionRate(countryInfo);
        })
        .catch( (error) => errorMessageEl.textContent = "Unable to connect to database.");
}

function getConversionRate(countryInfo) {
    fetch( `https://api.ratesapi.io/api/latest?base=USD&symbols=${countryInfo.currencyCode}` )
        .then( (response) => response.json() )
        .then( ({rates}) => {
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
        .catch( (error) => errorMessageEl.textContent = "Unable to connect to database.");
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
        `<p class="font-medium">Median Annual Salary for Web Developers in ${countryInfo.countryName}: ${countryInfo.convertedSalary} ${countryInfo.currencyCode}</p>
        <p class="font-medium">Median Household Income in ${countryInfo.countryName}: ${countryInfo.convertedMedianHouseholdIncome} ${countryInfo.currencyCode}</p>`;
    console.log(countryInfo);
}

userFormEl.addEventListener("submit", formSubmitHandler);