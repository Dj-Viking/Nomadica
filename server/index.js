const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//send static file directory at home path
app.use(express.static(path.join(__dirname, "public")));



app.listen(PORT, () => {
  console.log("LISTENING ON PORT", PORT);
});