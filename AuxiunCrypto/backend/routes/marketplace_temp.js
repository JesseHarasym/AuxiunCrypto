const router = require("./users");

// Users lists an asset on the marketplace

router.route("/list/:assetId").post(verify, async (req, res) => {
  //find req.params.assetId in asstesTokenSchema
  //confirm that req.body.userId matches the owner Id of the asset
  //if confirmed, change inmarketplace to true

  const itemPrice = req.body.itemPrice;

  // grab listdate and put it in a variable

  // const newAsset = Marketplace({
  //     tokenid: req.params.assetId,
  //     price: itemPrice,
  //     listdate,
  // });

  // save the newAsset to the marketplace database
  // and return the response as mentioned in Brad's API doc.
});

// Get information on all available items from the marketplace

router.route("/assets").get(verify, async (req, res) => {
  // Return all assets on the marketplace
});
