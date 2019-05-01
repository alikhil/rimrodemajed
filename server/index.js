// @ts-check
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const flowName = "registration";

const session = require("./session");

const workflow = require("very-simple-workflow");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());
app.use(session);
app.use(workflow({
    encoding: "utf8",
    filename: path.resolve(__dirname, "workflow.json"),
}));

app.post("/state", (req, res) => {
    const {id} = req.query;
    const {event, fields, page} = req.body;

    if (!(id in req.session.ids)) {
        req.session.ids[id] = {};
    }

    switch (event) {
        case "UPDATE_FIELDS":
            console.log(`updating fields for session ${id}`);
            console.log(JSON.stringify(fields));
            req.session.ids[id].fields = fields;
            break;
        case "CHANGE_PAGE":
            console.log(`updating current page for id ${id} to ${page}`);
            req.session.ids[id].page = page;
            if (page === req.getStates(flowName).length) {
                console.log(`session with id ${id} is finished; clearing everything`);
                req.session.ids[id] = {};
                res.status(200).send({status: "FINISHED"});
                return;
            }
            break;
    }
    res.status(200).send({ status: "CONTINUE" });
});

app.get("/state", (req, res) => {
    const {id} = req.query;

    if (!(id in req.session.ids)) {
        req.session.ids[id] = {};
    }

    let status = "ACTIVE";
    if (!(id in req.session.ids)) {
        status = "NOT_STARTED";
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

    let states = req.getStates(flowName);

    res.send({
        fields: req.session.ids[id].fields || emptyFields,
        page: req.session.ids[id].page || 0,
        states,
        status,
    });

});

app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
