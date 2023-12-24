const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  intitule: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  nbStock: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('Produit', ProduitSchema);
