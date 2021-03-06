const router = require("express").Router();
const account = require("../web3/Accounts_Web3");
let User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const verify = require("./verify-token");
const erc721 = require("../web3/ERC721_Web3");
const erc1155 = require("../web3/ERC1155_Web3");
const AssetsToken = require("../models/assetsTokenSchema");
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
 * Route: /api/user/new
 * Register a new user
 */
router.route("/new").post(async (req, res) => {
  //console.log(req.body);
  //VALIDATE THE REGISTERED INFO
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(6).required(),
    firstname: Joi.string().min(1).required(),
    lastname: Joi.string().min(1).required(),
    dev: Joi.boolean().required(),
    companyname: Joi.string().allow("")
  });
  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  //Check database for unique username
  const usernameExist = await User.findOne({
    username: req.body.username
  });
  if (usernameExist) return res.status(400).send("Username already exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create the user object to be saved to the database
  const username = req.body.username;
  const password = hashPassword;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const developer = req.body.dev;
  const companyname = req.body.companyname;

  const blockchainAccount = await account
    .createAccount(password)
    .then((result) => {
      return result;
    })
    .catch((err) => res.status(400).json("Error: " + err));

  let user = User({
    username,
    password,
    firstname,
    lastname,
    developer,
    companyname,
    coinbalance: 0,
    blockchainAccount
  });

  user
    .save()
    .then(async () => {
      const userID = await User.findOne({ username });
      //create and assign a web token
      const token = jwt.sign(
        { _id: userID._id, pk: blockchainAccount },
        process.env.TOKEN_SECRET
      );
      newUser = {
        user,
        success: true,
        authKey: token
      };
      res.header("auth-token", token).send(newUser);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

/**
 * Route: /api/user/login
 * Logs in a user
 */
router.route("/login").post(async (req, res) => {
  //VALIDATE THE REGISTERED INFO
  console.log("request", req.body);
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(6).required()
  });
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //Check database for login username
  const user = await User.findOne({
    username: req.body.username
  });
  if (!user) return res.status(400).send("Username does not exist");
  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //create and assign a web token
  const token = jwt.sign(
    { _id: user._id, pk: user.blockchainAccount },
    process.env.TOKEN_SECRET
  );
  const newUser = {
    user,
    authKey: token,
    success: true
  };
  res.header("auth-token", token).send(newUser);
});

/**
 * Route: /api/user/assets
 * Gets all assets belonging to the currently logged in user
 */
router.route("/assets").get(verify, async (req, res) => {
  //console.log("User pk: ", req.user.pk);

  AssetsToken.find()
    .then(async (assets) => {
      const cidList = [];
      if (assets.length > 0) {
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].batchtoken) {
            const balance = await erc1155.getBalance(
              assets[i].token,
              req.user.pk
            );
            //console.log(balance);
            if (balance > 0) {
              const uri = await erc1155
                .getTokenURI(assets[i].token)
                .then((result) => result)
                .catch((err) => res.status(400).json("Error: " + err));
              const tokenObject = await catJson(uri);
              tokenObject.tokenId = assets[i].token;
              tokenObject.numOwned = balance;
              tokenObject.price = assets[i].price;
              cidList.push(tokenObject);
            }
          } else {
            const assetOwner = await erc721.ownerOfToken(assets[i].token);
            if (req.user.pk === assetOwner.toLowerCase()) {
              const uri = await erc721
                .getTokenURI(assets[i].token)
                .then((result) => result)
                .catch((err) => res.status(400).json("Error: " + err));
              const tokenObject = await catJson(uri);
              tokenObject.tokenId = assets[i].token;
              tokenObject.price = assets[i].price;
              tokenObject.inmarketplace = assets[i].inmarketplace;
              cidList.push(tokenObject);
            }
          }
        }
      }
      res.json(cidList);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//The following routes have not been implemented by the
//frontend and also are not protected by verify middleware

// get info for an individual user
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//delete a user
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// update info for a user
router.route("/:id").put(async (req, res) => {
  const username = req.body.username;
  const hashPassword = "";
  if (req.body.password) {
    //hash the password
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.password, salt);
  }
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  User.findById(req.params.id)
    .then((user) => {
      if (username) user.username = username;
      if (hashPassword) user.password = hashPassword;
      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;

      user
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get all users
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
