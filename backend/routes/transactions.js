const router = require("express").Router();
const erc20 = require("../web3/ERC20_Web3");
const erc721 = require("../web3/ERC721_Web3");
const erc1155 = require("../web3/ERC1155_Web3");
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
  await User.findById(req.user)
    .then(async (user) => {
      //Update the user coin balance on the blockchain by minting more coins to their account.
      await erc20
        .mint(user.blockchainAccount, req.body.coinAmount)
        .then((result) => {
          console.log(result);
        })
        .catch((err) =>
          res.status(500).json({
            success: false,
            msg: `ERC20 error: ${err}`
          })
        );

      //Update the user's coin balance in th DB.
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
        .catch((err) =>
          res.status(500).json({
            success: false,
            msg: `Db error: ${err}`
          })
        );
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        msg: `Db error: ${err}`
      })
    );
});

// Buy asset with Auxiun coin
// First verify auth-token
// find balance of user with req.user returned from auth-token verify
// find asset from assetsToken and confirm it is listed on marketplace
// check price of asset to balance of user, catch error: insufficient funds
// reduce user balance and save, unlist asset from marketplace and save
// return asset hash and new balance of user.
router.route("/asset").post(verify, async (req, res) => {
  const tokenId = req.body.tokenId; //Grabbing the token ID of the item being bought.

  //Grabbing the current logged in user.
  const user = await User.findById(req.user).catch((err) =>
    res.status(500).json({
      success: false,
      msg: `Db error: ${err}`
    })
  );

  //Grab the item from the database based on the tokenId.
  const asset = await AssetsToken.findOne({ token: tokenId }).catch((err) =>
    res.status(500).json({
      success: false,
      msg: `Db error: ${err}`
    })
  );

  console.log(asset);

  //If in marketplace is false the item cannot be sold.
  //Else go ahead with the sale.
  if (!asset.inmarketplace)
    res.status(200).json({
      success: false,
      msg: `Asset not listed in marketplace and cannot be sold.`
    });
  else {
    //Check to make sure the user has enough coins to buy the item.
    if (asset.price > user.coinbalance)
      res.status(200).json({
        success: false,
        msg: `User has insufficient coins.`
      });
    else {
      //If the token is a batch creation we call the erc1155 transfer function.
      //Else the erc721 transfer function.
      if (asset.batchtoken === true) {
        //If the batch balance is greater than zero go ahead with the purchase
        if ((await erc1155.getBatchBalance(asset.token)) > 0) {
          //Grabbing the owner of the batch.
          owner = await erc1155
            .getOwnerOfBatch(asset.token)
            .then((result) => {
              return result.toLowerCase();
            })
            .catch((err) =>
              res.status(500).json({
                success: false,
                msg: `ERC1155 error: ${err}`
              })
            );

          //Transferring one token from the batch to the user's account.
          await erc1155
            .transfer(user.blockchainAccount, asset.token, 1)
            .catch((err) =>
              res.status(500).json({
                success: false,
                msg: `ERC1155 error: ${err}`
              })
            );
        } else {
          res.json({
            success: false,
            msg: `Sold out of tokens.`
          });
        }
      } else {
        //Grabbing the owner of the token.
        owner = await erc721
          .ownerOfToken(asset.token)
          .then((result) => result.toLowerCase())
          .catch((err) =>
            res.status(500).json({
              success: false,
              msg: `ERC721 error: ${err}`
            })
          );

        //Transferring the token.
        await erc721
          .transferItem(user.blockchainAccount, asset.token)
          .catch((err) =>
            res.status(500).json({
              success: false,
              msg: `ERC721 error: ${err}`
            })
          );
      }

      //Transferring coins from the customer to the dev.
      //Updates the blockchain erc20 balances.
      await erc20
        .transfer(user.blockchainAccount, owner, asset.price)
        .catch((err) =>
          res.status(500).json({
            success: false,
            msg: `ERC20 error: ${err}`
          })
        );

      let updatedCoinBalance;

      //Update the coin balance of the customer in the database.
      await User.findById(req.user)
        .then((user) => {
          user.coinbalance -= asset.price;
          updatedCoinBalance = user.coinbalance;
          user.save().catch((err) =>
            res.status(500).json({
              success: false,
              msg: `Db error: ${err}`
            })
          );
        })
        .catch((err) =>
          res.status(500).json({
            success: false,
            msg: `Db error: ${err}`
          })
        );

      //Update the coin balance of the developer/owner in the database.
      await User.findOne({
        blockchainAccount: owner
      })
        .then((user) => {
          user.coinbalance += asset.price;
          user.save().catch((err) =>
            res.status(500).json({
              success: false,
              msg: `Db error: ${err}`
            })
          );
        })
        .catch((err) =>
          res.status(500).json({
            success: false,
            msg: `Db error: ${err}`
          })
        );

      let balanceOfBatch;

      //Grabbing the balance of the batch.
      if (asset.batchtoken) {
        balanceOfBatch = await erc1155
          .getBatchBalance(tokenId)
          .then((result) => result)
          .catch((err) =>
            res.status(500).json({
              success: false,
              msg: `ERC1155 error: ${err}`
            })
          );
      }
      //Find the token in the database and update is in marketplace.
      await AssetsToken.findOne({ token: tokenId }).then((asset) => {
        //If the item is a batch token and the balance is zero, set in marketplace to false.
        if (asset.batchtoken && balanceOfBatch == 0) {
          asset.inmarketplace = false;
          asset.save().then(() => {
            //send successful response back
            res.json({
              success: true,
              msg: `Successfully purchased asset#${asset.token} for ${asset.price} coin`,
              newBalance: updatedCoinBalance
            });
          });
        }
        //Else if the item is not a batch item, set in marketplace to false.
        else if (!asset.batchtoken) {
          asset.inmarketplace = false;
          asset.save().then(() => {
            //send successful response back
            res.json({
              success: true,
              msg: `Successfully purchased asset#${asset.token} for ${asset.price} coin`,
              newBalance: updatedCoinBalance
            });
          });
        }
        //Else do not update the database and just send a response.
        else {
          res.json({
            success: true,
            msg: `Successfully purchased ${asset.token} for ${asset.price}`,
            newBalance: updatedCoinBalance
          });
        }
      });
    }
  }
});

module.exports = router;
