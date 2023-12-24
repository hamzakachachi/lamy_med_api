const mongoose = require('mongoose');

const DelegueSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
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
  lastActivities: Date,
  status: String,
});

module.exports = mongoose.model('Delegue', DelegueSchema);
