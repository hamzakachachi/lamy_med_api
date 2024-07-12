// models/Calendrier.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Medecin = require('./Medecin');
const Delegue = require('./Delegue');
const Produit = require('./Produit');

const Calendrier = sequelize.define('Calendrier', {
    medecinId: {
        type: DataTypes.INTEGER,
        references: {
            model: Medecin,
            key: 'id',
        },
        allowNull: false,
    },
    delegueId: {
        type: DataTypes.INTEGER,
        references: {
            model: Delegue,
            key: 'id',
        },
        allowNull: false,
    },
    dateVisite: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1, 2]],
        },
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
});

const ProduitCalendrier = sequelize.define('ProduitCalendrier', {
    produitId: {
        type: DataTypes.INTEGER,
        references: {
            model: Produit,
            key: 'id',
        },
        allowNull: false,
    },
    quantite: {
        type: DataTypes.INTEGER,
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
});

Calendrier.hasMany(ProduitCalendrier, { as: 'produitCalendriers' });
ProduitCalendrier.belongsTo(Calendrier);

module.exports = { Calendrier, ProduitCalendrier };
