const Web3 = require("web3"); //Requiring web3.
const web3 = new Web3("http://localhost:8545"); //Setting the connection either to the currentProvider or Ganache.
const compiledContract = require("../../build/contracts/GameAssets.json");
const contract_address = "0x3dED44B62Cbc24534d3e2F2A778dC91c01a0bF07"; //This will be address of the contract on the blockchain. Specific to your local block chain change for testing.
const abi = compiledContract.abi; //Gets the abi of our compiled contract.
const contractDetails = new web3.eth.Contract(abi, contract_address); //Allows to access the contracts details (Methods, events, constants, etc.)

//Function sends information to createItem method in GameAssets contract. Accepts a uri and the specific blockchain address of creator.
//Returns the token id that smart contract assigned the token.
const createItem = async (uri, from) => {
  try {
    let account = await web3.eth.getAccounts(); //Sender will be account zero on the blockchain (Technically the creator).
    return contractDetails.methods
      .createItem(uri, from)
      .send({ from: account[0], gas: 5000000 })
      .then((receipt) => {
        let tokenId = receipt.events.Minted.returnValues.tokenId;
        return tokenId;
      });
  } catch (e) {
    return e.message;
  }
};

// Function sends information to transferItem method in GameAssets contract. Accepts two specific block chain addresses, one for receiver and one for the sender and the tokenId for the specific item being transfered.
const transferItem = async (to, tokenId) => {
  try {
    let account = await web3.eth.getAccounts(); //Sender will be account zero on the blockchain (Technically the creator).
    let from = await ownerOfToken(tokenId);
    contractDetails.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ from: account[0], gas: 5000000 });
    return "Item transferred to successfully";
  } catch (e) {
    return e.message;
  }
};

//Function sends information to ownerOfToken method in GameAssets contract. Accepts a tokenId for the specific item being searched and returns with the blockchain address of owner.
const ownerOfToken = async (tokenId) => {
  try {
    return contractDetails.methods.ownerOfToken(tokenId).call();
  } catch (e) {
    return e.message;
  }
};

//Return the specific tokenURI based on the token id.
const getTokenURI = async (tokenId) => {
  try {
    return contractDetails.methods.getTokenURI(tokenId).call();
  } catch (e) {
    return e.message;
  }
};

exports.ownerOfToken = ownerOfToken;
exports.createItem = createItem;
exports.transferItem = transferItem;
exports.getTokenURI = getTokenURI;
