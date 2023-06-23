const winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;
require("winston-mongodb");
const config = require("config");
require("dotenv");

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let logger;

const devLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.Console({ level: "debug" }),
        new transports.File({ filename: "log/error.log", level: "info" }),
        new transports.File({ filename: "log/combine.log", level: "info" }),
    ],
});

const prodLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({ filename: "log/error.log", level: "info" }),
        new transports.MongoDB({
            db: config.get("dbUri"),
            options: { useUnifiedTology: true },
        }),
    ],
});

// logger.exceptions.handle(
//     new transports.File({ filename: "log/exception.log" })
// );
// logger.rejections.handle(
//     new transports.File({ filename: "log/rejection.log" })
// );

// logger.exitOnError = false;

if (process.env.NODE_ENV == "development") {
    logger = devLog;
} else {
    logger = prodLog;
}

// const logger = createLogger({
//     format: combine(colorize(), timestamp()),
//     transports: [new transports.Console({ level: "debug" })],
// });

module.exports = logger;
