const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const compiledContract = require("../../build/contracts/MultiToken.json");
const contract_address = "0x27F5429Ef5A29C1d7898Ee32Ec0f8f293758Bd53";
const abi = compiledContract.abi;
const contractDetails = new web3.eth.Contract(abi, contract_address);

/**
 *  SINGLE TOKENS
 * @params: address to send created token to, token id, token amount, token data
 */
const createToken = async (to, id, amount, data) => {
  try {
    return contractDetails.methods
      .createToken(to, id, amount, data)
      .send({ from: to, gas: 5000000 });
  } catch (e) {
    return e.message;
  }
};

// @params: owner address, token id
const getTokenBalance = async (owner, id) => {
  try {
    return contractDetails.methods.getTokenBalance(owner, id).call();
  } catch (e) {
    return e.message;
  }
};

// @params: address from, address to, token id, token amount, data
const safeTokenTransfer = async (from, to, id, amount, data) => {
  try {
    return contractDetails.methods
      .safeTokenTransfer(from, to, id, amount, data)
      .send({ from: from, gas: 5000000 });
  } catch (e) {
    return e.message;
  }
};

// BATCH TOKENS
// @params, to address, ids array, ammounts array, data
const createBatchTokens = async (to, ids, amounts, data) => {
  try {
    return contractDetails.methods
      .createToken(to, ids, amounts, data)
      .send({ from: to, gas: 5000000 });
  } catch (e) {
    return e.message;
  }
};

// params@ owner address, ids array
const getBatchBalance = async (owner, ids) => {
  try {
    return contractDetails.methods.getBatchBalance(owner, ids).call();
  } catch (e) {
    return e.message;
  }
};

//address from, address to, token ids, token amounts, data
const safeBatchTransfer = async (from, to, ids, amounts, data) => {
  try {
    return contractDetails.methods
      .safeTokenTransfer(from, to, ids, amounts, data)
      .send({ from: from, gas: 5000000 });
  } catch (e) {
    return e.message;
  }
};

exports.createToken = createToken;
exports.getTokenBalance = getTokenBalance;
exports.safeTokenTransfer = safeTokenTransfer;
exports.createBatchTokens = createBatchTokens;
exports.getBatchBalance = getBatchBalance;
exports.safeBatchTransfer = safeBatchTransfer;
