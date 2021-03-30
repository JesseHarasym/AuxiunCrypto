const GameAssets = artifacts.require("GameAssets");
const Coin = artifacts.require("Coin");
const MultiToken = artifacts.require("MultiToken");

module.exports = function(deployer) {
  deployer.deploy(GameAssets);
  deployer.deploy(Coin);
  deployer.deploy(MultiToken);
};