const jwt = require("jsonwebtoken");

// middleware function that checks if user has token
module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  console.log("verify", token);
  if (!token) return res.status(401).send("Access Denied!");
  // const token = localStorage.getItem('token');
  // console.log('token', token);
  // if(!token) return res.status(401).send('Access Denied');

  try {
    //console.log("token", token);
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("verified: ", verified);
    ////
    //
    //to request info about the user in other API's just
    //call for User.findbyOne({_id: req.user}) to get back
    //info from the mongoDB
    //
    ////
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
