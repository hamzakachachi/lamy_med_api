'use strict';
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    recipient: String,
    createdAt: { type: Date, default: Date.now },
});
  
module.exports = mongoose.model('Notification', notificationSchema);

