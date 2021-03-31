//#region Here we are declaring our variables.
var web3 = new Web3(
  new Web3.providers.HttpProvider("http://18.191.229.39:8545")
);
// const Web3 = require("web3"); //Requiring web3.
const ganacheNetwork = "http://localhost:8545"; //This is our connection for ganache (Allows for easy testing)
var web3 = new Web3(Web3.currentProvider || ganacheNetwork); //Setting the connection either to the currentProvider or Ganache.

const compiledContract = require("../build/contracts/Coin.json"); //Grabbing the json version of our contract.
const contract_address = "0xed6d121b337ec94ae89d90994c2fc023fc15490a"; //This will be address of the contract on the blockchain (Specific to my Ganache project. Needs to change after deploying to another blockchain.)
const abi = compiledContract.abi; //Gets the abi of our compiled contract.
var contractDetails = new web3.eth.Contract(abi, contract_address); //Allows to call and send the method in our contract.
//#endregion

//
const getAccountZero = async () => {
  let accounts = await web3.eth.getAccounts();
  return accounts[0];
};

const getName = () => {
  contractDetails.methods.getName().call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Name: " + res);
      return res;
    }
  });
};

const getSymbol = () => {
  contractDetails.methods.getSymbol().call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Symbol: " + res);
      return res;
    }
  });
};

const getDecimals = () => {
  contractDetails.methods.getDecimals().call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Decimals: " + res);
      return res;
    }
  });
};

const getBalance = (address) => {
  contractDetails.methods.getBalance(address).call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Balance: " + res);
      return res;
    }
  });
};

const getTotalSupply = () => {
  contractDetails.methods.getTotalSupply().call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Total Supply: " + res);
      return res;
    }
  });
};

const mint = async (receiver, amount) => {
  contractDetails.methods
    .mint(receiver, amount)
    .send({ from: await getAccountZero() })
    .then((err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("mint " + res);
        return res;
      }
    });
};

const send = (receiver, amount) => {
  contractDetails.methods.send(receiver, amount).call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Success: " + res);
      return res;
    }
  });
};

//getName();
//getSymbol();
//getDecimals();
//getBalance("0x358a433024DaF8cCBAcC05De3BDC645Abff34A85");
//getTotalSupply();

//mint('0x358a433024DaF8cCBAcC05De3BDC645Abff34A85', 200);

//send('0x2438BB51B38A14011b8429D5D6F9204ABEbC264d', 2);
exports.getName = getName;
exports.getSymbol = getSymbol;
exports.getDecimals = getDecimals;
exports.getBalance = getBalance;
exports.getTotalSupply = getTotalSupply;
exports.mint = mint;
exports.send = send;
