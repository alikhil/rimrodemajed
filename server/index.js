// @ts-check
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const flowName = "registration";

const workflow = require("very-simple-workflow");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());

app.use("/state", workflow({
    encoding: "utf8",
    filename: path.resolve(__dirname, "workflow.json"),
    flowName,
    emptyFields: {
        name: "",
        lastname: "",
        phonePersonal: "",
        phoneHome: "",
        phoneWork: "",
        address: "",
        city: "",
    },
}));

app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
