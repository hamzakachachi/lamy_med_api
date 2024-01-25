'use strict';
const mongoose = require('mongoose');

const DelegueSchema = new mongoose.Schema({
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
  deleted: {
    type: Boolean,
    default: false,
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
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
});

module.exports = mongoose.model('Delegue', DelegueSchema);
