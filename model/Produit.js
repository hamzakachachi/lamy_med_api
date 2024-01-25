'use strict';
const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
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
  deleted: {
    type: Boolean,
    default: false,
  },
  nbStock: {
    type: Number,
    required: true,
    default: 10,
  },
});

module.exports = mongoose.model('Produit', ProduitSchema);
