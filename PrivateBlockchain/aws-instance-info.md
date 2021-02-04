### Our AWS connection information

Our Aws Instance Information:
```
Public IP: 52.14.197.214
Port: 8545
```

Our private blockchains network id: 6565

There are several ports open on our instance for a variety of factors including connecting to the main Ethereum network. Howevever port 8545 is what we will use to connect to our blockchain from outside of our instance.

### Connection examples

#### Metamask

For example, if you wanted to connect our blockchain to MetaMask, then you would use our aws info and network id in order to do this. For example:

```
RPC URL: http://52.14.197.214:8545
Chain ID: 6565
```

#### Truffle

If we wanted to attach this private blockchain to truffle where we handle all of our smart contracts, we could do that by changing the truffle-config.js file under demployment to:

```
development: {
    host: "52.14.197.214", 
    port: 8545, 
    network_id: "6565", 
}
```

### Conclusion

This is just to demonstrate a couple of the many ways you can connect the blockchain to outside sources. If you just need to connect to the instance already running then this is all you should need, but if you want to physical access to our AWS instance then checkout blockchain-getting-started.md for more info.