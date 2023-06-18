import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
import fetch from "node-fetch";

const corsUrl = (() => {
    if (process.env.NODE_ENV === "production") {
        return process.env.CORS_URL;
    } else {
        return process.env.CORS_URL_DEV;
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//send static file directory at home path
app.use(express.static(path.resolve("public")));
app.use(
    cors({
        origin: new RegExp(corsUrl),
    })
);

//conversion rate api call
// app.get("/rates", (req, res) => {
//   console.log("got request from client", req.query);
// });
app.get("/rates", async (req, res) => {
    if (!req.query || !req.query.base || !req.query.code) {
        return res.status(422).json({ error: "Unprocessable Entity" });
    }
    try {
        if (!process.env.API_KEY) throw new Error("can't request exchangerate api");
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${req.query.base}`
        );
        const data = await response.json();
        //send back the conversion rate from the base to the requested currency code of the country in question
        if (data) return res.status(200).json({ data: data.conversion_rates[req.query.code] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
});

app.listen(PORT, () => {
    console.log("\x1b[44m", `LISTENING ON PORT ${PORT}`, "\x1b[00m");
});
