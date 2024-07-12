// models/Notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Notification = sequelize.define('Notification', {
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    recipient: DataTypes.STRING,
    type: DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Notification;
