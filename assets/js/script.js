//  Sickest group of all time code for Teleport API calls
//      * currently used to get the countryCode iso_alpha2 format i.e. "US" based on user prompt input of the country name "United States" or "united states"
//      * gets country currency code from the country name entered
//      * gets median annual salary (USD) of web developers in that country
//      * unused function getCountryList() is declared at the bottom here to show the country list in a for loop console logged

const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");

function formSubmitHandler() {

    //this prevents the refreshing of the page when form is submitted
    event.preventDefault();

    // this will hold the value of the user's search
    let searchTerm = userInputEl.value;

    userFormEl.reset();

    let countryInfo = {};

    // this function is in a different JS file!! must place it above script.js!!
    // this function returns an array with country code and country name index flipped depending on search term
    let countryCode = getCountryCodeOrName(searchTerm);

    // if the country code was searched, the country name will be index [1]. if country name was searched, the country code will be index [0]
    let countryName = searchTerm.length === 2 ? countryCode[1] : countryCode [0];
    console.log(`country name: ${countryName}`);
    countryInfo.countryName = countryName;

    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryCode = searchTerm.length === 2 ? countryCode[0] : countryCode[1];
    console.log(`country code: ${countryCode}`);
    countryInfo.countryCode = countryCode;

    let medianHouseholdIncome = getMedianHouseholdIncome(countryName);
    console.log(`Overall median income in searched country: ${medianHouseholdIncome} USD`);
    countryInfo.medianHouseholdIncome = medianHouseholdIncome;
    
    getCurrencyCode(countryInfo);
}

function getMedianHouseholdIncome(countryName) {
    let medianHouseholdIncome;
    for (let i = 0; i < medianIncomeArr.length; i++) {
        if (medianIncomeArr[i].country == countryName) {
            medianHouseholdIncome = medianIncomeArr[i].medianPerCapitaIncome;
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
            console.log(`country currency code: ${countryInfo.currencyCode}`);
            getMedianSalary(countryInfo);
        });
}

function getMedianSalary(countryInfo) {
    fetch( `https://api.teleport.org/api/countries/iso_alpha2:${countryInfo.countryCode}/salaries/` )
        .then( (response) => response.json() )
        .then( ({salaries}) => {
            console.log("salary info for various jobs in the searched country:");
            console.log(salaries);

            for (let i = 0; i < salaries.length; i++) {
                if (salaries[i].job.id == "WEB-DEVELOPER" || salaries[i].job.id == "Web Developer") {
                    let medianSalary = salaries[i].salary_percentiles.percentile_50;
                    countryInfo.medianSalary = medianSalary;
                    console.log(`median web developer annual salary in ${countryInfo.countryCode}: ${countryInfo.medianSalary} USD`);
                }
            }
            getConversionRate(countryInfo);
        });
}

function getConversionRate(countryInfo) {
    fetch( `https://api.ratesapi.io/api/latest?base=USD&symbols=${countryInfo.currencyCode}` )
        .then( (response) => {
            return response.json();
        })
        .then( ({rates}) => {
            // currency conversion from USD into searched country's currency
            let conversionRate = rates[countryInfo.currencyCode];
            countryInfo.conversionRate = conversionRate;
            console.log(`1 USD = ${countryInfo.conversionRate} ${countryInfo.currencyCode}`);
            getConvertedValues(countryInfo);
        });
}

function getConvertedValues(countryInfo) {
    //convert the salary into the currency code conversion rate
    let convertedSalary = Math.floor(countryInfo.medianSalary * countryInfo.conversionRate);
    countryInfo.convertedSalary = convertedSalary;
    //place this number on the document as the salary in that country
    console.log(countryInfo.convertedSalary);
    //place this currency code next to the number
    console.log(countryInfo.currencyCode);
    //place this text as to explain that its a yearly salary
    console.log(`converted median web developer annual salary in ${countryInfo.countryCode}: ${countryInfo.convertedSalary} ${countryInfo.currencyCode}`);
    renderCountryInfo(countryInfo);
}

function renderCountryInfo(countryInfo) {
    // render values to DOM once we know which elements they're being appended to
    console.log(countryInfo);
}

// this function is just going to display all the countries in the console
// each country will have links that need to be fetched to obtain
// this function is currently not being used
function getCountryList() {
    // search for country salaries based on country name
    fetch( `https://api.teleport.org/api/countries/` )
        .then( (response) => {
            console.log("here is the first response from the country name api call");
            console.log(response);
            return response.json();
        })
        .then( (data) => {
            console.log("here is the second response from the country name api call");
            console.log(data);

            console.log("below displaying the json objects for each country..trying to get salaries from this")
            // displaying all the countries just as a test of this loop
            for (let i = 0; i < data._links["country:items"].length; i++){
                fetch( data._links["country:items"][i].href )
                    .then( (response) => {
                        return response.json();
                    })
                    .then( (data) => {
                        console.log(data);
                    });
            }
        });
}

userFormEl.addEventListener("submit", formSubmitHandler);