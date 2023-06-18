# Nomadica

## Table of Contents

-   [Description](#description)
-   [ExchangeRateAPI](#exchangerate-api)
-   [DeploymentPageLink](#deployment-page-link)
-   [UserStory](#user-story)
-   [Screenshots](#screenshots)
-   [Directions](#directions-for-future-development)
-   [Authors](#authors)
-   [PoweredBy](#powered-by)

## Description

Have you ever thought about packing your bags and starting over somewhere new? It's tempting, but it can be distressing not knowing how people with your occupation fare financially in a foreign land. Nomadica’s purpose is to give you the information needed to make an informed, confident decision about relocating.</br></br>
Nomadica allows you to search the median annual salary for 50+ occupations in 200+ countries and compare it to that country’s median household income. These figures are both displayed in the searched country's currency (or USD if the Rates API does not contain a conversion rate). These figures can then be converted to common currencies with the flag buttons at the bottom of the page. Your search history is updated after each successful search and stores your last 5 unique searches.

## ExchangeRate API

-   If you want to run this locally and see the exchange rates. For now the api being used to make these requests is https://www.exchangerate-api.com/
    you'll have to create an account there and get an api key from your account. Create a .env file in server directory and make an environment variable API_KEY

```shell
API_KEY='<YOUR API KEY HERE>'
```

## Deployment Page Link

<a href="https://nomadica-app.herokuapp.com" rel="noopener noreferrer" >Here on Heroku</a>

## User Story

AS A person interested in relocating for work</br>
I WANT to know what people in my occupation live like in other countries</br>
SO THAT I can make an informed decision about moving there

## Screenshots

![No Search History](https://user-images.githubusercontent.com/65088117/88120282-92fced80-cb90-11ea-8d25-8fd0c9a47443.png)</br>
![First Search & Tooltip](https://user-images.githubusercontent.com/65088117/88120468-f38c2a80-cb90-11ea-9135-fd077c819d09.png)</br>
![Several Searches](https://user-images.githubusercontent.com/65088117/88120712-95ac1280-cb91-11ea-8ad4-ea801a8c0ce6.png)

## Directions for Future Development

-   Comparison to searched country's poverty line and purchasing power parity to give additional context
-   Allow users to save a "home country" in local storage and display their home country’s median household income in case they are interested in remote work
-   Include link to resources for immigrating to that country

## Authors

Created by Anders Ackerman, Daniel Monterrosa, and Junior Escobar

## Powered By

-   <a href="https://developers.teleport.org/api/" rel="noopener noreferrer">Teleport API</a>
-   <a href="https://www.exchangerate-api.com/" rel="noopener noreferrer">ExchangeRate-API</a>
-   Deprecated <a href="https://github.com/Dj-Viking/Nomadica/pull/55" rel="noopener noreferrer">PR on this deprecation of country flags api, using emoji strings now.</a>
    -   <a href="https://www.countryflags.io/" rel="noopener noreferrer" >Country Flags API (NO LONGER IN SERVICE!)</a>
-   <a href="https://tailwindcss.com" rel="noopener noreferrer">Tailwind CSS</a>
-   <a href="https://fonts.google.com" rel="noopener noreferrer">Google Fonts</a>
