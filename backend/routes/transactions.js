const router = require("express").Router();
const erc20 = require("../web3/ERC20_Web3");
const erc721 = require("../web3/ERC721_Web3");
const verify = require("./verify-token");
const User = require("../models/userSchema");
const AssetsToken = require("../models/assetsTokenSchema");

// Transaction via fiat currency
// Verify the token in middleware
// then grab the balance for the user, add the req.body.coinAmount
// and save the updated balance to the database
router.route("/coin/").post(verify, async (req, res) => {
  //Check database for _id
  //_id is contained in req.user which was passed from the token verification
  const user = await User.findById(req.user)
    .then(async (user) => {
      console.log(user);
      console.log(req.body.coinAmount);

      //TODO mint new coins to blockchain
      await erc20
        .mint(user.blockchainAccount, req.body.coinAmount)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => res.status(400).json("Error: " + err));

      //update coinAmount in db
      user.coinbalance += req.body.coinAmount;
      user
        .save()
        .then(() =>
          res.json({
            success: true,
            msg: `Successfully purchased ${req.body.coinAmount} Auxiun coin.`,
            newBalance: user.coinbalance
          })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Buy asset with Auxiun coin
// First verify auth-token
// find balance of user with req.user returned from auth-token verify
// find asset from assetsToken and confirm it is listed on marketplace
// check price of asset to balance of user, catch error: insufficient funds
// reduce user balance and save, unlist asset from marketplace and save
// return asset hash and new balance of user.
router.route("/asset").post(verify, async (req, res) => {
  const tokenId = req.body.tokenId;
  //// possibly drop this database call and get user blockchain account id from JWT
  //Check database for user
  const user = await User.findById(req.user).catch((err) =>
    res.status(400).json("Error: " + err)
  );

  //asset info from db is Price, and if listed in marketplace
  //Check database for asset
  const asset = await AssetsToken.findOne({ token: tokenId }).catch((err) =>
    res.status(400).json("Error: " + err)
  );

  if (!asset.inmarketplace)
    res.status(400).send("Asset is not available in the marketplace");
  else {
    //check price of asset to balance of user
    if (asset.price > user.coinbalance)
      res.status(400).send("Insufficient Funds");
    else {
      //TODO Figure out a way to differentiate if the token was made using erc721 or erc1155

      //Grabbing the current owner of the token before the transfer occurs.
      const owner = await erc721
        .ownerOfToken(asset.token)
        .then((result) => {
          return result.toLowerCase();
        })
        .catch((err) => res.status(400).json("Error: " + err));

      //preform web3 transfer
      await erc721
        .transferItem(user.blockchainAccount, asset.token)
        .catch((err) => res.status(400).json("Error: " + err));

      //update owner's coinBalance
      await erc20
        .transfer(user.blockchainAccount, owner, asset.price)
        .catch((err) => res.status(400).json("Error: " + err));

      let updatedCoinBalance;
      //complete transaction in respective databases
      await User.findById(req.user)
        .then((user) => {
          user.coinbalance -= asset.price;
          updatedCoinBalance = user.coinbalance;
          user.save().catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));

      //Updating owners balance in the db
      await User.findOne({ blockchainAccount: owner })
        .then((user) => {
          user.coinbalance += asset.price;

          user.save().catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));

      // set inmarketplace to false in db
      await AssetsToken.findOne({ token: tokenId }).then((asset) => {
        asset.inmarketplace = false;
        asset
          .save()
          .then((res) => {
            //send successful response back
            res.json({
              success: true,
              msg: `Successfully purchased ${asset.token} for ${asset.price}`,
              newBalance: updatedCoinBalance
            });
          })
          .catch((err) => res.status(400).json("Error: " + err));
      });
    }
  }
});
module.exports = router;
