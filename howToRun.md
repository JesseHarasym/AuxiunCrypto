# How to get this app running:

### Step 1) install ipfs

Download and install IPFS by following the instructions at:  
 https://docs.ipfs.io/install/command-line/#official-distributions

- Initialize IPFS (if followed above instructions all IPFS related things should be preformed in Powershell)  
  -Open Powershell and run: ipfs init
- You should get a peer id and a suggested command similar to: ipfs cat /ipfs/<HASH>/readme
- run the suggested command and you should see a welcome message
- Turn on the IPFS daemon by running:

  > ipfs daemon

  (I would suggest running this in Visual Studio Code's terminal as you can have your multiple terminals running side by side by pressing the split terminal button or Ctrl + Shift + 5)

### Step 2) install geth

Download and install Geth from https://geth.ethereum.org/downloads/

- Ensure that geth installed properly by running:
  > geth version

### Step 3) create a mongoDb

Create a mongoDb atlas database with one collection called “users”  
https://www.mongodb.com/

Get the connection string to your new mongoDb (use the Connect guide from mongoDb)

### Step 4) clone the repo

> git clone https://github.com/JesseHarasym/AuxiunCrypto.git

### Step 5) add your connection string

open the .env file in /backend and replace the example mongoDb connection string with your own

### Step 6) install npm dependencies

open a new powershell (best to split a new terminal in VSC) and cd to cloned repo directory. run:

> npm install

### Step 7) get the blockchain setup:

- on the first install you’ll need to setup the keystore and create the blockchain files. This step is only necessary when running for the first time on a new backend client, or anytime the database connection string changes.
- delete the test_chain folder in /private_blockchain/local_chain if it exists
- Open the terminal and navigate to the root folder if not already in it. Run:
  > geth --rpc --rpcport "8545" --datadir private_blockchain/local_chain/test_chain init private_blockchain/local_chain/genesis.json
- copy the UTC—2021-03-27T… file in /private_blockchain/local_chain/keystoreBackup to the newly created /private_blockchain/local_chain/test_chain/keystore folder

### Step 8) run the blockchain:

With the blockchain setup, lets get it started:

- run:
  > geth --rpc --rpcport "8545" --rpcapi="eth,miner,net,txpool,web3,personal" --datadir private_blockchain/local_chain/test_chain --networkid 2523659 --allow-insecure-unlock
- split open a new powershell then run:
  > geth attach \\.\pipe\geth.ipc
- then run:

  > personal.unlockAccount("0xfe005d002767a320c45f4d2387bdfa1e5134646e","summer2", 0)

  (if it looks like nothing copied, try pressing right arrow on your keyboard...)
  You should receive "true" if everything worked

- start mining by running:

  > miner.start()

  You should receive "null"
  After 10-15 secs you should see in the other powershell window "mined potential block" messages appearing

### Step 9) migrate the contracts

This is only necessary if you needed to setup a new blockchain in step 7

- open a new powershell and navigate to the root AuxiunCrypto folder
- install truffle by running:

  > npm install truffle -g

- then run:

  > truffle migrate

  After 15-30 secs you should see a summary from truffle similar to: Total deployments: 4; Final cost: 0.14661736 ETH

### Step 10) start the frontend

- split open another powershell instance... make sure you're at the AuxiunCrypto root folder then
- run:

  > npm start

  after 10-30s a browser should popup with the front-end

### Step 11) start the backend

- open a new powershell and navigate to the root AuxiunCrypto folder, then cd to backend folder then run:

> node server.js

## Step 12) Have fun with the app!
