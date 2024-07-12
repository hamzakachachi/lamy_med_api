// models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Session = sequelize.define('Session', {
    username: DataTypes.STRING,
    deviceId: DataTypes.STRING,
    role: DataTypes.STRING,
    secret: DataTypes.STRING,
});

module.exports = Session;
