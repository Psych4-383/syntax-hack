const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakerSchema = new Schema({
  name: String,
  brand: String,
  color: String,
  gender: Boolean,
  price: Number,
  image: String,
});

const Sneaker = mongoose.model("Sneaker", sneakerSchema);
module.exports = Sneaker;