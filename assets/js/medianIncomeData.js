// data aggregated from 2006-2012 gallup poll with at least 2000 responses from each country. Find source here: https://news.gallup.com/poll/166211/worldwide-median-household-income-000.aspx
const medianIncomeArr = [
    {
        "country": "Afghanistan",
        "medianHouseholdIncome": 4121
    },
    {
        "country": "Albania",
        "medianHouseholdIncome": 7314
    },
    {
        "country": "Algeria",
        "medianHouseholdIncome": 7849
    },
    {
        "country": "Angola",
        "medianHouseholdIncome": 3534
    },
    {
        "country": "Argentina",
        "medianHouseholdIncome": 14432
    },
    {
        "country": "Armenia",
        "medianHouseholdIncome": 3865
    },
    {
        "country": "Australia",
        "medianHouseholdIncome": 46555
    },
    {
        "country": "Austria",
        "medianHouseholdIncome": 34911
    },
    {
        "country": "Azerbaijan",
        "medianHouseholdIncome": 11446
    },
    {
        "country": "Bahrain",
        "medianHouseholdIncome": 24693
    },
    {
        "country": "Bangladesh",
        "medianHouseholdIncome": 2819
    },
    {
        "country": "Belarus",
        "medianHouseholdIncome": 15085
    },
    {
        "country": "Belgium",
        "medianHouseholdIncome": 26703
    },
    {
        "country": "Benin",
        "medianHouseholdIncome": 1502
    },
    {
        "country": "Bolivia",
        "medianHouseholdIncome": 6399
    },
    {
        "country": "Bosnia and Herzegovina",
        "medianHouseholdIncome": 7383
    },
    {
        "country": "Botswana",
        "medianHouseholdIncome": 3603
    },
    {
        "country": "Brazil",
        "medianHouseholdIncome": 7522
    },
    {
        "country": "Bulgaria",
        "medianHouseholdIncome": 8487
    },
    {
        "country": "Burkina Faso",
        "medianHouseholdIncome": 1530
    },
    {
        "country": "Burundi",
        "medianHouseholdIncome": 673
    },
    {
        "country": "Cambodia",
        "medianHouseholdIncome": 2308
    },
    {
        "country": "Cameroon",
        "medianHouseholdIncome": 2075
    },
    {
        "country": "Canada",
        "medianHouseholdIncome": 41280
    },
    {
        "country": "Chad",
        "medianHouseholdIncome": 2394
    },
    {
        "country": "Chile",
        "medianHouseholdIncome": 8098
    },
    {
        "country": "China",
        "medianHouseholdIncome": 6180
    },
    {
        "country": "Colombia",
        "medianHouseholdIncome": 6544
    },
    {
        "country": "Comoros",
        "medianHouseholdIncome": 3912
    },
    {
        "country": "Costa Rica",
        "medianHouseholdIncome": 8929
    },
    {
        "country": "Croatia",
        "medianHouseholdIncome": 16231
    },
    {
        "country": "Cyprus",
        "medianHouseholdIncome": 18242
    },
    {
        "country": "Czech Republic",
        "medianHouseholdIncome": 22913
    },
    {
        "country": "Denmark",
        "medianHouseholdIncome": 44360
    },
    {
        "country": "Dominican Republic",
        "medianHouseholdIncome": 6302
    },
    {
        "country": "DR Congo",
        "medianHouseholdIncome": 1988
    },
    {
        "country": "Ecuador",
        "medianHouseholdIncome": 6858
    },
    {
        "country": "Egypt",
        "medianHouseholdIncome": 3111
    },
    {
        "country": "El Salvador",
        "medianHouseholdIncome": 4828
    },
    {
        "country": "Estonia",
        "medianHouseholdIncome": 12577
    },
    {
        "country": "Finland",
        "medianHouseholdIncome": 24615
    },
    {
        "country": "France",
        "medianHouseholdIncome": 31112
    },
    {
        "country": "Georgia",
        "medianHouseholdIncome": 2591
    },
    {
        "country": "Germany",
        "medianHouseholdIncome": 33333
    },
    {
        "country": "Ghana",
        "medianHouseholdIncome": 2050
    },
    {
        "country": "Greece",
        "medianHouseholdIncome": 17777
    },
    {
        "country": "Guatemala",
        "medianHouseholdIncome": 4516
    },
    {
        "country": "Haiti",
        "medianHouseholdIncome": 2735
    },
    {
        "country": "Honduras",
        "medianHouseholdIncome": 4848
    },
    {
        "country": "Hong Kong",
        "medianHouseholdIncome": 35443
    },
    {
        "country": "Hungary",
        "medianHouseholdIncome": 12445
    },
    {
        "country": "India",
        "medianHouseholdIncome": 3168
    },
    {
        "country": "Indonesia",
        "medianHouseholdIncome": 2199
    },
    {
        "country": "Iran",
        "medianHouseholdIncome": 12046
    },
    {
        "country": "Iraq",
        "medianHouseholdIncome": 4917
    },
    {
        "country": "Ireland",
        "medianHouseholdIncome": 25085
    },
    {
        "country": "Israel",
        "medianHouseholdIncome": 30364
    },
    {
        "country": "Italy",
        "medianHouseholdIncome": 20085
    },
    {
        "country": "Japan",
        "medianHouseholdIncome": 33822
    },
    {
        "country": "Jordan",
        "medianHouseholdIncome": 8276
    },
    {
        "country": "Kazakhstan",
        "medianHouseholdIncome": 7492
    },
    {
        "country": "Kenya",
        "medianHouseholdIncome": 1870
    },
    {
        "country": "Kuwait",
        "medianHouseholdIncome": 40854
    },
    {
        "country": "Kyrgyzstan",
        "medianHouseholdIncome": 4034
    },
    {
        "country": "Laos",
        "medianHouseholdIncome": 3379
    },
    {
        "country": "Latvia",
        "medianHouseholdIncome": 10461
    },
    {
        "country": "Lebanon",
        "medianHouseholdIncome": 13004
    },
    {
        "country": "Liberia",
        "medianHouseholdIncome": 781
    },
    {
        "country": "Libya",
        "medianHouseholdIncome": 6398
    },
    {
        "country": "Lithuania",
        "medianHouseholdIncome": 12375
    },
    {
        "country": "Luxembourg",
        "medianHouseholdIncome": 52493
    },
    {
        "country": "Macedonia",
        "medianHouseholdIncome": 8606
    },
    {
        "country": "Madagascar",
        "medianHouseholdIncome": 1013
    },
    {
        "country": "Malaysia",
        "medianHouseholdIncome": 11207
    },
    {
        "country": "Mali",
        "medianHouseholdIncome": 1983
    },
    {
        "country": "Malta",
        "medianHouseholdIncome": 21141
    },
    {
        "country": "Mauritania",
        "medianHouseholdIncome": 6679
    },
    {
        "country": "Mexico",
        "medianHouseholdIncome": 11680
    },
    {
        "country": "Moldova",
        "medianHouseholdIncome": 4158
    },
    {
        "country": "Mongolia",
        "medianHouseholdIncome": 5922
    },
    {
        "country": "Montenegro",
        "medianHouseholdIncome": 11519
    },
    {
        "country": "Morocco",
        "medianHouseholdIncome": 6634
    },
    {
        "country": "Nepal",
        "medianHouseholdIncome": 2718
    },
    {
        "country": "Netherlands",
        "medianHouseholdIncome": 38584
    },
    {
        "country": "New Zealand",
        "medianHouseholdIncome": 35562
    },
    {
        "country": "Nicaragua",
        "medianHouseholdIncome": 6488
    },
    {
        "country": "Niger",
        "medianHouseholdIncome": 2708
    },
    {
        "country": "Nigeria",
        "medianHouseholdIncome": 2667
    },
    {
        "country": "Norway",
        "medianHouseholdIncome": 51489
    },
    {
        "country": "Pakistan",
        "medianHouseholdIncome": 4060
    },
    {
        "country": "Panama",
        "medianHouseholdIncome": 8356
    },
    {
        "country": "Paraguay",
        "medianHouseholdIncome": 6179
    },
    {
        "country": "Peru",
        "medianHouseholdIncome": 5161
    },
    {
        "country": "Philippines",
        "medianHouseholdIncome": 2401
    },
    {
        "country": "Poland",
        "medianHouseholdIncome": 15338
    },
    {
        "country": "Portugal",
        "medianHouseholdIncome": 16186
    },
    {
        "country": "Qatar",
        "medianHouseholdIncome": 26555
    },
    {
        "country": "Republic of the Congo",
        "medianHouseholdIncome": 2106
    },
    {
        "country": "Romania",
        "medianHouseholdIncome": 7922
    },
    {
        "country": "Russia",
        "medianHouseholdIncome": 11724
    },
    {
        "country": "Rwanda",
        "medianHouseholdIncome": 1101
    },
    {
        "country": "Saudi Arabia",
        "medianHouseholdIncome": 24980
    },
    {
        "country": "Senegal",
        "medianHouseholdIncome": 3897
    },
    {
        "country": "Serbia",
        "medianHouseholdIncome": 8921
    },
    {
        "country": "Sierra Leone",
        "medianHouseholdIncome": 2330
    },
    {
        "country": "Singapore",
        "medianHouseholdIncome": 32360
    },
    {
        "country": "Slovakia",
        "medianHouseholdIncome": 17415
    },
    {
        "country": "Slovenia",
        "medianHouseholdIncome": 25969
    },
    {
        "country": "South Africa",
        "medianHouseholdIncome": 5217
    },
    {
        "country": "South Korea",
        "medianHouseholdIncome": 40861
    },
    {
        "country": "Spain",
        "medianHouseholdIncome": 21959
    },
    {
        "country": "Sri Lanka",
        "medianHouseholdIncome": 3242
    },
    {
        "country": "Sudan",
        "medianHouseholdIncome": 3640
    },
    {
        "country": "Sweden",
        "medianHouseholdIncome": 50514
    },
    {
        "country": "Syria",
        "medianHouseholdIncome": 8193
    },
    {
        "country": "Taiwan",
        "medianHouseholdIncome": 32762
    },
    {
        "country": "Tajikistan",
        "medianHouseholdIncome": 5137
    },
    {
        "country": "Tanzania",
        "medianHouseholdIncome": 2154
    },
    {
        "country": "Thailand",
        "medianHouseholdIncome": 7029
    },
    {
        "country": "Togo",
        "medianHouseholdIncome": 571
    },
    {
        "country": "Tunisia",
        "medianHouseholdIncome": 8966
    },
    {
        "country": "Turkey",
        "medianHouseholdIncome": 8955
    },
    {
        "country": "Uganda",
        "medianHouseholdIncome": 1775
    },
    {
        "country": "Ukraine",
        "medianHouseholdIncome": 11074
    },
    {
        "country": "United Kingdom",
        "medianHouseholdIncome": 31617
    },
    {
        "country": "United States",
        "medianHouseholdIncome": 43585
    },
    {
        "country": "Uruguay",
        "medianHouseholdIncome": 7949
    },
    {
        "country": "Venezuela",
        "medianHouseholdIncome": 11299
    },
    {
        "country": "Vietnam",
        "medianHouseholdIncome": 4783
    },
    {
        "country": "Yemen",
        "medianHouseholdIncome": 3178
    },
    {
        "country": "Zambia",
        "medianHouseholdIncome": 1501
    }
];