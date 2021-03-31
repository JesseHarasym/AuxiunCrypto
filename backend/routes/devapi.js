const router = require("express").Router();
const erc721 = require("../web3/ERC721_Web3");
let AssetsToken = require("../models/assetsTokenSchema.js");
//let Marketplace = require("../models/marketplaceSchema.js");
let User = require("../models/userSchema");
const verify = require("./verify-token");

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("http://localhost:5001");

// Dev adds a new item on the marketplace
const addJson = async (data) => {
  const jsonAdded = await ipfs.add(JSON.stringify(data));
  return jsonAdded.cid.toString();
};

// const catJson = async (cid) => {
//   let stringified = "";
//   for await (const chunk of ipfs.cat(cid)) {
//     stringified += chunk.toString();
//   }
//   return JSON.parse(stringified);
// };

router.route("/new").post(verify, async (req, res) => {
  const body = req.body;
  const file = req.files.file;

  const user = await User.findById(req.user);

  //const details = { name: req.body.itemName, description: req.body.itemDescription };
  //const assetHash = "QmSQwrhrhJKLUWo2oEBkhtdNN9k6S7o5eAyQNFWAb62QZK";
  const listDate = new Date();

  // * For multi-token check body.multi and body.numTokens

  //console.log(body);

  const fileAdded = await ipfs.add(file.data);
  //console.log(fileAdded);

  const newAsset = {
    name: body.name,
    description: body.description,
    game: body.game,
    image: fileAdded.cid.toString()
  };

  const newAssetCid = await addJson(newAsset);
  //replace this with call to DB/Web3 create a token
  //tempAssets.push(newAssetCid);
  console.log(newAssetCid);

  //TODO create web3 token using the newAssetCid
  const tokenId = await erc721
    .createItem(newAssetCid, user.blockchainAccount)
    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  console.log(tokenId);
  const newItem = AssetsToken({
    token: tokenId,
    inmarketplace: true,
    price: body.price,
    listdate: listDate
  });

  //save the newAsset to assetsToken database
  newItem
    .save()
    .then((response) =>
      res.json({
        success: true,
        msg:
          "Successfully added " +
          newAssetCid +
          " to the blockchain and marketplace",
        newAssetCid
      })
    )
    .catch((err) => res.json({ success: false, Error: err }));

  //res.json({ msg: "Added new asset!", cid: newAssetCid });
  // Inform if the item was successfully added to the blockchain and DB
});

// Verify all items owned by a user

router.route("/verify").get(verify, async (req, res) => {
  AssetsToken.find({ owner: req.user })
    .then((foundUserAssets) => res.json(foundUserAssets))
    .catch(() =>
      res.json("Error could not find assets for userId: " + req.params.userId)
    );

  // Return all assets owned by the req.params.userID in the assetsToken database
});

module.exports = router;
