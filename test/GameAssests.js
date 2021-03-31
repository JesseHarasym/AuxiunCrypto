const GameAssests = artifacts.require('./GameAssests.sol')
const { assert } = require("chai");

require('chai').use(require('chai-as-promised')).should();


contract('GameAssests', (accounts) =>{
    let contract
    before(async () => {
        contract = await GameAssests.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async () =>{
            contract = await GameAssests.deployed()
            const address = contract.address
            console.log(address)
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

        })
        it('has a name', async () =>{
            const name = await contract.name();
            assert.equal(name, 'Item')
        })
        it('has a symbol', async () =>{
            const symbol = await contract.symbol();
            assert.equal(symbol, 'ITM')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () =>{
            const result = await contract.createItem('thisismyuri.json');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'From is correct')
            assert.equal(event.to, accounts[0], 'to is correct');
        })
    })

    describe('balance of', async () =>{
        it('checks owners balance', async () => {
            const result = await contract.getBalance('0x358a433024DaF8cCBAcC05De3BDC645Abff34A85');
            assert.equal(result, 1);
        })
    })


    describe('transfer item', async () =>{
        it('checks if item was transfered', async () => {
            const result = await contract.transferItem("0x358a433024DaF8cCBAcC05De3BDC645Abff34A85", "0x2438BB51B38A14011b8429D5D6F9204ABEbC264d", 1)
            const event = result.logs[1].args;
            const owner = await contract.ownerOfToken(1);
            console.log(owner);
            assert.equal(event.from, '0x358a433024DaF8cCBAcC05De3BDC645Abff34A85');
            assert.equal(event.to, '0x2438BB51B38A14011b8429D5D6F9204ABEbC264d');
            assert.equal(event.tokenId, 1);
            assert.equal(owner, "0x2438BB51B38A14011b8429D5D6F9204ABEbC264d");
        })
    })

    describe('check token uri', async () =>{
        it('get uri', async () => {
            const result = await contract.getTokenURI(1);
            console.log(result);
            assert.equal(result,'thisismyuri.json');
        })
    })
})

