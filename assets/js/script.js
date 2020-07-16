//  Sickest group of all time code for Teleport API calls
//      * currently used to get the countryCode iso_alpha2 format i.e. "US" based on user prompt input of the country name "United States" or "united states"
//      * gets country currency code from the country name entered
//      * gets median annual salary (USD) of web developers in that country
//      * unused function getCountryList() is declared at the bottom here to show the country list in a for loop console logged

const userFormEl = document.querySelector("#user-form");
const userInputEl = document.querySelector("#user-input");
const searchButtonEl = document.querySelector("#search-button")

function formSubmitHandler() {
    //this prevents the refreshing of the page
    //if user hits ENTER key while focused on the user-input element
    //or if the user clicks search-button element
    event.preventDefault();

    // this will hold the value of the user's search
    let searchTerm = userInputEl.value;

    // this function is in a different JS file!! must place it above script.js!!
    // this function returns an array with country code and country name index flipped depending on search term
    let countryCode = getCountryCodeOrName(searchTerm);

    // if the country code was searched, the country code will be index [0]. if country name was searched, the country code will be index [1]
    countryCode = searchTerm.length === 2 ? countryCode[0] : countryCode[1];
    console.log(`country code: ${countryCode}`);
    
    getCurrencyCode(countryCode);
    //let currencyCode = getCurrencyCode(countrycode);
    // this console.logs undefined since getCurrencyCode is an async function. not sure how to fix.
    // (Anders) same for this one, the fetch takes longer come back and define this variable
    //      before its console logged at the moment of the submit or click events
    //console.log(`currency code: ${currencyCode}`);
    
    getMedianSalary(countryCode);
    //let medianSalary = getMedianSalary(countryCode);
    // this console.logs undefined since getMedianSalary is an async function. not sure how to fix.
    // (Anders) yeah medianSalary isn't defined at the moment of the submit or click events
    //   until the promise returns from the server
    //   it takes longer for the promise to return than it does to execute this console.log
    //console.log(`median salary: ${medianSalary}`);
}

// get the currency code from the country code for conversion API
function getCurrencyCode(countryCode){
    fetch( `https://api.teleport.org/api/countries/iso_alpha2:${countryCode}/` )
    .then( (response) => response.json() )
    .then( (data) => {
        let currencyCode = data.currency_code;
        // get currency code
        console.log(`country currency code: ${currencyCode}`);
        fetch(`https://api.ratesapi.io/api/latest?base=USD&symbols=${currencyCode}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("currency conversion from USD into searched country's currency:");
            console.log("for every 1 USD will equal the target currency");
            let currencyObject; 
            
            console.log(data.rates.HRK);
        })

    });
    
}

function getMedianSalary(countryCode){
    fetch( `https://api.teleport.org/api/countries/iso_alpha2:${countryCode}/salaries/` )
    .then( (response) => response.json() )
    .then( ({salaries}) => {
        console.log("salary info for various jobs in the searched country:");
        console.log(salaries);

        for (let i = 0; i < salaries.length; i++) {
            if (salaries[i].job.id == "WEB-DEVELOPER") {
                let medianSalary = salaries[i].salary_percentiles.percentile_50
                console.log(`median salary for web developers in the searched country: ${medianSalary}`);
                return medianSalary;
            }
        }
    });
}

// this function is just going to display all the countries in the console
// each country will have links that need to be fetched to obtain
// this function is currently not being used
function getCountryList(){
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
            })
        }
    });
}
searchButtonEl.addEventListener("click", formSubmitHandler);
userFormEl.addEventListener("submit", formSubmitHandler);