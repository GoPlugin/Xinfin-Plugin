const adaptor = require('./index');

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = process.env.EA_PORT || 5000;

app.use(bodyParser.json());

app.post('/', function (req, res) {
    console.log("request value is",req)
    adaptor.handler(req, res)
});


app.listen(port, () => console.log(`Listening on port ${port}!`));