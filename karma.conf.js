const process = require("process");
const puppeteer = require("puppeteer");

module.exports = function (config) {
    process.env.CHROME_BIN = puppeteer.executablePath();
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            ".bin/tests.js",
        ],
        exclude: [],
        colors: true,
        logLevel: config.LOG_INFO,
        reporters: ["mocha"],
        autoWatch: false,
        port: 9876,
        browsers: ["ChromeHeadlessNoSandbox"],
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 1000,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: "ChromeHeadless",
                flags: ["--no-sandbox", "--disable-setuid-sandbox", '--disable-translate', '--disable-extensions', '--remote-debugging-port=9876']
            }
        },
        singleRun: true
    });
};
