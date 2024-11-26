const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Product IDs
  createdAt: { type: Date, default: Date.now }
});


const Tag = mongoose.model('Tag', tagSchema);
module.exports = { Tag };
