const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  seller: String,
  count: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
