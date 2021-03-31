//! This is not in use and should be removed

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const devzSchema = new Schema(
  {
    email: {
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
    companyname: {
      type: String,
      require: true,
      minLength: 1
    },
    authkey: {
      type: String,
      require: true,
      trim: true,
      minLength: 1
    }
  },
  {
    timestamps: true
  }
);

const Devs = mongoose.model("Devs", devzSchema);

module.exports = Devs;
