const router = require("./users");

// Dev adds a new item on the marketplace

router.route("/new").post(verify, async (req, res) => {
  const itemPrice = req.body.itemPrice;
  const details = {
    name: req.body.itemName,
    description: req.body.itemDescription
  };

  // const newItem = Devs({
  //     price: itemPrice,
  //     details,
  //     inmarketplace: true,
  // });

  //save the newAsset to assetsToken database and return the new _id
  //place the _id in a variable

  //save the new _id, price, and listdate to marketplace database

  // Inform if the item was successfully added to the blockchain and DB
});

// Verify all items owned by a user

router.route("/verify/:userId").post(verify, async (req, res) => {
  // Return all assets owned by the req.params.userID in the assetsToken database
});
