const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const compiledContract = require("../../build/contracts/MultiToken.json");
const contract_address = "0x98114018cafc6599DEcEfc72fa2Bee05a0d0Cb1C";
const abi = compiledContract.abi;
const contractDetails = new web3.eth.Contract(abi, contract_address);

//address from, address to, token ids, token amounts, data
const createBatch = async (uri, creator, amount) => {
  try {
    var account = await web3.eth.getAccounts();
    return contractDetails.methods
      .createBatch(uri, creator, amount)
      .send({ from: account[0], gas: 5000000 })
      .then((receipt) => {
        let batchId = receipt.events.Minted.returnValues.batchId;
        return batchId;
      });
  } catch (e) {
    return e.message;
  }
};

const transfer = async (to, batchId, amount) => {
  try {
    var account = await web3.eth.getAccounts();
    let from = await getOwnerOfBatch(batchId);
    return contractDetails.methods
      .transfer(from, to, batchId, amount)
      .send({ from: account[0], gas: 5000000 })
      .then((receipt) => {
        let tokenId = receipt.events.Transferred.returnValues.tokenId;
        return tokenId;
      });
  } catch (e) {
    return e.message;
  }
};

const getOwnerOfBatch = async (batchId) => {
  try {
    return contractDetails.methods.ownerOfBatch(batchId).call();
  } catch (e) {
    return e.message;
  }
};

const getOwnerOfToken = async (batchId, tokenId) => {
  try {
    return contractDetails.methods.ownerOfToken(batchId, tokenId).call();
  } catch (e) {
    return e.message;
  }
};

const getTokenURI = async (batchId) => {
  try {
    return contractDetails.methods.getURI(batchId).call();
  } catch (e) {
    return e.message;
  }
};

const getBatchBalance = async (batchId) => {
  try {
    return contractDetails.methods.getBatchBalance(batchId).call();
  } catch (e) {
    return e.message;
  }
};

const getBalance = async (batchId, account) => {
  try {
    return contractDetails.methods.getBalance(batchId, account).call();
  } catch (e) {
    return e.message;
  }
};
exports.getBatchBalance = getBatchBalance;
exports.createBatch = createBatch;
exports.transfer = transfer;
exports.getOwnerOfBatch = getOwnerOfBatch;
exports.getTokenURI = getTokenURI;
exports.getOwnerOfToken = getOwnerOfToken;
exports.getBalance = getBalance;
