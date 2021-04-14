const erc20 = require("../web3/ERC20_Web3");
const erc721 = require("../web3/ERC721_Web3");
const erc1155 = require("../web3/ERC1155_Web3");
let User = require("../models/userSchema");
let AssetsToken = require("../models/assetsTokenSchema");
const router = require("express").Router();

router.route("/getowner").get((req, res) => {
  let id = req.body.id;
  let isBatch = req.body.isBatch;
  if (isBatch === true) {
    erc1155
      .getOwnerOfBatch(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    erc721
      .ownerOfToken(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});



router.route("/geturi").get((req, res) => {
  let id = req.body.id;
  let isBatch = req.body.isBatch;
  if (isBatch === true) {
    erc1155
      .getTokenURI(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    erc721
      .getTokenURI(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

router.route("/balance").get((req, res) => {
  let account = req.body.account;
  let batchId = req.body.batchId;
  let isBatch = req.body.isBatch;

  if (isBatch === true) {
    erc1155
      .getBalance(batchId, account)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    erc20
      .getBalance(account)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

router.route("/balanceofbatch").get((req, res) => {
  let id = req.body.id;

    erc1155
      .getBatchBalance(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/purchase").post(async (req, res) => {
  const tokenId = req.body.tokenId;
  const isBatch = req.body.isBatch;
  const userId = req.body.userId;
  let owner;
  //// possibly drop this database call and get user blockchain account id from JWT
  //Check database for user
  const user = await User.findById(userId).catch((err) =>
    res.status(400).json("Error: " + err)
  );
  console.log(user.blockchainAccount);
  console.log(user.coinbalance);
  //asset info from db is Price, and if listed in marketplace
  //Check database for asset
  const asset = await AssetsToken.findOne({
    token: tokenId,
    batchtoken: isBatch,
  }).catch((err) => res.status(400).json("Error: " + err));
  console.log(asset.price);
  console.log(asset.token);

  if (!asset.inmarketplace)
    res.status(400).send("Asset is not available in the marketplace");
  else {
    //check price of asset to balance of user
    if (asset.price > user.coinbalance)
      res.status(400).send("Insufficient Funds");
    else {
      //TODO Figure out a way to differentiate if the token was made using erc721 or erc1155
      if (asset.batchtoken === true) {
        owner = await erc1155
          .getOwnerOfBatch(asset.token)
          .then((result) => {
            return result.toLowerCase();
          })
          .catch((err) => res.status(400).json("Error: " + err));

        await erc1155
          .transfer(user.blockchainAccount, asset.token, 1)
          .catch((err) => res.status(400).json("Error: " + err));
      } else {
        //Grabbing the current owner of the token before the transfer occurs.
        owner = await erc721
          .ownerOfToken(asset.token)
          .then((result) => {
            return result.toLowerCase();
          })
          .catch((err) => res.status(400).json("Error: " + err));

        //preform web3 transfer
        await erc721
          .transferItem(user.blockchainAccount, asset.token)
          .catch((err) => res.status(400).json("Error: " + err));
      }

      //update owner's coinBalance
      await erc20
        .transfer(user.blockchainAccount, owner, asset.price)
        .catch((err) => res.status(400).json("Error: " + err));

      let updatedCoinBalance;
      //complete transaction in respective databases
      await User.findById(userId)
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

      const balanceOfBatch = await erc1155
        .getBatchBalance(tokenId)
        .then((result) => {
          return result;
        })
        .catch((err) => res.status(400).json("Error: " + err));

      // set inmarketplace to false in db
      await AssetsToken.findOne({ token: tokenId, batchtoken: isBatch }).then(
        (asset) => {
          if (isBatch === true && balanceOfBatch == 0) {
            asset.inmarketplace = false;
            asset.save().then((res) => {
              //send successful response back
              res.json({
                success: true,
                msg: `Successfully purchased ${asset.token} for ${asset.price}`,
                newBalance: updatedCoinBalance,
              });
            });
          } else if (isBatch === false) {
            asset.inmarketplace = false;
            asset.save().then((res) => {
              //send successful response back
              res.json({
                success: true,
                msg: `Successfully purchased ${asset.token} for ${asset.price}`,
                newBalance: updatedCoinBalance,
              });
            });
          }
          else{
            res.json({
              success: true,
              msg: `Successfully purchased ${asset.token} for ${asset.price}`,
              newBalance: updatedCoinBalance,
            });
          }
        }
      );
    }
  }
});

router.route("/create").post(async (req, res) => {
  const isBatch = req.body.isBatch;
  const userId = req.body.userId;
  const amount = req.body.amount;
  const price = req.body.price;

  const user = await User.findById(userId).catch((err) =>
    res.status(400).json("Error: " + err)
  );

  //const details = { name: req.body.itemName, description: req.body.itemDescription };
  //const assetHash = "QmSQwrhrhJKLUWo2oEBkhtdNN9k6S7o5eAyQNFWAb62QZK";
  const listDate = new Date();

  // * For erc1155-token check body.erc1155 and body.numTokens
  if (isBatch === true) {
    const tokenId = await erc1155
      .createBatch("exampleURI", user.blockchainAccount, amount)
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
    console.log(tokenId);
    const newItem = AssetsToken({
      token: tokenId,
      inmarketplace: true,
      price: price,
      listdate: listDate,
      batchtoken: true,
    });

    //save the newAsset to assetsToken database
    newItem
      .save()
      .then((response) =>
        res.json({
          success: true,
          msg: "Successfully added to the blockchain and marketplace",
        })
      )
      .catch((err) => res.json({ success: false, Error: err }));
  } else {
    //TODO create web3 token using the newAssetCid
    const tokenId = await erc721
      .createItem("exampleURI", user.blockchainAccount)
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
    console.log(tokenId);
    const newItem = AssetsToken({
      token: tokenId,
      inmarketplace: true,
      price: price,
      listdate: listDate,
      batchtoken: false,
    });

    //save the newAsset to assetsToken database
    newItem
      .save()
      .then((response) =>
        res.json({
          success: true,
          msg: "Successfully added to the blockchain and marketplace",
        })
      )
      .catch((err) => res.json({ success: false, Error: err }));
  }

  //res.json({ msg: "Added new asset!", cid: newAssetCid });
  // Inform if the item was successfully added to the blockchain and DB
});

router.route("/transfer").post((req, res) => {
  let to = req.body.to;
  let batchId = req.body.batchid;
  let amount = req.body.amount;
  erc1155
    .transfer(to, batchId, amount)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/buycoins").post((req, res) => {
  let to = req.body.to;
  let amount = req.body.amount;
  erc20
    .mint(to, amount)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).json("Error: " + err));
});



module.exports = router;





// /*
// *   Get owner of batch or erc721 token. 
// *@param id   ---> ID of batch or single token
// *@param isBatch   ---> Boolean, true if token is a batch, else false.
// */
// const getOwner = async (id, isBatch) => {
//   if (isBatch === true) {
//       return erc1155.getOwnerOfBatch(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));

//   } else {
//       return erc721.ownerOfToken(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//   }
// }


// /*
// *   Get URI of batch or erc721 token. 
// *@param id   ---> ID of batch or single token
// *@param isBatch   ---> Boolean, true if token is a batch, else false.
// */
// const getUri = (id, isBatch) => {
//   if (isBatch === true) {
//       return erc1155.getTokenURI(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));

//   } else {
//       return erc721.getTokenURI(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//   }
// }


// /*
// *   Get account balance of erc20 coins or erc1155 tokens in a specific batch.  
// *@param account   ---> Blockchain account of a specific user. 
// *@param id   ---> ID of batch.
// *@param isBatch   ---> Boolean, true if token is a batch, else false.
// */
// const getBalance = (account, id, isBatch) => {
//   if (isBatch === true) {
//       return erc1155.getBalance(id, account).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));

//   } else {
//       return erc20.getBalance(account).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//   }
// }



// /*
// *   Get account balance of entire batch.
// *@param id   ---> ID of batch.
// */
// const getBalanceOfBatch = (id) => {
//   return erc1155.getBatchBalance(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
// }



// /*
// *   Get account balance of entire batch.
// *@param id   ---> ID of batch.
// */
// const purchase = async (id, isBatch, account, price) => {
//   let owner;
//   let balance;

//   if (isBatch === true) {
//       try {
//           owner = await getOwner(id, isBatch).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//           await erc1155.transfer(account, id, 1).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//           balance = await erc1155.getBatchBalance(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//       } catch (err) {
//           return err;
//       }
//   } else {
//       try{
//           owner = await erc721.ownerOfToken(id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//           await erc721.transferItem(account, id).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//       }catch(err){
//           return err;
//       }
//   }

//   try{
//       await erc20.transfer(account, owner, price).then((result) => {return result}).catch((err) => res.status(400).json("Error: " + err));
//   }catch(err){
//       return err;
//   }

//   return{
//       owner: owner,
//       balance: balance
//   };

// }