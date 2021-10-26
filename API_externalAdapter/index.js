const { Requester, Validator } = require('@goplugin/external-adapter')

const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
}

const createRequest = (input, callback) => {
    const jobRunID = input.id;
    console.log("Testinginititit",input)
    // https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD
    const params = {
        fsym: "ETH",
        tsyms: "USD",
    }
    const config = {
        url: "https://min-api.cryptocompare.com/data/price",
        params
    }
    Requester.request(config, customError)
        .then(response => {
            const res = {
                data: {
                        // symbol: "ETH-USD",
                        "USD": response.data.USD.toString()
                        // timestamp: Date.now()
                    }
                
            }
            callback(response.status, {jobRunID, ...res});
        })
        .catch(error => {
            callback(500, Requester.errored(jobRunID, error))
        })
}

module.exports.createRequest = createRequest