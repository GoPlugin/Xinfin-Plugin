let request = require('request');

let handle = (data, callback) => {
    let url = "https://min-api.cryptocompare.com/data/";
    url = url + data.endpoint;
    let requestObj;

    switch (data.endpoint) {
        case "price":
            requestObj = {
                fsym: data.fsym,
                tsyms: data.tsyms
            };
            break;
        case "pricemulti":
        case "pricemultifull":
            requestObj = {
                fsyms: data.fsyms,
                tsyms: data.tsyms
            };
            break;
        case "generateAvg":
            requestObj = {
                fsym: data.fsym,
                tsym: data.tsym,
                e: data.exchange
            };
            break;
        default:
            requestObj = {
                fsym: data.fsym,
                tsyms: data.tsyms
            };
            break;
    }

    let options = {
        url: url,
        qs: requestObj,
        json: true
    };

    request(options, (error, response, body) => {
        if (error || response.statusCode >= 400) {
            callback(response.statusCode, {
                jobRunID: data.id,
                status: "errored",
                error: error
            });
        } else {
            let resp = body;
            console.log("resp value is",resp)
            if (data.endpoint === "price")
                resp.result = resp[data.tsyms].toString();
                resp.USD    = resp[data.tsyms].toString();

            callback(response.statusCode, {
                jobRunID: data.id,
                data: body
            });
        }
    });
};

exports.handler = (req, res) => {
    console.log("event vlue is",req.body.id)
    let data = {
        id: req.body.id,
        endpoint: req.body.data.endpoint || "price",
        fsyms: req.body.data.fsyms || "ETH",
        fsym: req.body.data.coin || req.body.data.fsym || "ETH",
        tsyms: req.body.data.market || req.body.data.tsyms || "USD",
        tsym: req.body.data.tsym || "USD",
        exchange: req.body.data.exchange || "USD"
    };

    handle(data, (statusCode, responseData) => {
        obj = {"jobRunID":responseData.jobRunID,
               "data":{
                   "USD":responseData.data.USD.toString(),
                   "result":responseData.data.result.toString()
               },
               "result":responseData.data.result.toString(),
               "statusCode":statusCode
            };
        console.log("Obj value is",obj)
        res.status(statusCode).send(obj);
    });
};

exports.gcpservice = (req, res) => {
    let data = {
        id: req.body.id,
        endpoint: req.body.data.endpoint || "price",
        fsyms: req.body.data.fsyms || "",
        fsym: req.body.data.coin || req.body.data.fsym || "",
        tsyms: req.body.data.market || req.body.data.tsyms || "",
        tsym: req.body.data.tsym || "",
        exchange: req.body.data.exchange || ""
    };

    handle(data, (statusCode, responseData) => {
        res.status(statusCode).send(responseData);
    });
};