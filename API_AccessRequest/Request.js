/* eslint-disable */
const Xdc3 = require("xdc3");
require("dotenv").config();
const h = require("@goplugin/plugin-test-helpers");

async function main() {

  const xdc3 = new Xdc3(
    new Xdc3.providers.HttpProvider("https://rpc.apothem.network")
  );
  const deployed_private_key = process.env.PRIVATE_KEY;
  const jobId = xdc3.utils.toHex(process.env.JOB_ID);
  const endpoint = "single_assets_daily";
  const symbol = "xdc-usd-p-d";

  //requestor ABI & Contract address to pass here
  const requestorABI = require("./ABI/RequestAbi.json");
  const requestorcontractAddr = process.env.REQUESTOR_CONTRACT;

  //Defining requestContract
  const requestContract = new xdc3.eth.Contract(requestorABI, requestorcontractAddr);

  const account = xdc3.eth.accounts.privateKeyToAccount(deployed_private_key);
  const nonce = await xdc3.eth.getTransactionCount(account.address);
  const gasPrice = await xdc3.eth.getGasPrice();

  const tx = {
    nonce: nonce,
    data: requestContract.methods.requestPrice(process.env.ORACLE_CONTRACT, jobId, endpoint, symbol).encodeABI(),
    gasPrice: gasPrice,
    to: process.env.REQUESTOR_CONTRACT,   // Requestor contract address
    from: account.address,
  };

  const gasLimit = await xdc3.eth.estimateGas(tx);
  tx["gasLimit"] = gasLimit;

  const signed = await xdc3.eth.accounts.signTransaction(
    tx,
    deployed_private_key
  );

  const txt = await xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("receipt", console.log);
  request = h.decodeRunRequest(txt.logs[3]);
  console.log("request has been sent. request id :=" + request.id, request.data.toString("utf-8"))
}

main().catch(e => console.error(e));
