const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetstokenSchema = new Schema(
  {
    token: {
      type: Number,
      require: true,
      unique: true,
      trim: true
    },
    inmarketplace: {
      type: Boolean,
      require: true
    },
    price: {
      type: Number,
      require: true,
      trim: true,
      minLength: 1
    },
    listdate: {
      type: Date,
      require: false,
      minimum: 2020
    }

    // details object
  },
  {
    timestamps: true
  }
);

const AssetsToken = mongoose.model("AssetsToken", assetstokenSchema);

module.exports = AssetsToken;
