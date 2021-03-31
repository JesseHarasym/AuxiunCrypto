### Both Operating Systems

No matter which OS we use to connect the node, the minimum requirements will be the same for both. In the folder PrivateBlockchain of this repo contained a json file called 6565-genesis.json, and this is identical to the genesis block file that we have on our main node in the AWS instance. The genesis blocks must be identical for each peer in order to add to a network. 

After you have the genesis block file, you can install geth if you haven't already through npm install on the computer you plan on adding as a peer.


### Adding node on a new computer:

If you already have a genesis block initialized and network set up on the computer you're using, you can skip right to step 3 for your OS.

1. Initialize our genesis block for set up on our specified data directory

```
geth --identity “yourIdentity” --init /path_to_folder/6565-genesis.json --datadir /path_to_your_data_directory/YOUR_FOLDER
```

2. Let geth know the networkid for our private blockchain, so we can find the network.

```
geth --datadir /path_to_your_data_directory/Blockchain --networkid 6565
```

The network should now start for the first time in your terminal. You can now attach to this in another proccess by doing:

*Note: In windows you must open another command line and attach to write commands, in the AWS instance you can write commands on the same terminal as the host.*

3. In Windows:

```
geth attach ipc:\\.\pipe\geth.ipc
```

3. In Linux:

If you are using linux but not in the instance with our attach bash script you can use

```
geth attach ipc:$HOME/.ethereum/net6565/geth.ipc
```

Or while in the directory with our bash scripts in our AWS instance you can also 
type ``./6565-attach.sh``

4. Get the enode information of the node you want to connect to. If you aren't sure what the enode information is, you can check it by typing ``admin.nodeInfo``

On the instance of the blockchain you want to connect to. a file in JSON format will display and at the very top it will say "enode: "nodeData"".

The main blockchain enode information for main node is as follows:
```
"enode://c05610f3cfc102a020570fccb50260e117503d73899ccb85fa0dd92651939aaa861dd5687496967a30fdcede961c0a035fb80eff738828e5209dacb2999f02bb@52.14.197.214:30303"
```

You can connect to this node by using the command admin.addPeer(nodeData). For example, to connect to our main node on our AWS instance you can type `` admin.addPeer("enode://c05610f3cfc102a020570fccb50260e117503d73899ccb85fa0dd92651939aaa861dd5687496967a30fdcede961c0a035fb80eff738828e5209dacb2999f02bb@52.14.197.214:30303");``

If it returns true, then the command was ran successfully. This does happen asynchronously, so keep in mind that just because it returned true does not mean it is completely set up and connected yet.

To see if it works correctly, on the main node you just connected to you can type ``admin.peers``

If you have connected your node successfully, you will see the node you just connected, and possibly more even depending on whos currently connected with their nodes up and running.


