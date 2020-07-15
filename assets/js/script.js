//country-name-salary-test-branch
//July, 15 2020


//  Anders Ackerman test code for the api calls of the api Teleport
//      * currently used to get the countryCode iso_alpha2 format i.e. "US" based on user prompt input of the country name "United States" or "united states"
//      * gets country salary Code from the country name entered
//      * gets the salary of the web developers in that country
//          - the salary shown is based on the currency of that country
//      * a function getCountryList() is declared at the bottom here to show the country list in a for loop console logged
//      * the function apiTestFetch() is just testing the api at the top of the api tree

let countryName = window.prompt("search a city you want to check the salaries of that country");

//this will hold the value of the string a user enters
//this function is in a different JS file!! must place it above script.js!!
let countryCode = getCountryCodeOrName(countryName)

getCountryCurrencyCode(countryCode[1]);

getCountrySalaryPercentiles(countryCode[1]);
//index [1] is the returned string value of the country name entered only if the user has entered a country name in the this format "United States" or "united states"
//MUST have entered the country name and not the code
//if the country code was entered, the country code will be index [0]
console.log(countryCode[1]);


//get the salary code from the country code
function getCountryCurrencyCode(countryCode){

    fetch(
        `https://api.teleport.org/api/countries/iso_alpha2:${countryCode}/`
        )
        .then(function(response){
            return response.json();
        })
        .then(function(response2){
            console.log(response2)
            let salaryCode = response2.currency_code;
            //checking to see if we are getting the salary code
            //example japans currency the yen is code JPY
            console.log("displaying country salary code");
            console.log(salaryCode);

        });
}


function getCountrySalaryPercentiles(code){


    fetch(
        `https://api.teleport.org/api/countries/iso_alpha2:${code}/salaries/`
        ).then(function(response){
            return response.json()
        }).then(function(response2){
            console.log("here are the salaries of jobs in the searched country")
            console.log(response2);

            console.log("here is the salary range of Web Developers in the searched country")
            console.log(response2.salaries[51])
        });
}


// apiTestFetch();
// getCountryList();


//my first testing of the api beginning point, this is by no means
//  an end point api fetch
function apiTestFetch(){
    fetch(
        // `https://api.openaq.org/v1/cities?country=${countryName}`
        // "https://restcountries.eu/rest/v2/all"
        `https://api.teleport.org/api/`
    )
    .then(function(response) {
        console.log("test first returned promise")
        
        console.log(response);
        return response.json();  
    })
    .then(function(response2){
        console.log("returned response.json() in second promise")
        
        console.log(response2);

        console.log("fetching country list object")
        fetch(
            response2._links["country:list"].href
        )
        .then(function(responseCountryList){
            console.log("here is the second fetch first promise with the country list");
            console.log(responseCountryList);
            return responseCountryList.json();
        })
        .then(function(responseCountryList2){
            console.log("here is the second fetch second promise with the countrylist json");
            console.log(responseCountryList2);
        })


    });
    
}

//this function is just going to display all the countries in the console
//each country will have links that need to be fetched to obtain
function getCountryList(){
    //search for country salaries based on country name
    fetch(
        `https://api.teleport.org/api/countries/`
    )
    .then(function(response){
        console.log("here is the first response from the country name api call");
        console.log(response);
        return response.json();
    })
    .then(function(response2){
        console.log("here is the second response from the country name api call");
        console.log(response2);

        console.log("below displaying the json objects for each country..trying to get salaries from this")
        //displaying all the countries just as a test of this loop
        for (let i = 0; i < response2._links["country:items"].length; i++){

            fetch(
                response2._links["country:items"][i].href
                )
                .then(function(responseCountryApiHref){
                    return responseCountryApiHref.json();
                })
                .then(function(responseCountryApiHref2){
                    console.log(responseCountryApiHref2);
                    
                })    
            }
        })
    }
   

    