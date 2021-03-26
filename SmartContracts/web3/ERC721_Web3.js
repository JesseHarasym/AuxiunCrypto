//#region Here we are declaring our variables.
const Web3 = require("web3"); //Requiring web3.
const ganacheNetwork = "http://localhost:8545"; //This is our connection for ganache (Allows for easy testing)
var web3 = new Web3(Web3.currentProvider || ganacheNetwork); //Setting the connection either to the currentProvider or Ganache.

const compiledContract = require("../build/contracts/GameAssets.json"); //Grabbing the json version of our contract.
const contract_address = "0x38fFD5e4e1A5c3f9445D659EeC70722057a36d4f"; //This will be address of the contract on the blockchain (Changes based on the blockchain where the contracts are deployed).
const abi = compiledContract.abi; //Gets the abi of our compiled contract.
var contractDetails = new web3.eth.Contract(abi, contract_address); //Allows to interact with the methods in our contract.
//#endregion

const createItem = (uri, creator) => {
  contractDetails.methods
    .createItem(uri)
    .send({ from: creator, gas: 257477 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Item Created: " + res);
        return res;
      }
    });
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

const getTokenURI = (tokenId) => {
  contractDetails.methods.getTokenURI(tokenId).call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Token URI: " + res);
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

const transferItem = (from, to, tokenId) => {
  contractDetails.methods
    .transferItem(from, to, tokenId)
    .send({ from: from, gas: 139731 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Item Transfered: " + res);
        return res;
      }
    });
};

const ownerOfToken = (tokenId) => {
  contractDetails.methods
    .ownerOfToken(tokenId)
    .call()
    .then((err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Token belongs to " + res);
        return res;
      }
    });
};

//getName();
//getSymbol();
//createItem('https://game.example/api/item/125263.json', '0xbC496eF36Fc7DB8b8D74Fc85De13Db840E480eaC')
//getTokenURI(2);
//ownerOfToken(1);
//transferItem('0xbC496eF36Fc7DB8b8D74Fc85De13Db840E480eaC', '0xE6873e9e2989c75CC3AA21ce25c901dE9AF9E356', 1)
exports.getName = getName;
exports.getSymbol = getSymbol;
exports.getTokenURI = getTokenURI;
exports.getBalance = getBalance;
exports.ownerOfToken = ownerOfToken;
exports.transferItem = transferItem;
exports.createItem = createItem;
