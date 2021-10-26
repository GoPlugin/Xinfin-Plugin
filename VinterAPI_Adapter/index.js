const { Requester, Validator } = require('@goplugin/external-adapter')
require("dotenv").config();

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const customParams = {
  symbol: ['symbol'],
  endpoint:['endpoint']
}

const createRequest = (input, callback) => {
  const validator = new Validator(input, customParams)
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint 
  const url      = `https://www.vinterapi.com/api/v2/${endpoint}`
  const symbol   = validator.validated.data.symbol 

  const params = {
    symbol
  }

  const config = {
    url,
    params
  }

  if (process.env.API_KEY) {
    config.headers = {
      Authorization: process.env.API_KEY
    }
  }

  Requester.request(config, customError)
    .then(response => {
      var resultData = response.data.data[0].value;
      response.data.result =resultData;
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

module.exports.createRequest = createRequest