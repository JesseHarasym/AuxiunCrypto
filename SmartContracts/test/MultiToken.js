const MultiToken = artifacts.require("MultiToken");
const truffleAssert = require("truffle-assertions");

contract("MultiToken", (accounts) => {
  it("should mint and send multi tokens", async () => {
    let t = await MultiToken.deployed();
    await t.mint(accounts[0], 2);
    let result = await t.send(accounts[1], 1);
    truffleAssert.eventEmitted(result, "Sent");
  });
});
