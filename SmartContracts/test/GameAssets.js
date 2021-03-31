const GameAssets = artifacts.require("GameAssets");
const truffleAssert = require("truffle-assertions");

contract("GameAssets", (accounts) => {
  it("should mint and send game asset", async () => {
    let ga = await GameAssets.deployed();
    await ga.mint(accounts[0], 1000);
    let result = await ga.send(accounts[1], 200);
    truffleAssert.eventEmitted(result, "Sent");
  });
});
