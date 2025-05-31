const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});

// Ensure model is only created once
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
