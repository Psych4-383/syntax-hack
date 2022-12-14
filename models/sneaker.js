const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakerSchema = new Schema({
  name: String,
  brand: String,
  color: String,
  gender: Boolean,
  price: Number,
  image: String,
  click: {
    type: Number,
    default: 0
  }
});

const Sneaker = mongoose.model("Sneaker", sneakerSchema);
module.exports = Sneaker;
