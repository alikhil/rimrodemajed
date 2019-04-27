// @ts-check
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs')
const path = require('path')
var cors = require("cors")

const wfFileName = "workflow";

const loadJson = (filepath, encoding = 'utf8') => JSON.parse(fs.readFileSync(path.resolve(__dirname, `${filepath}.json`), {
    encoding
}))

const session = require("./session");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());
app.use(session);

app.get("/workflow", (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        console.log("flow name is not set");
        res.send({
            error: "name is not set",
        }).status(400);
    } else {
        const json = loadJson(wfFileName);
        let states = [];
        if (json.flow && name in json.flow) {
            states = json.flow[name].states;

        }
        res.send({ states });
    }

})

app.post("/state", (req, res) => {
    const {flow} = req.query; 
    const {event, fields, page} = req.body;

    if (!(flow in req.session.flows)) {
        req.session.flows[flow] = {};
    }

    switch (event) {
        case "UPDATE_FIELDS":
            console.log(`updating fields for flow ${flow}`);
            console.log(JSON.stringify(fields))
            req.session.flows[flow].fields = fields;
            break;
        case "CHANGE_PAGE":
            console.log(`updating current page for flow ${flow} to ${page}`);
            req.session.flows[flow].page = page;
            break;
        case "FINISH":
            console.log(`flow ${flow} is finished; clearing everything`);
            req.session.flows[flow] = {};
            break;
    }
    res.status(200).send({});
});

app.get("/state", (req, res) => {
    const {flow} = req.query;

    if (!(flow in req.session.flows)) {
        res.status(200).send({ status: "NOT_STARTED" });
        return;
    }

    const emptyFields = {
        name: "",
        lastname: "",
        phonePersonal: "",
        phoneHome: "",
        phoneWork: "",
        address: "",
        city: "",
    };

    res.send({ status: "ACTIVE", 
        fields: req.session.flows[flow].fields || emptyFields,
        page: req.session.flows[flow].page || 0,
    });

});

app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
