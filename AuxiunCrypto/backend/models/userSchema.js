const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      minLength: 5
    },
    password: {
      type: String,
      require: true,
      trim: true,
      minLength: 6
    },
    firstname: {
      type: String,
      require: true,
      minLength: 1
    },
    lastname: {
      type: String,
      require: true,
      minLength: 1
    },
    developer: {
      type: Boolean,
      require: true
    },
    blockchainAccount: {
      type: String,
      require: true,
      unique: true
    },
    coinbalance: {
      type: Number,
      require: true,
      trim: true,
      minLength: 1,
      minimum: 0
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
