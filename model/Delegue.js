// models/Delegue.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Delegue = sequelize.define('Delegue', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    lastActivities: DataTypes.DATE,
    status: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        defaultValue: "user",
        validate: {
            isIn: [['user', 'admin']],
        },
    },
});

module.exports = Delegue;
