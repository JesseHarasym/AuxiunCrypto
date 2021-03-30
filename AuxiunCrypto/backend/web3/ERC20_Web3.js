const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const compiledContract = require("../../build/contracts/Coin.json");
const contract_address = "0xe34d47A4919A5f4196E7c2c7c72590cb4490B6b5"; //Change This!!!
const abi = compiledContract.abi;
const contractDetails = new web3.eth.Contract(abi, contract_address);

//Used to get the balance of a specific account.
const getBalance = async (address) => {
  try {
    return contractDetails.methods.getBalance(address).call();
  } catch (e) {
    return e.message;
  }
};

//Can be called to mint coins to a specific account.
//Example: If a user purchases Auxiun coin you would call this to add coins to their wallet.
const mint = async (receiver, amount) => {
  try {
    var account = await web3.eth.getAccounts(); //Sender will be account zero on the blockchain (Technically the creator).
    contractDetails.methods
      .mint(receiver, amount) //Calling the mint method from the smart contract.
      .send({ from: account[0] }); //Sending from account zero.
    return `Successfully minted ${amount} coins to ${receiver}`;
  } catch (e) {
    return e.message;
  }
};

//Used to transfer coins from one account to another. Sender/Receiver CANNOT be account zero.
//Example: If a user purchases a item from another user we can call this function to transfer the payment.
const transfer = async (sender, receiver, amount) => {
  try {
    var account = await web3.eth.getAccounts(); //Sender will be account zero on the blockchain (Technically the creator).
    contractDetails.methods
      .transferTokens(sender, receiver, amount)
      .send({ from: account[0] });
    return `${amount} coins transferred from ${sender} to ${receiver}`;
  } catch (e) {
    return e.message;
  }
};

exports.getBalance = getBalance;
exports.mint = mint;
exports.transfer = transfer;
