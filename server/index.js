const express = require("express");
const app = express();
const fs = require('fs')
const path = require('path')


const session = require("./session");

app.use(session);


app.get("/api/setUsername", (req, res) => {
  req.session.message = 'Hello World';

  return res.send({username: 123456, userDefaultTown: 898})
});

app.get("/api/getUsername", (req, res) => {
    console.log('req.session.message', req.session.message);
    const a = req.session.message;
    return res.send({username: a, userDefaultTown: 898})

  }
);

// app.get("/getCurrentState", (req, res) =>
//   res.send({
//     sucsessful: true, body: {
//       result: 'SUCCESS',
//       state: '',
//       flow: 'radioFlow'
//     }
//   })
// );
// const WF = loadJson('./workflow');

app.use((req, res, next) => {console.log(req.session.id); next();});

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
