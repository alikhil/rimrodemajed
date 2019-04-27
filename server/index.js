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
    console.log("kek")
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
    res.status(200);
});

app.get("/state", (req, res) => {
    const {flow} = req.query;

    if (!(flow in req.session.flows)) {
        res.send({ status: "NOT_STARTED" }).status(200);
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



// // Add elevator business hub router
// app.use(elevatorBH);

// app.post("/radio-bh", (req, res) => {

//     const {cmd, name} = req.query;
//     let _result, _state, _flow, _title;
//     let historyList = (req.session && req.session.workflow && req.session.workflow.history) || [];
//     if (cmd == 'START') {
//       _state = WF.flow[name].init;
//       _title = WF.flow[name].title;
//       _flow = name;
//       _history = {
//         id: "1",
//         state: _state,
//         flow: _flow,
//         title: _title,
//         status: "ACTIVE"
//       };
//       historyList.push(_history);
//     }

//     if (cmd == 'EVENT') {
//       _currentState = req.session.workflow.state;
//       _currentFlow = req.session.workflow.flow;
//       _state = WF.flow[_currentFlow].state[_currentState].events[name].newstate;
//       _title = WF.flow[_currentFlow].state[_currentState].events[name].title;
//       _flow = req.session.workflow.flow;

//       _history = {
//         id: (historyList.length + 1).toString(),
//         state: _state,
//         flow: _flow,
//         title: _title,
//         status: "ACTIVE"
//       };
//       historyList.push(_history);
//     }

//     if (cmd == 'ABORT') {
//       let _hist;
//       let _historyList = [];
//       for (let i = 0; i < historyList.length; i++) {
//         _historyList.push(historyList[i]);
//         if (historyList[i].id == name) {
//           _hist = historyList[i];
//           break;
//         }
//       }

//       _state = _hist.state
//       _flow = _hist.flow
//       historyList = _historyList;
//     }

//     if (cmd == 'EXIT') {
//       _state = '';
//       _flow = '';
//       historyList = [];
//     }

//     req.session.workflow = {
//       state: _state,
//       flow: _flow,
//       history: historyList
//     };
//     res.send({
//       result: 'SUCCESS',
//       state: _state,
//       flow: _flow,
//       history: historyList
//     });

//   }
// );

app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
