'use strict';
const mongoose = require('mongoose');
const Product = require('./Produit');

const CalendrierSchema = new mongoose.Schema({
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medecin',
    required: true,
  }, 
  delegue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delegue',
    required: true,
  },
  dateVisite: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 0,
    enum: [0, 1, 2]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  produitCalendriers: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
      required: true,
    },
    quantite: {
      type: Number,
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
  }],
});

CalendrierSchema.index({ medecin: 1, dateVisite: 1 }, { unique: true });




CalendrierSchema.pre('findOneAndUpdate', async function (next) {
  console.log(this.getUpdate().$set);
  try {
    const productUpdates = this.getUpdate().$set.produitCalendriers.map(async (productData) => {
      const product = await Product.findById(productData.produit);
      const oldCl = await this.findById(this.getFilter()._id);
      if (!product || !oldCl) {
        throw new Error('Product not found');
      }

      const thisProdIndex = oldCl.produitCalendriers.findIndex((item) => item.produit === product._id);
      const realQte = thisProdIndex != -1 ? oldCl.produitCalendriers[thisProdIndex].quantite - this.getUpdate().$set.quantite : this.getUpdate().$set.quantite;
      // Check if the new quantity in stock will be non-negative
      if (product.nbStock - realQte < 0) {
        throw new Error('Vous avez dépassé la quantité en stock pour le produit : ' + product.intitule);
      }

      // Update product stock
      product.stockQuantity -= realQte;

      // Save the updated product
      await product.save();
    });

    await Promise.all(productUpdates);

    next();
  } catch (error) {
    next(error);
  }
});



module.exports = mongoose.model('Calendrier', CalendrierSchema);
