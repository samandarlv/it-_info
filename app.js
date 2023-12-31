const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const routes = require("./routes/index.routes");
const errorHandler = require("./middleware/error_handling_middleware");
const cookieParser = require("cookie-parser");
const logger = require("./services/logger");
const winston = require("winston");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const expressWinston = require("express-winston");
const {
    expressWinstonMiddleware,
    errorWinston,
} = require("./middleware/loggerMiddleware");

const exHbs = require("express-handlebars");

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
// console.log(config.get("access_key"));

// logger.log("info", "LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN");
// logger.info("INFO");
// console.trace("TRANCE");
// console.table(["Salim", "Karim", "Nodir"]);
// console.table([
//     ["Salim", 24],
//     ["Karim", 25],
//     ["Nodir", 26],
// ]);

const port = config.get("port");

const app = express();
app.use(express.json()); // Frontenddan kelayotgan so'rovlarni JSONga parse qoladi(taniydi)
app.use(cookieParser()); // Frontenddan kelayotgan so'rovlar ichidagi cookieni o'qiydi

const hbs = exHbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

app.engine("hbs", hbs.engine);

app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

// app.use(expressWinstonMiddleware);
app.use(routes);
// app.use(errorWinston);

// process.on("uncaughtException", (ex) => {
//     console.log("uncaughtException:", ex.message);
// });

// process.on("unhandledRejection", (rej) => {
//     console.log("unhandledRejection:", rej);
// });

// app.use(errorHandler);

async function start() {
    try {
        await mongoose.connect(config.get("dbUri"));
        app.listen(port, () => {
            console.log(`Server ${port}-portda ishga tushdi`);
        });
    } catch (error) {
        console.log("Serverda xatolik", error);
    }
}

start();
