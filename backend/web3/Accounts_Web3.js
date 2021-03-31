const Web3 = require("web3");
var web3 = new Web3("http://localhost:8545");

const createAccount = async (password) => {
    try{
        let account = await web3.eth.accounts.create()
        let pk = account.privateKey.substring(2);
        return await web3.eth.personal.importRawKey(pk, password)
        
    }
    catch(e){
        return e.message;
    }
  };

  const getAccount = async (keystore ,password) => {
    try{
        account = await web3.eth.accounts.decrypt(keystore, password);
        return account;
    }
    catch(e){
        return e.message;
    }
  };

  /*
   This can be removed once we start using the aws blockchain.
   We can just unlock the account when starting up the node on aws. 
  */
  const unlockAccount = async () => {
    try{

        web3.eth.personal.unlockAccount("0x1982841a0e03707e3a0432672a3fe0ba25fc63c7", "summer2", 600)
        .then(console.log('Account unlocked!'));
    }
    catch(e){
        return e.message;
    }
  };


exports.createAccount = createAccount;
exports.getAccount = getAccount;
exports.unlockAccount = unlockAccount;