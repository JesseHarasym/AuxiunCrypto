const Coin = artifacts.require("Coin");
// const GameAssets = artifacts.require("GameAssets");
const MultiToken = artifacts.require("MultiToken");

module.exports = function (deployer) {
  deployer.deploy(Coin);
};

// module.exports = function (deployer) {
//   deployer.deploy(GameAssets);
// };

module.exports = function (deployer) {
  deployer.deploy(MultiToken);
};
