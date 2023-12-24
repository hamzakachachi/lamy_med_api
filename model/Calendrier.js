const mongoose = require('mongoose');

const CalendrierSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('Calendrier', CalendrierSchema);
