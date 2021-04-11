const router = require("express").Router();
const erc721 = require("../web3/ERC721_Web3");
const erc1155 = require("../web3/ERC1155_Web3");
let AssetsToken = require("../models/assetsTokenSchema.js");
let User = require("../models/userSchema");
const verify = require("./verify-token");

const ipfsClient = require("ipfs-http-client");
const {
    BorderTop
} = require("@material-ui/icons");
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
    const multi = req.body.multi;
    const file = req.files.file;

    //Grabbing the current logged in user.
    const user = await User.findById(req.user).catch((err) =>
        res.status(400).json("Error: " + err)
    );

    //Grabbing the current date.
    const listDate = new Date();

    //Grabbing the URI for the picture uploaded
    const fileAdded = await ipfs.add(file.data);

    //Creating a new item for the IPFS
    const newAsset = {
        name: body.name,
        description: body.description,
        game: body.game,
        image: fileAdded.cid.toString(),
    };

    //Getting the items IPFS address
    const newAssetCid = await addJson(newAsset);

    //Condition for if the item being create has multiple tokens or not.
    //If multi is true, create a batch using the erc1155.
    //Else create a single token using the erc721
    //Save the item to the database
    if (multi == "true") {

        //Grabbing the amount of tokens being created
        const tokenAmount = req.body.amount;

        //Creating a batch of the tokens, which will return the batch ID.
        const tokenId = await erc1155
            .createBatch(newAssetCid, user.blockchainAccount, tokenAmount)
            .then((result) => {
                return result;
            })
            .catch((err) => console.log(err));

        //Create a new item using the AssetToken Schema with the information given.
        const newItem = AssetsToken({
            token: tokenId,
            inmarketplace: true,
            price: body.price,
            listdate: listDate,
            batchtoken: true,
        });

        //Save the new item to the database
        newItem
            .save()
            .then((response) =>
                res.json({
                    success: true,
                    msg: "Successfully added " +
                        newAssetCid +
                        " to the blockchain and marketplace",
                    newAssetCid,
                })
            )
            .catch((err) => res.json({
                success: false,
                Error: err
            }));
    } else if (multi == "false") {

        //Create a single item, returns the tokenID
        const tokenId = await erc721
            .createItem(newAssetCid, user.blockchainAccount)
            .then((result) => {
                return result;
            })
            .catch((err) => console.log(err));

        //Create a new item using the AssetToken Schema with the information given.
        const newItem = AssetsToken({
            token: tokenId,
            inmarketplace: true,
            price: body.price,
            listdate: listDate,
            batchtoken: false,
        });

        //Save the new item to the database
        newItem
            .save()
            .then((response) =>
                res.json({
                    success: true,
                    msg: "Successfully added " +
                        newAssetCid +
                        " to the blockchain and marketplace",
                    newAssetCid,
                })
            )
            .catch((err) => res.json({
                success: false,
                Error: err
            }));
    }
});

// Verify all items owned by a user

router.route("/verify").get(verify, async (req, res) => {
    AssetsToken.find({
            owner: req.user
        })
        .then((foundUserAssets) => res.json(foundUserAssets))
        .catch(() =>
            res.json("Error could not find assets for userId: " + req.params.userId)
        );

    // Return all assets owned by the req.params.userID in the assetsToken database
});

module.exports = router;