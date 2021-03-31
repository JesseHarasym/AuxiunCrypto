const Coin = artifacts.require("Coin");
const truffleAssert = require("truffle-assertions");

contract("Coin", (accounts) => {
  it("should mint and send coins", async () => {
    let c = await Coin.deployed();
    await c.mint(accounts[0], 2);
    let result = await c.send(accounts[1], 1);
    truffleAssert.eventEmitted(result, "Sent");
  });
});