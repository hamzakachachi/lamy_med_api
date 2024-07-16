// models/Calendrier.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connect');
const Medecin = require('./Medecin');
const Delegue = require('./Delegue');
const Produit = require('./Produit');

const Calendrier = sequelize.define('Calendrier', {
    medecin: {
        type: DataTypes.INTEGER,
        references: {
            model: Medecin,
            key: 'id',
        },
        allowNull: false,
    },
    delegue: {
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
    // produit: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Produit,
    //         key: 'id',
    //     },
    //     allowNull: false,
    // },
    // calendrier: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Calendrier,
    //         key: 'id',
    //     },
    //     allowNull: false,
    // },
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

// Define many-to-many relationships using through model
Calendrier.belongsToMany(Produit, { through: ProduitCalendrier, foreignKey: 'calendrierId' });
Produit.belongsToMany(Calendrier, { through: ProduitCalendrier, foreignKey: 'produitId' });

// Define associations for Medecin and Delegue
Calendrier.belongsTo(Medecin, { foreignKey: 'medecin', as:"medecinObject" });
Medecin.hasMany(Calendrier, { foreignKey: 'medecin', as: "calendriers" });

Calendrier.belongsTo(Delegue, { foreignKey: 'delegue', as:"delegueObject"});
Delegue.hasMany(Calendrier, { foreignKey: 'delegue', as: "calendriers"});

module.exports = { Calendrier, ProduitCalendrier };
