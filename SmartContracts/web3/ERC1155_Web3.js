var web3 = new Web3(
  new Web3.providers.HttpProvider("http://18.191.229.39:8545")
);
const ganacheNetwork = "http://localhost:8545";
var web3 = new Web3(Web3.currentProvider || ganacheNetwork);

const compiledContract = require("../build/contracts/MultiToken.json");
const contract_address = "0x1819Ece303e29824A28848a7cA093408aBF3a2e3";
const abi = compiledContract.abi;
var contractDetails = new web3.eth.Contract(abi, contract_address);

// SINGLE TOKENS
// @params: address to send created token to, token id, token amount, token data
const createToken = (to, id, amount, data) => {
  contractDetails.methods
    .createToken(to, id, amount, data)
    .send({ from: creator, gas: 5000000 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Token Created: " + res);
        return res;
      }
    });
};

// @params: owner address, token id
const getTokenBalance = (owner, id) => {
  contractDetails.methods.getTokenBalance(owner, id).call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Token Balance: " + res);
      return res;
    }
  });
};

// @params: address from, address to, token id, token amount, data
const safeTokenTransfer = (from, to, id, amount, data) => {
  contractDetails.methods
    .safeTokenTransfer(from, to, id, amount, data)
    .send({ from: from, gas: 5000000 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Token Transfered: " + res);
        return res;
      }
    });
};

// BATCH TOKENS
// @params, to address, ids array, ammounts array, data
const createBatchTokens = (to, ids, amounts, data) => {
  contractDetails.methods
    .createToken(to, ids, amounts, data)
    .send({ from: creator, gas: 5000000 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Tokens Created: " + res);
        return res;
      }
    });
};

// params@ owner address, ids array
const getBatchBalance = (owner, ids) => {
  contractDetails.methods.getTokenBalance(owner, ids).call((err, res) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Tokens Balances: " + res);
      return res;
    }
  });
};

//address from, address to, token ids, token ammounts, data
const safeBatchTransfer = (from, to, ids, amounts, data) => {
  contractDetails.methods
    .safeTokenTransfer(from, to, ids, amounts, data)
    .send({ from: from, gas: 5000000 }, (err, res) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Token Transfered: " + res);
        return res;
      }
    });
};

//export all our functions
exports.createToken = createToken;
exports.getTokenBalance = getTokenBalance;
exports.safeTokenTransfer = safeTokenTransfer;
exports.createBatchTokens = createBatchTokens;
exports.getBatchBalance = getBatchBalance;
exports.safeBatchTransfer = safeBatchTransfer;

// NEED:

// single:
// createToken(to, id, amount, data)
// getTokenBalance(owner, id)
// safeTokenTransfer(from, to, id, amount, data)

// batch:
// createBatchTokens(to, ids[], ammounts[], data)
// getBatchBalance(owners[], ids[]])
// safeBatchTransfer(from, to, ids[], ammounts[], data)
