const Xdc3 = require("xdc3");
const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(`../API_AccessRequest/ABI/RequestAbi.json`);

const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider("https://rpc.apothem.network")
);

// const restuldata = decoder.decodeData("0x000000000000000000000000045687b5eda47d9c38d2ce79d35f3179b43f2f37589f22d1bd866cc4db8d6bf373a3fb8cddc85fc4b940da31adad677a3ed3cdaa0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000045687b5eda47d9c38d2ce79d35f3179b43f2f378d2a648d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060e0068e00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000004468656e64706f696e747373696e676c655f6173736574735f6461696c796673796d626f6c6b7864632d7573642d702d64647061746866726573756c746574696d65731864")
// console.log("restuldata",restuldata)

async function inputDecoder(txHash) {
  const tx = await xdc3.eth.getTransaction(txHash, (error, txResult) => {
    const result = decoder.decodeData(txResult.input);
    console.log(result);
  });
  // const input = xdc3.utils.toAscii(tx.input)
  // console.log(input)
}

inputDecoder("0xafe02e1f7a1b3978317cbb2743ce343aa05773e1313e66629902eab700c22e71")
