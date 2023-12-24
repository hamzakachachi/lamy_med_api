const mongoose = require('mongoose');

const MedecinSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delegue',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delegue',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medecin', MedecinSchema);

