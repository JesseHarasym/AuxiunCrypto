const router = require("express").Router();
const erc721 = require("../web3/ERC721_Web3");
const erc1155 = require("../web3/ERC1155_Web3");
const AssetsToken = require("../models/assetsTokenSchema.js");
const verify = require("./verify-token");
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("http://localhost:5001");

/**
 * A helper function that retrieves a json file from the IPFS
 *
 * @param {String} cid - the file's content id
 * @returns a stringified JSON object wrapped in a response message
 */
const catJson = async (cid) => {
  let stringified = "";
  for await (const chunk of ipfs.cat(cid)) {
    stringified += chunk.toString();
  }
  return JSON.parse(stringified);
};

/**
 * Route: /api/marketplace/asset/list
 * Lists a user's asset on the marketplace
 */
router.route("/asset/list").post(verify, async (req, res) => {
  const assetId = req.body.tokenId;
  const itemPrice = req.body.itemPrice;
  //Get current date for list date
  const listDate = new Date();
  // console.log("List: AssetId-", assetId);
  // console.log("List: ItemPrice-", itemPrice);
  //Find asset in assetTokenSchema through passed asset Id
  const asset = await AssetsToken.findOne({ token: assetId })
    .exec()
    .then(async (foundAsset) => {
      //Then compare the ownerId in found asset with the userId passed in request
      //If successful set inmarketplace to true
      if (foundAsset.owner == req.body.userId) {
        foundAsset.inmarketplace = true;
        if (itemPrice) foundAsset.price = itemPrice;
        //save foundAsset in asset database
        foundAsset.save();
        res.json({
          success: true,
          msg: "Successfully listed" + assetId
        });
      }
      //else throw error because userId does not match ownerId
      else {
        res.json({
          success: false,
          msg: "User does not own asset:" + assetId
        });
      }
    })
    //If assetId could not be found throw error message assetId could not be found
    .catch(() =>
      res.json({ success: false, msg: "assetId could not be found" })
    );
});

/**
 * Route: /api/marketplace/assets
 * Gets all listed assets and returns them an an array of objects.
 *   Expected object being returned:
 *
 *  {
 *    name: "String",
 *    description: "String",
 *    game: "String",
 *    image: "String - ipfs content id for image asset",
 *    tokenId: Number
 *    price: Number
 *    batchBalance: Number if batch token, otherwise undefined
 *  }
 */
router.route("/assets").get((req, res) => {
  // Return all assets listed in the marketplace
  let uri;
  let batchBalance = null;

  AssetsToken.find({ inmarketplace: true })
    .then(async (assets) => {
      //console.log(assets);
      const cidList = [];
      if (assets.length > 0) {
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].batchtoken) {
            uri = await erc1155
              .getTokenURI(assets[i].token)
              .then((result) => result)
              .catch((err) => console.log(err));
            batchBalance = await erc1155
              .getBatchBalance(assets[i].token)
              .then((result) => result)
              .catch((err) => console.log(err));
          } else {
            uri = await erc721
              .getTokenURI(assets[i].token)
              .then((result) => {
                return result;
              })
              .catch((err) => console.log(err));
            //console.log(uri);
          }
          const tokenObject = await catJson(uri);
          tokenObject.tokenId = assets[i].token;
          tokenObject.price = assets[i].price;
          if (batchBalance) tokenObject.batchBalance = batchBalance;
          cidList.push(tokenObject);
          batchBalance = null;
        }
      }
      res.json(cidList);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
