// models/Produit.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');

const Produit = sequelize.define('Produit', {
    intitule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    nbStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
    },
});

module.exports = Produit;
