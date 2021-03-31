const erc20 = require("../web3/ERC20_Web3");
const erc721 = require("../web3/ERC721_Web3");
let User = require("../models/userSchema");
let AssetsToken = require("../models/assetsTokenSchema");
const router = require("express").Router();

router.route("/getowner").get((req, res) => {
  let id = req.body.id;
  erc721
    .ownerOfToken(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/geturi").get((req, res) => {
  let id = req.body.id;
  erc721
    .getTokenURI(id)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/balance").get((req, res) => {
  let account = req.body.account;
  erc20
    .getBalance(account)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/purchase").post(async (req, res) => {
  const tokenId = req.body.tokenId; //ID of the token you want the user to purchase
  const userId = req.body.userId; //DB ID of the user that is buying the token

  //TODO possibly drop this database call and get user blockchain account id from JWT
  //Check database for user
  const user = await User.findById(userId).catch((err) =>
    res.status(400).json("Error: " + err)
  );
  console.log(user.blockchainAccount);
  console.log(user.coinbalance);

  //asset info from db is Price, and if listed in marketplace
  //Check database for asset
  const asset = await AssetsToken.findOne({ token: tokenId }).catch((err) =>
    res.status(400).json("Error: " + err)
  );

  console.log(asset.price);
  console.log(asset.token);
  if (!asset.inmarketplace)
    res.status(400).send("Asset is not available in the marketplace");

  //check price of asset to balance of user
  if (asset.price > user.coinbalance)
    res.status(400).send("Insufficient Funds");

  //TODO Figure out a way differentiates if the token was made the erc721 or erc1155

  //Grabbing the current owner of the token before the transfer occurs.
  const owner = await erc721
    .ownerOfToken(asset.token)
    .then((result) => {
      return result.toLowerCase();
    })
    .catch((err) => res.status(400).json("Error: " + err));
  console.log(owner);

  //TODO preform web3 transfer
  await erc721
    .transferItem(user.blockchainAccount, asset.token)
    .catch((err) => res.status(400).json("Error: " + err));

  //TODO update owner's coinBalance
  await erc20
    .transfer(user.blockchainAccount, owner, asset.price)
    .catch((err) => res.status(400).json("Error: " + err));

  //complete transaction in respective databases
  await User.findById(userId)
    .then((user) => {
      user.coinbalance -= asset.price;

      user.save().catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));

  //Updating owners balance in the db
  await User.findOne({ blockchainAccount: owner })
    .then((user) => {
      console.log(user.blockchainAccount);
      console.log(user.coinbalance);
      user.coinbalance += asset.price;

      user.save().catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));

  //
  // remove from marketplace database too
  //

  await AssetsToken.findOne({ token: tokenId }).then((asset) => {
    asset.inmarketplace = false;

    asset
      .save()
      .then((res) =>
        res.send(`Successfully purchased ${asset.token} for ${asset.price}`)
      )
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
