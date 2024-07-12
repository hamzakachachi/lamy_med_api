// models/Medecin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Delegue = require('./Delegue');

const Medecin = sequelize.define('Medecin', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    assignedToId: {
        type: DataTypes.INTEGER,
        references: {
            model: Delegue,
            key: 'id',
        },
    },
    createdById: {
        type: DataTypes.INTEGER,
        references: {
            model: Delegue,
            key: 'id',
        },
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
});

module.exports = Medecin;
