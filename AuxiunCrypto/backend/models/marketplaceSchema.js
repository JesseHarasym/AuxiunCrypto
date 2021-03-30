//! This is not in use and should be removed

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const marketplaceSchema = new Schema(
  {
    tokenid: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      minLength: 5
    },
    price: {
      type: Number,
      require: true,
      trim: true,
      minLength: 1
    },
    listdate: {
      type: Date,
      require: true,
      minimum: 2020
    }
  },
  {
    timestamps: true
  }
);

const Marketplace = mongoose.model("Marketplace", marketplaceSchema);

module.exports = Marketplace;
