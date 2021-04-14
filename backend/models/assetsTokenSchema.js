const { TurnedIn } = require("@material-ui/icons");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetstokenSchema = new Schema(
  {
    token: {
      type: Number,
      require: true,
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
    },
    batchtoken:{
      type: Boolean,
      require: true
    }
  },
  {
    timestamps: true
  }
);

const AssetsToken = mongoose.model("AssetsToken", assetstokenSchema);

module.exports = AssetsToken;
