### Getting onto our AWS Instance:

You must create an AWS account and ask me (Jesse) for an invite to our instance.

1. Log into AWS console manager
2. Click instances, choose 'i-072e4a7ce58824199' and hit connect.
3. For your username, the default ubuntu works fine, and connect again.

The instance should now load, and you will see our ubunutu terminal. If you aren't familiar with the linux terminal, I would suggest going through the basics before going any further. Remember to be careful, mistakes can sometimes be a lot harder to fix on a terminal.

### Getting familiar with file structure

I will mention some of the basic commands incase you don't know them. To follow along, this must be done from our user directory (this is where you should be when the instance first opens) It will look something like ``ubuntu@ip-172-31-33-46: ~$ ``.

If for whatever reason you need help getting back to this directory, you can get back from anywhere in the file structure by typing ``cd ~``.

In order to see the files/directories that are available from your current directory you can type``ls``.

You should see 'auxiun-blockchain' which holds all the data for our private blockchain. Next to change into this directory you should type ``cd auxiun-blockchain``.

You are now in the main file structure for the blockchain for files that are not autogenereted by geth, to check them out once again type ``ls``

You will see a lot files starting with our network id (6565), please note that anything showing as green is an executable bash script. If you don't know what this is, I will explain how to use briefly later on.

In order to see the contents of any of these files, you can type 'cat filename', for example typing  ``cat 6565-genesis.json`` will show you our genesis block for our main node. This can also be done with any of the bash scripts if you're curious what's inside them. 

### Bashscript overview

Any of these scripts can be executed by typing './file_name.sh', for example to run the create account script you can type ``./6565-create-account.sh``.

Below are a brief overview of each bash script. If you take a look at them, they're all pretty self explanitory if you know the basic geth commands.

- 6565-create-account.sh 
```
This can be ran and you will be prompted for a password. After entering your password, you will be provided with a public address key and a secret key file. As it states in the terminal, this information is very important to keep track of. You only need this script to create an account if you're not connected to the blockchain.
```

- 6565-attach.sh 
```
This is used to attach to our blockchain. This is not to start our blockchain, but to attach to the network if it is already running. This is what you would use to attach to a second e2 instance to your running blockchain. If you wanted to connect to our main blockchain from somewhere other then a copy of our instance, then you will have to reference 'blockchain-adding-node.md' for further info.
```

- 6565-start-alone.sh 
```
This allows you to start our blockchain, and is used when you need to access the blockchain while not allowing outside access from users. When it opens through this script, you are the only person allowed on the network.
```

- 6565-start-peers.sh 
```
This allows you to start our blockchain, and is used as the go to way to start our blockchain when we want to use it normally as expected.
```

### Starting our blockchain

After running either of our starting scripts, there will be a lot of information on the terminal as it begins to start our network. After it has welcomed you to the console, and starts looking for peers, you are now able to send commands to the network.

### Some basic commands after connecting to blockchain

- eth.accounts
```
Displays all account hashes made on our network
```

- eth.getBalance(accountInfo) 
```
Displays the balance of the account provided. accountInfo can be provided as eth.accounts[0] to get the balance of the first account on the network, or an account hash such as "0x9e74029ffa172a445557b32987701bdc0bf1ac1d" could also be provided to specify an account.
```

- eth.sendTransaction({from:acc1, to:acc2, value: web3.toWei(quantity, "type")})
```
You must fill the blanks which in this case are acc1, acc2, quantity and "type". 
For example they could be replaced with:

acc1: eth.accounts[0]
acc2: eth.accounts[1]
quantity: 1
type: "ether"

Please note that type must be in quotation marks as shown, and that ether will eventually be changed with our coin.
```

- net.peerCount
```
Shows the number of nodes that are attached to our main node. For testing purposes I have added peers to test it and make sure it works, but it may not be connected while you're doing this.
```

- admin.peers
```
This will list any peers connected to our main node. If you would like to add a peer and test this, you can check out blockchain-adding-node.md for more information.
```

- eth.coinbase
```
This will display what our blockchain considers our default or primary account. Because there are just so many accounts that can be created and accessed for testing and other purposes, geth takes the first account in our keystore and sets it as our primary.
```

- miner.start()
```
You can start mining at any time with this command while connected to the blockchain. Keep in mind that the free AWS instance is not powerful enough to mine, and although it will work sometimes it tends to cause strange issues. Mining is better left to connected nodes hosted on better hardware. This takes an optional parameter for the number of miner threads.
```

There are a ton more commands, I will add others I find useful over time, but it is easily searchable if you'd like to dig deeper.


### Editing files with vim

If you ever need to edit any files on our ubuntu instance, the easiest way is through a text editor called vim. I'll do a very quick overview of basic editing.

Type vim followed by the file name you want to edit. You must be in the same directory as the file you're trying to access. For example if I wanted to edit our genesis block I could type ``vim 6565-genesis.json``

Our file contents will load and we're ready to get started. In order to start editing our file, we must hit the insert key for edit mode and you can edit the file as needed. When you're done hit esc to leave edit mode.

To leave vim and save your work after editing and hitting esc you must type ``:wq``.

To leave vim and discard your changes, so that they aren't saved you must type ``:q!``.

### Creating files or scripts

It's pretty straightforward to create a file, simple type the touch followed by the name and extension. If there is no extension provided, it will create a directory. For example ``touch 6565-my-script.sh`` would create you a script file that can then be added to through vim or through the echo command.

If this is a regular file or directory then this is enough, but if it's meant to be a script then we must let linux know its executable by typing ``chmod a+x ./6565-my-script.sh``.

This file can now be run as a script. It is good practice to make the first line of your scripts #!/bin/bash as you may have saw in the other scripts. This is just to indicate that it should be ran by bash rather then shell if both options are available to the os. This is not a requirement but rather a suggestion.

If you wanted to delete this file, you can easily do that by typing ``rm 6565-my-script.sh``.

### Quick look at our hidden file structure

So I started by covering the file structure that ive created on our instance and how to use it, but geth also creates hidden files for us to hold various bits of information. We can see these hidden files by going back to our main directory and then typing an ls command with an -a flag to see hidden files and directories. This can be done by typing ``cd ~`` and then ``ls -a``.

You will see a variety of files and directories listed that you don't see with the normal ls command. I am going to give you a quick overview of an important one which is .ethereum. You may have noticed that when you created an account, it told you the directory in which your private key was stored, which is this directory. 

We will be going into ``/.ethereum/net6565/keystore``. You can traverse through these directories and take a look at their contents if you'd like, but to make it faster you just type ``cd .ethereum/net6565/keystore``

You are now in the main directory that holds all of our private account keys we talked about earlier. You can type ``ls``

If you wanted to see the files, and you can always use cat or vim if you wanted to see what the contents of these files are. it is very important to remember this is our only proof of these accounts, and without these files here they don't exist as far as our blockchain is concerned.

There is lots more to explore in here, this structure also holds our geth.ipc which we use to attach to a blockchain instance, and many other things.