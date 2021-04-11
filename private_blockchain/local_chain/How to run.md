You will need to install geth to work with the blockchain:
https://geth.ethereum.org/downloads/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Creating the blockchain(Unless we delete the test_chain folder, we will not need to run this. You can skip to just running the chain.):

Step 1: Open the terminal and navigate to the root folder if not already in it.

Step 2: Run this command 
geth --rpc --rpcport "8545" --datadir private_blockchain/local_chain/test_chain init private_blockchain/local_chain/genesis.json

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Running the private blockchain: 

Step 1:Open the terminal and navigate to the root folder if not already in it.

Step 2: Run this command 
geth --rpc --rpcport "8545"  --rpcapi="eth,miner,net,txpool,web3,personal"  --datadir private_blockchain/local_chain/test_chain --networkid 2523659 --allow-insecure-unlock

Step 3: Open a new terminal and type 
geth attach \\.\pipe\geth.ipc

Step 4: Unlock account zero by running 
personal.unlockAccount("0xfe005d002767a320c45f4d2387bdfa1e5134646e","summer2", 0)

Step 5: Start mining by running 
miner.start()

We don’t need to deploy and record the addresses of the contracts, unless we have remade our blockchain.
